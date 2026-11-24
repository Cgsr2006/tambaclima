(() => {
  const $ = (id) => document.getElementById(id);
  const fields = {
    temperature: $("temperature"),
    location: $("weather-location"),
    condition: $("weather-description"),
    icon: $("weather-symbol"),
    feelsLike: $("feels-like"),
    humidity: $("humidity"),
    wind: $("wind"),
    rain: $("rain-chance"),
    pressure: $("pressure"),
    uv: $("uv-index"),
    uvLevel: $("uv-level"),
    uvMeter: $("uv-meter"),
    uvFill: $("uv-scale-fill"),
    updated: $("weather-updated"),
    status: $("weather-status"),
    alert: $("weather-alert"),
    alertTitle: $("alert-title"),
    alertMessage: $("alert-message"),
    error: $("weather-error"),
    refresh: $("refresh-weather"),
    apiStatus: $("api-status"),
    apiStatusLabel: $("api-status-label"),
    search: $("capital-search-input"),
    options: $("capital-options"),
    searchStatus: $("capital-search-status"),
    panelTemperature: $("panel-temperature"),
    panelCity: $("panel-city"),
    panelDescription: $("panel-description"),
    panelAlertTitle: $("panel-alert-title"),
    panelAlertMessage: $("panel-alert-message"),
    panelHumidity: $("panel-humidity"),
    panelHumidityStatus: $("panel-humidity-status"),
    panelUv: $("panel-uv"),
    panelUvStatus: $("panel-uv-status"),
    panelWind: $("panel-wind"),
    panelWindStatus: $("panel-wind-status"),
    panelPressure: $("panel-pressure"),
    panelPressureStatus: $("panel-pressure-status"),
    panelRain: $("panel-rain"),
    panelRainStatus: $("panel-rain-status"),
  };
  if (!fields.temperature) return;

  const number = (value, decimals = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed.toLocaleString("pt-BR", {
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
        })
      : "—";
  };
  const uvCategory = (uv) => {
    if (uv <= 2) return "Baixo";
    if (uv <= 5) return "Moderado";
    if (uv <= 7) return "Alto";
    if (uv <= 10) return "Muito Alto";
    return "Extremo";
  };
  const iconFor = (description = "") => {
    const text = description.toLocaleLowerCase("pt-BR");
    if (/trovoada|tempestade/.test(text)) return "⛈️";
    if (/chuva|garoa|aguaceiro/.test(text)) return "🌧️";
    if (/nublado|encoberto|nuvem/.test(text)) return "⛅";
    if (/nevoeiro|névoa/.test(text)) return "🌫️";
    return "☀️";
  };
  const capitals = [
    ["Aracaju", "SE"],
    ["Belém", "PA"],
    ["Belo Horizonte", "MG"],
    ["Boa Vista", "RR"],
    ["Brasília", "DF"],
    ["Campo Grande", "MS"],
    ["Cuiabá", "MT"],
    ["Curitiba", "PR"],
    ["Florianópolis", "SC"],
    ["Fortaleza", "CE"],
    ["Goiânia", "GO"],
    ["João Pessoa", "PB"],
    ["Macapá", "AP"],
    ["Maceió", "AL"],
    ["Manaus", "AM"],
    ["Natal", "RN"],
    ["Palmas", "TO"],
    ["Porto Alegre", "RS"],
    ["Porto Velho", "RO"],
    ["Recife", "PE"],
    ["Rio Branco", "AC"],
    ["Rio de Janeiro", "RJ"],
    ["Salvador", "BA"],
    ["São Luís", "MA"],
    ["São Paulo", "SP"],
    ["Teresina", "PI"],
    ["Vitória", "ES"],
  ].map(([city, state]) => ({ city, state }));
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

  function closeCapitalOptions() {
    fields.options.hidden = true;
    fields.search.setAttribute("aria-expanded", "false");
  }

  function showCapitalOptions() {
    const query = normalize(fields.search.value.trim());
    const matches = capitals.filter(({ city }) =>
      normalize(city).includes(query),
    );
    fields.options.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "capital-option-empty";
      empty.textContent = "Nenhuma capital encontrada.";
      fields.options.append(empty);
    } else {
      for (const capital of matches) {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "capital-option";
        option.setAttribute("role", "option");
        option.innerHTML = `<span>${capital.city}</span><small>${capital.state}</small>`;
        option.addEventListener("click", () => {
          fields.search.value = capital.city;
          closeCapitalOptions();
          selectedCapital = { ...capital, updateHero: false };
          loadWeather(capital.city, capital.state, false);
        });
        fields.options.append(option);
      }
    }
    fields.options.hidden = false;
    fields.search.setAttribute("aria-expanded", "true");
  }
  const setStatus = (label, live = false) => {
    const mode = typeof live === "string" ? live : live ? "is-live" : "";
    fields.status.className = `weather-status ${mode}`.trim();
    fields.status.replaceChildren(
      document.createElement("i"),
      document.createTextNode(` ${label}`),
    );
  };

  const apiStates = {
    checking: ["is-loading", "VERIFICANDO"],
    live: ["", "AO VIVO"],
    sessionCache: ["is-cache", "CACHE DA SESSÃO"],
    limitedCache: ["is-cache", "LIMITE · CACHE"],
    limitedDemo: ["is-cache", "LIMITE · DEMO"],
    offlineCache: ["is-cache", "SEM API · CACHE"],
    offlineDemo: ["is-offline", "SEM API · DEMO"],
    missingKeyCache: ["is-demo", "SEM CHAVE · CACHE"],
    missingKey: ["is-demo", "SEM CHAVE · DEMO"],
    offline: ["is-offline", "SEM DADOS"],
  };
  function setApiStatus(state) {
    const [className, label] = apiStates[state] || apiStates.offline;
    fields.apiStatus.className = `live-badge ${className}`.trim();
    fields.apiStatusLabel.textContent = label;
  }

  const cacheKey = (state) => `tambaclima:weather:${state}`;
  function readSessionCache(state) {
    try {
      const entry = JSON.parse(
        sessionStorage.getItem(cacheKey(state)) || "null",
      );
      return entry?.weather ? entry : null;
    } catch {
      return null;
    }
  }
  function writeSessionCache(weather) {
    try {
      sessionStorage.setItem(
        cacheKey(weather.state),
        JSON.stringify({ weather, cachedAt: new Date().toISOString() }),
      );
    } catch (error) {
      console.warn("Não foi possível salvar o cache desta sessão:", error);
    }
  }

  let selectedCapital = { city: "Manaus", state: "AM", updateHero: true };

  let mockDataRequest;
  async function readMockWeather(city, state) {
    mockDataRequest ||= fetch("/src/data/mockedData.json").then((response) => {
      if (!response.ok)
        throw new Error("Não foi possível abrir mockedData.json.");
      return response.json();
    });
    const mocked = await mockDataRequest;
    const cityKey = Object.keys(mocked.cities || {}).find(
      (name) => normalize(name) === normalize(city),
    );
    const data = cityKey ? mocked.cities[cityKey] : null;
    if (!data || data.state !== state) return null;
    return { ...data, city: cityKey, state };
  }

  async function renderFallback(city, state, updateHero, cause) {
    try {
      const cached = readSessionCache(state);
      const weather = cached?.weather || (await readMockWeather(city, state));
      if (!weather) throw new Error(`Não há dados de fallback para ${city}.`);
      const mode = cached ? "cache" : "demo";
      renderWeather(weather, updateHero, mode, cached?.cachedAt);
      const status = /HTTP 429/.test(cause)
        ? cached
          ? "limitedCache"
          : "limitedDemo"
        : /Chave Weatherbit não configurada/.test(cause)
          ? cached
            ? "missingKeyCache"
            : "missingKey"
          : cached
            ? "offlineCache"
            : "offlineDemo";
      setApiStatus(status);
      const fallbackLabel = cached
        ? `Usando dados salvos nesta sessão (${city}, ${state}).`
        : `Exibindo dados de exemplo para ${city}, ${state}; eles não são atuais.`;
      if (updateHero) {
        fields.error.textContent = `${fallbackLabel} Consulta à Weatherbit: ${cause}`;
        fields.error.hidden = false;
      } else fields.searchStatus.textContent = `${fallbackLabel} ${cause}`;
    } catch (fallbackError) {
      setApiStatus("offline");
      const message = `${cause} ${fallbackError.message}`;
      if (updateHero) {
        setStatus("DADOS INDISPONÍVEIS");
        fields.error.textContent = message;
        fields.error.hidden = false;
      } else fields.searchStatus.textContent = message;
    }
  }

  function renderWeather(
    weather,
    updateHero = true,
    mode = "live",
    cachedAt = null,
  ) {
    const uv = Math.max(0, Number(weather.uv) || 0);
    const rain = Number(weather.rainChance) || 0;
    const wind = Number(weather.windKmh) || 0;
    if (updateHero) {
      fields.temperature.innerHTML = `${number(weather.temp)}<span>°C</span>`;
      fields.location.textContent = `${weather.city}, ${weather.state} — Brasil`;
      fields.condition.textContent =
        weather.description || "Condição não informada";
      fields.icon.textContent = iconFor(weather.description);
      fields.feelsLike.textContent = `${number(weather.feelsLike)}°C`;
      fields.humidity.textContent = `${number(weather.humidity)}%`;
      fields.wind.textContent = `${number(wind)} km/h`;
      fields.rain.textContent = `${number(rain)}%`;
      fields.pressure.textContent = `${number(weather.pressure)} hPa`;
    }

    fields.panelTemperature.textContent = `${number(weather.temp)}°C`;
    fields.panelCity.textContent = `${weather.city}, ${weather.state}`;
    fields.panelDescription.textContent =
      weather.description || "Condição não informada";
    fields.panelHumidity.textContent = `${number(weather.humidity)}%`;
    fields.panelHumidityStatus.textContent =
      weather.humidity >= 80
        ? "Muito úmido"
        : weather.humidity >= 60
          ? "Úmido"
          : "Confortável";
    fields.panelUv.textContent = number(uv);
    fields.panelUvStatus.textContent = uvCategory(uv);
    fields.panelWind.innerHTML = `${number(wind)} <small>km/h</small>`;
    fields.panelWindStatus.textContent =
      wind < 20 ? "Fraco" : wind < 40 ? "Moderado" : "Forte";
    fields.panelPressure.innerHTML = `${number(weather.pressure)} <small>hPa</small>`;
    fields.panelPressureStatus.textContent = "Pressão atmosférica";
    fields.panelRain.textContent = `${number(rain)}%`;
    fields.panelRainStatus.textContent =
      rain >= 70
        ? "Alta probabilidade"
        : rain >= 40
          ? "Possível"
          : "Baixa probabilidade";
    const pressure = Number(weather.pressure) || 0;
    const values = {
      humidity: weather.humidity,
      uv: (uv / 11) * 100,
      wind: Math.min(100, wind * 2),
      pressure: ((pressure - 900) / 200) * 100,
      rain,
    };
    for (const [metric, value] of Object.entries(values)) {
      document
        .querySelector(`[data-metric="${metric}"]`)
        ?.style.setProperty(
          "--w",
          `${Math.max(0, Math.min(100, Number(value) || 0))}%`,
        );
    }
    if (uv >= 6) {
      fields.panelAlertTitle.textContent = `Alerta UV ${uvCategory(uv)}`;
      fields.panelAlertMessage.textContent =
        "Evite exposição direta e use proteção solar.";
    } else if (rain >= 70) {
      fields.panelAlertTitle.textContent = "Chance alta de chuva";
      fields.panelAlertMessage.textContent = `Previsão de ${number(rain)}% de chuva.`;
    } else {
      fields.panelAlertTitle.textContent = "Condições monitoradas";
      fields.panelAlertMessage.textContent =
        "Sem alertas climáticos no momento.";
    }

    if (updateHero) {
      fields.uv.textContent = number(uv);
      fields.uvLevel.textContent = uvCategory(uv);
      fields.uvFill.style.width = `${Math.min(100, (uv / 11) * 100)}%`;
      fields.uvMeter.setAttribute("aria-valuenow", String(Math.min(11, uv)));
      if (mode === "demo") {
        fields.updated.textContent = "DADOS DE EXEMPLO";
      } else {
        const timestamp = mode === "cache" ? cachedAt : weather.observedAt;
        const observed = timestamp ? new Date(timestamp) : new Date();
        const time = new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Manaus",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(observed);
        fields.updated.textContent =
          mode === "cache" ? `CACHE · ${time} BRT` : `${time} BRT`;
      }
      if (uv >= 6) {
        fields.alert.hidden = false;
        fields.alertTitle.textContent = `ALERTA UV ${uvCategory(uv).toLocaleUpperCase("pt-BR")}`;
        fields.alertMessage.textContent =
          "Evite exposição direta ao sol e use proteção solar.";
      } else if (rain >= 70) {
        fields.alert.hidden = false;
        fields.alertTitle.textContent = "CHANCE DE CHUVA";
        fields.alertMessage.textContent = `Previsão de ${number(rain)}% de chuva nas próximas horas.`;
      } else fields.alert.hidden = true;
      fields.error.hidden = true;
      setStatus(
        mode === "live"
          ? "DADOS AO VIVO"
          : mode === "cache"
            ? "CACHE DA SESSÃO"
            : "DADOS DE EXEMPLO",
        mode === "live"
          ? "is-live"
          : mode === "cache"
            ? "is-fallback"
            : "is-demo",
      );
    }
    fields.error.hidden = true;
    if (mode === "live") setApiStatus("live");
  }

  async function loadWeather(
    city = "Manaus",
    state = "AM",
    updateHero = true,
    forceRefresh = false,
  ) {
    const cached = readSessionCache(state);
    if (
      !forceRefresh &&
      cached?.weather &&
      normalize(cached.weather.city) === normalize(city) &&
      cached.weather.state === state
    ) {
      renderWeather(cached.weather, updateHero, "cache", cached.cachedAt);
      setApiStatus("sessionCache");
      if (updateHero) fields.error.hidden = true;
      else
        fields.searchStatus.textContent = `Usando dados salvos nesta sessão para ${city}, ${state}.`;
      return;
    }

    const apiKey = window.TAMBACLIMA_CONFIG?.weatherbitApiKey;
    fields.refresh.disabled = true;
    fields.refresh.setAttribute("aria-busy", "true");
    setApiStatus("checking");
    if (updateHero) {
      fields.error.hidden = true;
      setStatus("ATUALIZANDO");
    } else fields.searchStatus.textContent = `Consultando ${city}, ${state}…`;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const options = { signal: controller.signal };
      let weather;
      if (apiKey) {
        // Live Server local: consulta a Weatherbit diretamente com a chave local.
        const params = new URLSearchParams({
          city,
          country: "BR",
          key: apiKey,
          lang: "pt",
        });
        const readWeatherbit = async (url, endpoint) => {
          const response = await fetch(url, options);
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            const details =
              payload.error || payload.message || "Resposta inválida";
            throw new Error(
              `${endpoint}: HTTP ${response.status} — ${details}`,
            );
          }
          return payload;
        };
        const [currentPayload, forecastPayload] = await Promise.all([
          readWeatherbit(
            `https://api.weatherbit.io/v2.0/current?${params}`,
            "Clima atual",
          ),
          readWeatherbit(
            `https://api.weatherbit.io/v2.0/forecast/daily?${params}&days=1`,
            "Previsão diária",
          ),
        ]);
        const current = currentPayload.data?.[0];
        if (!current)
          throw new Error(`A Weatherbit não retornou dados para ${city}.`);
        weather = {
          city: current.city_name || city,
          state: current.state_code || state,
          temp: current.temp,
          feelsLike: current.app_temp,
          description: current.weather?.description,
          humidity: current.rh,
          windKmh: Number(current.wind_spd) * 3.6,
          rainChance: forecastPayload.data?.[0]?.pop ?? 0,
          pressure: current.pres,
          uv: current.uv,
          observedAt: current.ts
            ? new Date(current.ts * 1000).toISOString()
            : new Date().toISOString(),
        };
      } else {
        // Deploy Vercel: a chave permanece no servidor, dentro de /api/weather.
        const query = new URLSearchParams({ city, state });
        const response = await fetch(`/api/weather?${query}`, options);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            `API Vercel: HTTP ${response.status} — ${payload.error || "Resposta inválida"}`,
          );
        }
        weather = payload;
      }
      writeSessionCache(weather);
      renderWeather(weather, updateHero);
      if (!updateHero)
        fields.searchStatus.textContent = `Clima atualizado para ${city}, ${state}.`;
    } catch (error) {
      console.error("Falha ao carregar o clima:", error.message);
      const message =
        error.name === "AbortError"
          ? "A consulta demorou demais. Tente atualizar novamente."
          : error.message || "Verifique sua conexão e tente novamente.";
      await renderFallback(city, state, updateHero, message);
    } finally {
      window.clearTimeout(timeout);
      fields.refresh.disabled = false;
      fields.refresh.removeAttribute("aria-busy");
    }
  }

  fields.refresh.addEventListener("click", () =>
    loadWeather(
      selectedCapital.city,
      selectedCapital.state,
      selectedCapital.updateHero,
      true,
    ),
  );
  fields.search.addEventListener("focus", showCapitalOptions);
  fields.search.addEventListener("input", showCapitalOptions);
  fields.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
    if (event.key === "Escape") closeCapitalOptions();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".capital-search")) closeCapitalOptions();
  });
  function initializeWeather() {
    const cached = readSessionCache("AM");
    const hasManausCache =
      cached?.weather && normalize(cached.weather.city) === normalize("Manaus");
    if (hasManausCache) {
      renderWeather(cached.weather, true, "cache", cached.cachedAt);
      setApiStatus("sessionCache");
    }
    const isLocalLiveServer = ["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    );
    if (!isLocalLiveServer) {
      if (!hasManausCache) loadWeather();
      return;
    }
    const localConfig = document.createElement("script");
    localConfig.src = "/src/scripts/config.js";
    localConfig.onload = () => {
      if (!hasManausCache) loadWeather();
    };
    localConfig.onerror = () => {
      if (!hasManausCache) loadWeather();
    };
    document.head.append(localConfig);
  }
  initializeWeather();
})();
