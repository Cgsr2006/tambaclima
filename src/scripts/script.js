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
          loadWeather(capital.city, capital.state, false);
        });
        fields.options.append(option);
      }
    }
    fields.options.hidden = false;
    fields.search.setAttribute("aria-expanded", "true");
  }
  const setStatus = (label, live = false) => {
    fields.status.className = `weather-status${live ? " is-live" : ""}`;
    fields.status.replaceChildren(
      document.createElement("i"),
      document.createTextNode(` ${label}`),
    );
  };

  function renderWeather(weather, updateHero = true) {
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
      const observed = weather.observedAt
        ? new Date(weather.observedAt)
        : new Date();
      fields.updated.textContent =
        new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Manaus",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(observed) + " BRT";
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
      setStatus("DADOS ATUALIZADOS", true);
    }
  }

  async function loadWeather(city = "Manaus", state = "AM", updateHero = true) {
    const apiKey = window.TAMBACLIMA_CONFIG?.weatherbitApiKey;
    if (!apiKey) {
      const message = "Configure a chave Weatherbit em src/scripts/config.js.";
      if (updateHero) {
        setStatus("API NÃO CONFIGURADA");
        fields.error.textContent = message;
        fields.error.hidden = false;
      } else fields.searchStatus.textContent = message;
      return;
    }
    fields.refresh.disabled = true;
    fields.refresh.setAttribute("aria-busy", "true");
    if (updateHero) {
      fields.error.hidden = true;
      setStatus("ATUALIZANDO");
    } else fields.searchStatus.textContent = `Consultando ${city}, ${state}…`;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      // Para capitais brasileiras, envie cidade e país; não combine também o estado.
      const params = new URLSearchParams({
        city,
        country: "BR",
        key: apiKey,
        lang: "pt",
      });
      const options = { signal: controller.signal };
      const readWeatherbit = async (url, endpoint) => {
        const response = await fetch(url, options);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const details =
            payload.error || payload.message || "Resposta inválida";
          throw new Error(`${endpoint}: HTTP ${response.status} — ${details}`);
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
      renderWeather(
        {
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
          observedAt:
            current.ob_date && current.ob_time
              ? `${current.ob_date}T${current.ob_time}:00-04:00`
              : new Date().toISOString(),
        },
        updateHero,
      );
      if (!updateHero)
        fields.searchStatus.textContent = `Clima atualizado para ${city}, ${state}.`;
    } catch (error) {
      console.error("Falha ao carregar o clima:", error.message);
      const message =
        error.name === "AbortError"
          ? "A consulta demorou demais. Tente atualizar novamente."
          : error.message || "Verifique sua conexão e tente novamente.";
      if (updateHero) {
        setStatus("DADOS INDISPONÍVEIS");
        fields.error.textContent = message;
        fields.error.hidden = false;
      } else
        fields.searchStatus.textContent = `Não foi possível carregar ${city}. ${message}`;
    } finally {
      window.clearTimeout(timeout);
      fields.refresh.disabled = false;
      fields.refresh.removeAttribute("aria-busy");
    }
  }

  fields.refresh.addEventListener("click", loadWeather);
  fields.search.addEventListener("focus", showCapitalOptions);
  fields.search.addEventListener("input", showCapitalOptions);
  fields.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
    if (event.key === "Escape") closeCapitalOptions();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".capital-search")) closeCapitalOptions();
  });
  loadWeather();
})();
