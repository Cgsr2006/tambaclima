const capitals = new Map([
  ["aracaju", "SE"],
  ["belém", "PA"],
  ["belo horizonte", "MG"],
  ["boa vista", "RR"],
  ["brasília", "DF"],
  ["campo grande", "MS"],
  ["cuiabá", "MT"],
  ["curitiba", "PR"],
  ["florianópolis", "SC"],
  ["fortaleza", "CE"],
  ["goiânia", "GO"],
  ["joão pessoa", "PB"],
  ["macapá", "AP"],
  ["maceió", "AL"],
  ["manaus", "AM"],
  ["natal", "RN"],
  ["palmas", "TO"],
  ["porto alegre", "RS"],
  ["porto velho", "RO"],
  ["recife", "PE"],
  ["rio branco", "AC"],
  ["rio de janeiro", "RJ"],
  ["salvador", "BA"],
  ["são luís", "MA"],
  ["são paulo", "SP"],
  ["teresina", "PI"],
  ["vitória", "ES"],
]);

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function jsonResponse(body, status = 200, cache = false) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      "Cache-Control": cache
        ? "public, s-maxage=300, stale-while-revalidate=600"
        : "no-store",
    },
  });
}

async function getWeatherbitJson(url, signal) {
  const response = await fetch(url, { signal });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      body.error || body.message || "Erro na Weatherbit.",
    );
    error.status = response.status;
    throw error;
  }
  return body;
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Método não permitido." }, 405);
    }

    const url = new URL(request.url);
    const city = (url.searchParams.get("city") || "").trim();
    const state = (url.searchParams.get("state") || "").trim().toUpperCase();
    const normalizedCity = city
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
    const expectedState = [...capitals].find(([name]) => {
      const normalizedName = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");
      return normalizedName === normalizedCity;
    })?.[1];

    if (!expectedState || expectedState !== state) {
      return jsonResponse(
        { error: "Selecione uma das capitais brasileiras disponíveis." },
        400,
      );
    }

    const apiKey = process.env.WEATHERBIT_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        { error: "WEATHERBIT_API_KEY não foi configurada na Vercel." },
        503,
      );
    }

    const params = new URLSearchParams({
      city,
      country: "BR",
      key: apiKey,
      lang: "pt",
    });
    const timeout = AbortSignal.timeout(8000);

    try {
      const [currentPayload, forecastPayload] = await Promise.all([
        getWeatherbitJson(
          `https://api.weatherbit.io/v2.0/current?${params}`,
          timeout,
        ),
        getWeatherbitJson(
          `https://api.weatherbit.io/v2.0/forecast/daily?${params}&days=1`,
          timeout,
        ),
      ]);
      const current = currentPayload.data?.[0];
      if (!current) {
        return jsonResponse(
          { error: `A Weatherbit não retornou dados para ${city}.` },
          502,
        );
      }

      return jsonResponse(
        {
          city: current.city_name || city,
          state: current.state_code || state,
          temp: current.temp,
          feelsLike: current.app_temp,
          description: current.weather?.description || "Condição não informada",
          humidity: current.rh,
          windKmh: Number(current.wind_spd) * 3.6,
          rainChance: forecastPayload.data?.[0]?.pop ?? 0,
          pressure: current.pres,
          uv: current.uv,
          observedAt: current.ts
            ? new Date(current.ts * 1000).toISOString()
            : new Date().toISOString(),
        },
        200,
        true,
      );
    } catch (error) {
      console.error("Erro ao consultar Weatherbit:", error.message);
      const status = error.status === 429 ? 429 : 502;
      return jsonResponse(
        { error: error.message || "Não foi possível consultar a Weatherbit." },
        status,
      );
    }
  },
};
