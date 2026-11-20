/*
 * Hero Section — Tambaclima
 *
 * Para conectar a API Weatherbit, defina a chave antes deste arquivo:
 * window.TAMBACLIMA_CONFIG = { weatherbitKey: "SUA_CHAVE" };
 *
 * Não publique uma chave privada em repositório público. O ideal é usar
 * uma função serverless/proxy para proteger a chave. Sem chave configurada,
 * a interface mantém os valores indisponíveis em vez de inventar dados atuais.
 */
(() => {
  const API_URL = "https://api.weatherbit.io/v2.0/current";
  const elements = {
    temperature: document.getElementById("temperature"),
    feelsLike: document.getElementById("feels-like"),
    description: document.getElementById("weather-description"),
    humidity: document.getElementById("humidity"),
    wind: document.getElementById("wind"),
    rainChance: document.getElementById("rain-chance"),
    status: document.getElementById("weather-status"),
    updated: document.getElementById("weather-updated"),
    refresh: document.getElementById("refresh-weather"),
    symbol: document.getElementById("weather-symbol"),
  };

  if (!elements.temperature) return;

  const weatherIcons = {
    clear: '<svg viewBox="0 0 96 96"><circle cx="48" cy="48" r="18"/><path d="M48 8v12M48 76v12M8 48h12M76 48h12M19 19l9 9M68 68l9 9M77 19l-9 9M28 68l-9 9"/></svg>',
    clouds: '<svg viewBox="0 0 96 96"><circle cx="36" cy="30" r="15"/><path class="cloud" d="M20 65c0-9 7-16 16-16 3-10 12-16 22-13 8 2 13 9 13 17 8 0 14 6 14 13s-6 13-14 13H34c-8 0-14-6-14-14Z"/></svg>',
    rain: '<svg viewBox="0 0 96 96"><path class="cloud" d="M15 52c0-9 7-16 16-16 3-10 12-16 22-13 8 2 13 9 13 17 8 0 14 6 14 13s-6 13-14 13H29c-8 0-14-6-14-14Z"/><path d="m33 73-5 12m25-12-5 12m25-12-5 12" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/></svg>',
    storm: '<svg viewBox="0 0 96 96"><path class="cloud" d="M15 48c0-9 7-16 16-16 3-10 12-16 22-13 8 2 13 9 13 17 8 0 14 6 14 13s-6 13-14 13H29c-8 0-14-6-14-14Z"/><path d="m51 62-12 19h12l-5 13 20-24H54l7-8Z" fill="#fcd34d" stroke="#fcd34d"/></svg>',
  };

  function setStatus(label, mode = "") {
    elements.status.className = `weather-status ${mode}`.trim();
    elements.status.innerHTML = `<i></i> ${label}`;
  }

  function formatNumber(value, digits = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(digits).replace(".", ",") : "—";
  }

  function updateWeather(data) {
    const weather = data.weather || {};
    const code = Number(weather.code);
    const isStorm = code >= 200 && code < 300;
    const isRain = code >= 300 && code < 600;
    const isCloudy = code >= 700 || code === 801 || code === 802;
    elements.temperature.innerHTML = `${formatNumber(data.temp)}<span>°C</span>`;
    elements.feelsLike.textContent = `${formatNumber(data.app_temp)}°C`;
    elements.description.textContent = weather.description || "Condição não informada";
    elements.humidity.innerHTML = `${formatNumber(data.rh)}<small>%</small>`;
    elements.wind.innerHTML = `${formatNumber(Number(data.wind_spd) * 3.6)}<small> km/h</small>`;
    elements.rainChance.innerHTML = `${formatNumber(data.precip, 1)}<small> mm</small>`;
    elements.symbol.innerHTML = isStorm ? weatherIcons.storm : isRain ? weatherIcons.rain : isCloudy ? weatherIcons.clouds : weatherIcons.clear;
    const observedAt = data.ob_time ? `Atualizado às ${data.ob_time} (horário local)` : "Dados meteorológicos atualizados.";
    elements.updated.textContent = observedAt;
    setStatus("DADOS ATUALIZADOS", "is-live");
  }

  async function loadWeather() {
    const apiKey = window.TAMBACLIMA_CONFIG?.weatherbitKey;
    if (!apiKey || apiKey === "SUA_CHAVE") {
      setStatus("API NÃO CONFIGURADA");
      elements.description.textContent = "Aguardando conexão com a API meteorológica.";
      elements.updated.textContent = "Configure a chave Weatherbit para exibir dados atuais.";
      return;
    }

    elements.refresh.disabled = true;
    elements.refresh.setAttribute("aria-busy", "true");
    setStatus("ATUALIZANDO");
    try {
      const url = new URL(API_URL);
      url.search = new URLSearchParams({
        city: "Manaus",
        country: "BR",
        key: apiKey,
        lang: "pt",
      }).toString();

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      let response;
      try {
        response = await fetch(url, { signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`Weatherbit respondeu com HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload.data?.length) throw new Error("A API não retornou dados para Manaus.");
      updateWeather(payload.data[0]);
    } catch (error) {
      console.error("Não foi possível carregar o clima de Manaus:", error);
      setStatus("DADOS INDISPONÍVEIS");
      elements.description.textContent = "Não foi possível consultar o clima agora.";
      elements.updated.textContent = "Verifique a conexão e tente novamente.";
    } finally {
      elements.refresh.disabled = false;
      elements.refresh.removeAttribute("aria-busy");
    }
  }

  elements.refresh.addEventListener("click", loadWeather);
  loadWeather();
})();
