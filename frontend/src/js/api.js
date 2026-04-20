export const getEnv = (key) => {
  return import.meta.env[key];
};

export const fetchWeather = async (city = 'Paris') => {
  const token = getEnv('WEATHER_API_KEY');
  if(!token) return null;
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}&units=metric&lang=fr`);
    if(!res.ok) throw new Error('Weather API limit/error');
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const fetchNews = async () => {
  const token = getEnv('NEWS_API_KEY');
  if(!token) return [];
  try {
    // Broadened the search to just grab general french news to guarantee results
    const targetUrl = `https://newsapi.org/v2/top-headlines?language=fr&apiKey=${token}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl);
    if(!res.ok) throw new Error('News API error');
    const data = await res.json();
    if (data.articles && data.articles.length > 0) return data.articles.slice(0, 8);
    
    // Fallback if top-headlines fails
    const backupUrl = `https://newsapi.org/v2/everything?q=tech&language=fr&apiKey=${token}`;
    const backupRes = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(backupUrl)}`);
    const backupData = await backupRes.json();
    return backupData.articles ? backupData.articles.slice(0, 8) : [];
  } catch (e) {
    console.error("News API:", e);
    return [{ title: "Impossible de charger les news. (Erreur CORS / Limite atteinte)", url: "#" }];
  }
};

export const fetchFinance = async (symbols = ['AAPL', 'MSFT', 'TSLA']) => {
  const token = getEnv('FINANCE_API_KEY');
  if(!token) return [];
  try {
    const results = await Promise.all(symbols.map(async sym => {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${token}`);
      const data = await res.json();
      return { symbol: sym, current: data.c, previous: data.pc };
    }));
    return results;
  } catch (e) {
    console.error("Finance API:", e);
    return [];
  }
};

export const fetchFootball = async () => {
  const token = getEnv('FOOTBALL_API_KEY');
  if(!token) return [];
  try {
    const today = new Date().toISOString().split('T')[0];
    const targetUrl = `https://v3.football.api-sports.io/fixtures?date=${today}`;
    
    // Bypass corsproxy as api-sports supports CORS natively and the proxy strips custom authentication headers
    const res = await fetch(targetUrl, {
      headers: {
        'x-apisports-key': token
      }
    });
    
    const data = await res.json();
    if (!data.response) return [];

    // Top Leagues IDs: 39 (PL), 140 (La Liga), 135 (Serie A), 61 (Ligue 1), 78 (Bundesliga), 2 (UCL), 3 (UEL)
    const majorLeagues = [39, 140, 135, 61, 78, 2, 3];
    const filtered = data.response.filter(m => m.league && majorLeagues.includes(m.league.id));
    
    return filtered.slice(0, 7);
  } catch (e) {
    console.error("Football API:", e);
    return [];
  }
};
