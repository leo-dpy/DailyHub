/**
 * DAILYHUB - DASHBOARD SPA
 * Version Mondiale & Sécurisée (Anti-Page Blanche)
 */

// --- 1. ÉTAT GLOBAL (STATE) ---
const state = {
    theme: localStorage.getItem('theme') || 'dark',
    currentTime: new Date(),
    weather: { city: 'Paris', data: null, loading: true, error: null },
    tasks: JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, text: 'Ouvrir avec Live Server', completed: false },
        { id: 2, text: 'Tester le suivi de colis (ex: FR123)', completed: false }
    ],
    config: { 
        weatherUrl: 'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FParis',
        alphaVantageKey: 'CVGUFKJA1YRU1XX4',
        newsDataKey: 'pub_361297f18be3480d97ef33793a029b67',
        footballDataKey: 'e24e6b69d8aa4c83972821044f53dcb8'
    },
    music: {
        isPlaying: false,
        volume: 50,
        currentTrackId: 0,
        tracks: [
            { id: 0, title: 'Lofi Girl - Study Beats', videoId: 'jfKfPfyJRdk' },
            { id: 1, title: 'Synthwave Radio', videoId: '4xDzrXVKICs' }
        ],
        player: null
    },
    package: {
        number: '',
        status: 'En attente',
        progress: 0
    },
    stocks: { data: [], loading: true, error: null },
    news: { data: [], loading: true, error: null },
    football: { data: [], loading: true, error: null }
};

// --- 2. FONCTIONS DE RENDU (DOM) ---

function initialRender() {
    const app = document.getElementById('app');
    if (!app) return;

    document.documentElement.setAttribute('data-theme', state.theme);
    app.innerHTML = '';
    app.appendChild(createHeader());

    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';
    grid.id = 'dashboard-grid';

    grid.appendChild(createWidgetContainer('weather', 'col-6'));
    grid.appendChild(createWidgetContainer('stocks', 'col-3'));
    grid.appendChild(createWidgetContainer('football', 'col-3'));
    grid.appendChild(createWidgetContainer('package', 'col-4'));
    grid.appendChild(createWidgetContainer('news', 'col-4'));
    grid.appendChild(createWidgetContainer('tasks', 'col-4'));
    grid.appendChild(createWidgetContainer('music', 'col-6'));
    grid.appendChild(createWidgetContainer('calculator', 'col-6'));

    app.appendChild(grid);
    updateAllWidgets();
}

function createHeader() {
    const header = document.createElement('header');
    header.className = 'header fade-in';
    const hour = state.currentTime.getHours();
    const greeting = hour < 18 ? (hour < 12 ? "Bon matin" : "Bonjour") : "Bonsoir";

    header.innerHTML = `
        <div class="header-left">
            <div class="logo-section" style="margin-bottom: 0;"><h1>DailyHub</h1></div>
            <div class="greeting-text">${greeting}, <span>Utilisateur</span></div>
        </div>
        <div class="header-center">
            <div class="header-clock">${state.currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
            <div class="header-date">${state.currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        <div class="header-right">
            <button class="btn-toggle" onclick="toggleTheme()" style="width: 45px; height: 45px; border-radius: 50%;"><i class="fas ${state.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
        </div>
    `;
    return header;
}

function updateAllWidgets() {
    renderWeatherWidget();
    renderStockWidget();
    renderFootballWidget();
    renderNewsWidget();
    renderTaskManagerWidget();
    renderMusicPlayerWidget();
    renderCalculatorWidget();
    renderPackageTrackerWidget();
}

function createWidgetContainer(id, sizeClass) {
    const container = document.createElement('div');
    container.id = `widget-${id}`;
    container.className = `widget ${sizeClass} fade-in`;
    return container;
}

// --- 3. WIDGETS SPÉCIFIQUES ---

function renderPackageTrackerWidget() {
    const container = document.getElementById('widget-package');
    if (!container) return;

    const s1 = state.package.progress >= 25 ? 'completed' : (state.package.progress > 0 ? 'active' : '');
    const s2 = state.package.progress >= 50 ? 'completed' : (state.package.progress === 25 ? 'active' : '');
    const s3 = state.package.progress >= 75 ? 'completed' : (state.package.progress === 50 ? 'active' : '');
    const s4 = state.package.progress === 100 ? 'completed' : (state.package.progress === 75 ? 'active' : '');

    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-truck-fast"></i> <span>Suivi de Colis</span></div></div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
            <input type="text" id="track-input" placeholder="N° de suivi (ex: 8J940)" class="btn-toggle" style="flex: 1; text-align: left; font-size: 0.8rem;" value="${state.package.number}">
            <button class="btn-toggle" onclick="handleTrackPackage()"><i class="fas fa-search"></i></button>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="package-timeline" style="margin: 1rem 0;">
                <div class="timeline-progress" style="width: ${state.package.progress * 0.8}%"></div>
                <div class="step ${s1}"><div class="step-icon"><i class="fas fa-box"></i></div></div>
                <div class="step ${s2}"><div class="step-icon"><i class="fas fa-warehouse"></i></div></div>
                <div class="step ${s3}"><div class="step-icon"><i class="fas fa-truck"></i></div></div>
                <div class="step ${s4}"><div class="step-icon"><i class="fas fa-house-chimney"></i></div></div>
            </div>
            <div style="text-align: center; font-size: 0.85rem;">
                <p style="color: var(--accent-color); font-weight: 700;">${state.package.status}</p>
                ${state.package.number ? `<p style="font-size: 0.7rem; color: var(--text-secondary);">Colis: ${state.package.number}</p>` : ''}
            </div>
        </div>
    `;
}

function renderMusicPlayerWidget() {
    const container = document.getElementById('widget-music');
    if (!container) return;

    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="widget-header"><div class="widget-title"><i class="fas fa-music"></i> <span>Lecteur Interactif</span></div></div>
            <div id="music-ui-content" style="display: flex; flex-direction: column; overflow: hidden; flex: 1;"></div>
            <div id="youtube-player" style="position: absolute; width:1px; height:1px; opacity:0;"></div>
        `;
    }

    const ui = document.getElementById('music-ui-content');
    if (!ui) return;

    ui.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex: 1;">
            <div style="width: 100px; text-align: center;">
                <div onclick="togglePlayback()" style="width: 60px; height: 60px; background: var(--accent-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.5rem; cursor: pointer; box-shadow: 0 0 15px var(--accent-glow);">
                    <i class="fas ${state.music.isPlaying ? 'fa-pause' : 'fa-play'}" style="color: white; font-size: 1.5rem;"></i>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                    <i class="fas fa-volume-up" style="font-size: 0.7rem;"></i>
                    <input type="range" min="0" max="100" value="${state.music.volume}" oninput="updateVolume(this.value)" style="width: 50px;">
                </div>
            </div>
            <div style="flex: 1;">
                <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem;">${state.music.tracks[state.music.currentTrackId].title}</p>
                <input type="range" id="track-progress" min="0" max="100" value="0" onchange="seekTrack(this.value)" style="width: 100%; margin-bottom: 0.5rem;">
                <div style="display: flex; gap: 0.5rem;">
                    ${state.music.tracks.map((t, idx) => `
                        <button class="btn-toggle" style="font-size:0.7rem; padding: 0.2rem 0.5rem; ${idx === state.music.currentTrackId ? 'background: var(--accent-color); color: white;' : ''}" onclick="changeTrack(${idx})">${idx + 1}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTaskManagerWidget() {
    const container = document.getElementById('widget-tasks');
    if (!container) return;
    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-tasks"></i> <span>Tâches</span></div></div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="text" id="task-input" placeholder="Ajouter..." class="btn-toggle" style="flex: 1; text-align: left;">
            <button class="btn-toggle" onclick="handleAddTask()"><i class="fas fa-plus"></i></button>
        </div>
        <div class="widget-content-scroll">
            ${state.tasks.map(task => `
                <div style="display: flex; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <span style="flex: 1; margin: 0 0.5rem; font-size: 0.85rem; ${task.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${task.text}</span>
                    <button onclick="deleteTask(${task.id})" style="background: none; border: none; color: var(--danger); cursor: pointer;"><i class="fas fa-trash"></i></button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCalculatorWidget() {
    const container = document.getElementById('widget-calculator');
    if (container) {
        container.innerHTML = `
            <div class="widget-header" style="margin-bottom: 0.5rem;"><div class="widget-title"><i class="fas fa-calculator"></i> <span>Calculatrice</span></div></div>
            <div id="calc-display" style="text-align: right; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem; font-size: 1.2rem; font-family: monospace; min-height: 2.2rem;">${calcExpression || '0'}</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; height: calc(100% - 4rem);">
                ${['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map(btn => `<button class="btn-toggle" style="padding: 0.2rem;" onclick="handleCalc('${btn}')">${btn}</button>`).join('')}
            </div>
        `;
    }
}

function renderWeatherWidget() {
    const container = document.getElementById('widget-weather');
    if (!container) return;

    const getWeatherIcon = (code) => {
        if (code === 0) return '☀️'; // Ensoleillé
        if (code <= 3) return '🌤️'; // Partiellement nuageux
        if (code <= 48) return '🌫️'; // Brouillard
        if (code <= 57) return '🌧️'; // Bruine
        if (code <= 67) return '🌧️'; // Pluie
        if (code <= 77) return '❄️'; // Neige
        if (code <= 82) return '🌧️'; // Averses
        if (code <= 99) return '⚡'; // Orage
        return '☁️';
    };

    const getWeatherDesc = (code) => {
        if (code === 0) return 'Ciel dégagé';
        if (code <= 3) return 'Partiellement nuageux';
        if (code <= 48) return 'Brouillard';
        if (code <= 67) return 'Pluie';
        if (code <= 99) return 'Orages';
        return 'Nuageux';
    };

    const d = state.weather.data;
    const hasCurrent = d && d.current;
    const hasDaily = d && d.daily && d.daily.temperature_2m_max && d.daily.temperature_2m_max.length > 0;

    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-cloud-sun"></i> <span>Météo Paris</span></div></div>
        <div class="weather-content" style="display: flex; flex-direction: column; height: 100%; justify-content: center;">
            ${state.weather.loading ? '<p>Chargement...</p>' :
            hasCurrent ? `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 3rem; font-weight: 800; line-height: 1;">${Math.round(d.current.temperature_2m)}°C</span>
                        ${hasDaily ? `
                            <div style="font-size: 0.8rem; margin-top: 0.2rem; font-weight: 600;">
                                <span style="color: var(--danger);">${Math.round(d.daily.temperature_2m_max[0])}°</span> / 
                                <span style="color: var(--accent-light);">${Math.round(d.daily.temperature_2m_min[0])}°</span>
                            </div>
                        ` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 2.5rem; display: block;">${getWeatherIcon(d.current.weather_code)}</span>
                        <p style="font-weight: 700; margin-top: 0.2rem;">${getWeatherDesc(d.current.weather_code)}</p>
                    </div>
                </div>
                <div style="margin-top: 0.8rem; font-size: 0.75rem; color: var(--text-secondary); display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem;">
                    <span><i class="fas fa-droplet"></i> ${d.current.relative_humidity_2m}%</span>
                    <span><i class="fas fa-wind"></i> ${d.current.wind_speed_10m} km/h</span>
                    ${hasDaily ? `<span><i class="fas fa-sun"></i> UV: ${d.daily.uv_index_max[0]}</span>` : ''}
                </div>
              ` : `<p style="opacity:0.6;">${state.weather.error || 'Indisponible'}</p>`}
        </div>
    `;
}

function renderStockWidget() {
    const container = document.getElementById('widget-stocks');
    if (!container) return;
    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-chart-line"></i> <span>Marchés Mondiaux</span></div>
        ${state.stocks.error ? `<span style="font-size: 0.6rem; color: var(--warning);">${state.stocks.error}</span>` : ''}
        </div>
        <div class="widget-content-scroll">
            ${state.stocks.loading ? '<p>Chargement...</p>' : state.stocks.data.map(s => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-weight: 700;">${s.name}</span>
                    <div style="text-align: right;">
                        <span style="font-family: monospace;">${s.price}</span>
                        <span style="color: ${s.isUp ? 'var(--success)' : 'var(--danger)'}; font-size: 0.8rem; margin-left: 0.5rem;">${s.isUp ? '+' : ''}${s.percent}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderFootballWidget() {
    const container = document.getElementById('widget-football');
    if (!container) return;
    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-futbol"></i> <span>Football</span></div>
        ${state.football.error ? `<span style="font-size: 0.6rem; color: var(--warning);">${state.football.error}</span>` : ''}
        </div>
        <div class="widget-content-scroll">
            ${state.football.loading ? '<p>Chargement...</p>' : (state.football.data && state.football.data.length > 0 ? state.football.data.map(m => `
                <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
                    <div style="font-size: 0.6rem; color: var(--accent-color); font-weight: 700; margin-bottom: 0.2rem; text-transform: uppercase;">${m.competition}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.homeTeam}</span>
                        <span style="font-weight: 800; color: var(--text-primary); font-size: 0.9rem; margin: 0 0.5rem;">${m.scoreHome} - ${m.scoreAway}</span>
                        <span style="flex: 1; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.awayTeam}</span>
                    </div>
                    <div style="font-size: 0.6rem; color: var(--text-secondary); text-align: center; margin-top: 0.2rem; opacity: 0.7;">${m.status === 'IN_PLAY' || m.status === 'LIVE' ? '🔴 EN DIRECT' : (m.status === 'TIMED' || m.status === 'SCHEDULED' ? 'À VENIR' : 'TERMINÉ')}</div>
                </div>
            `).join('') : '<p style="font-size: 0.8rem; opacity: 0.6; text-align: center; margin-top: 1rem;">Aucun match récent ou prévu.</p>')}
        </div>
    `;
}

function renderNewsWidget() {
    const container = document.getElementById('widget-news');
    if (!container) return;
    container.innerHTML = `
        <div class="widget-header"><div class="widget-title"><i class="fas fa-newspaper"></i> <span>Actualités Tech</span></div></div>
        <div class="widget-content-scroll">
            ${state.news.loading ? '<p>Chargement...</p>' : (state.news.data && state.news.data.length > 0 ? state.news.data.map(n => `
                <div style="margin-bottom: 0.8rem;">
                    <a href="${n.link}" target="_blank" style="text-decoration: none; color: var(--text-primary); font-size: 0.85rem; font-weight: 600; display: block;">${n.title}</a>
                    <p style="font-size: 0.7rem; color: var(--text-secondary);">${n.source_id || 'News'}</p>
                </div>
            `).join('') : '<p>Aucune actualit disponible</p>')}
        </div>
    `;
}

// --- 4. APPELS API & DONNÉES (FETCH) ---

async function fetchWeather() {
    try {
        const res = await fetch(state.config.weatherUrl);
        state.weather.data = await res.json();
    } catch (e) { state.weather.error = "Erreur Météo"; }
    finally { state.weather.loading = false; renderWeatherWidget(); }
}

async function fetchStocks() {
    state.stocks.loading = true;
    renderStockWidget();
    try {
        const symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'];
        const results = [];
        
        for (const symbol of symbols) {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${state.config.alphaVantageKey}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data['Note']) break; // Rate limit

            const quote = data['Global Quote'];
            if (quote) {
                results.push({
                    name: symbol,
                    price: parseFloat(quote['05. price']).toFixed(2),
                    percent: quote['10. change percent'].replace('%', ''),
                    isUp: parseFloat(quote['09. change']) >= 0
                });
            }
        }
        state.stocks.data = results;
    } catch (e) {
        state.stocks.error = "CORS / API Error";
    } finally {
        state.stocks.loading = false;
        renderStockWidget();
    }
}

async function fetchFootball() {
    state.football.loading = true;
    renderFootballWidget();
    try {
        // NOTE: Football-Data.org BLOQUE généralement les requêtes directes via CORS.
        const today = new Date().toISOString().split('T')[0];
        const url = `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}`;
        
        let res = await fetch(url, { headers: { 'X-Auth-Token': state.config.footballDataKey } });
        let data = await res.json();
        
        let matchesRaw = data.matches || [];
        if (matchesRaw.length === 0) {
            const backupUrl = `https://api.football-data.org/v4/matches?status=FINISHED&limit=10`;
            res = await fetch(backupUrl, { headers: { 'X-Auth-Token': state.config.footballDataKey } });
            data = await res.json();
            matchesRaw = data.matches || [];
        }

        state.football.data = matchesRaw.slice(0, 5).map(m => ({
            homeTeam: m.homeTeam.shortName || m.homeTeam.name,
            awayTeam: m.awayTeam.shortName || m.awayTeam.name,
            scoreHome: m.score.fullTime.home ?? 0,
            scoreAway: m.score.fullTime.away ?? 0,
            status: m.status,
            competition: m.competition ? m.competition.name : "Match"
        }));
    } catch (e) {
        state.football.error = "Bloqué par CORS";
    } finally {
        state.football.loading = false;
        renderFootballWidget();
    }
}

async function fetchNews() {
    state.news.loading = true;
    renderNewsWidget();
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${state.config.newsDataKey}&language=fr&category=technology`;
        const res = await fetch(url);
        const data = await res.json();
        state.news.data = data.results || [];
    } catch (e) {
        state.news.error = "API Error";
    } finally {
        state.news.loading = false;
        renderNewsWidget();
    }
}


// --- 5. LOGIQUE DES WIDGETS (EVENTS) ---

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    initialRender();
}

function handleTrackPackage() {
    const input = document.getElementById('track-input');
    if (!input || !input.value.trim()) return;

    state.package.number = input.value.trim();

    // Logique : génère un statut aléatoire pour le numéro tapé
    const statuses = ['Préparation', 'Expédié', 'En transit', 'Livré'];
    const progresses = [25, 50, 75, 100];
    const randomIndex = Math.floor(Math.random() * statuses.length);

    state.package.status = statuses[randomIndex];
    state.package.progress = progresses[randomIndex];

    renderPackageTrackerWidget();
}

function handleAddTask() {
    const input = document.getElementById('task-input');
    if (input && input.value.trim()) {
        state.tasks.push({ id: Date.now(), text: input.value.trim(), completed: false });
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
        renderTaskManagerWidget();
    }
}

function toggleTask(id) {
    state.tasks = state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    renderTaskManagerWidget();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    renderTaskManagerWidget();
}

let calcExpression = '';
function handleCalc(btn) {
    if (btn === 'C') { calcExpression = ''; }
    else if (btn === '=') { try { calcExpression = eval(calcExpression).toString(); } catch { calcExpression = 'Error'; } }
    else { calcExpression += btn; }
    renderCalculatorWidget();
}

// --- 6. LOGIQUE YOUTUBE (LECTEUR AVANCÉ) ---

function togglePlayback() {
    if (!state.music.player || !state.music.player.playVideo) return;
    if (state.music.isPlaying) {
        state.music.player.pauseVideo();
    } else {
        state.music.player.unMute();
        state.music.player.playVideo();
    }
    state.music.isPlaying = !state.music.isPlaying;
    renderMusicPlayerWidget();
}

function changeTrack(idx) {
    if (!state.music.player || !state.music.player.loadVideoById) return;
    state.music.currentTrackId = idx;
    state.music.player.loadVideoById(state.music.tracks[idx].videoId);
    state.music.player.unMute();
    state.music.isPlaying = true;
    renderMusicPlayerWidget();
}

function updateVolume(val) {
    state.music.volume = val;
    if (state.music.player && state.music.player.setVolume) {
        state.music.player.setVolume(val);
        if (val > 0 && state.music.player.unMute) state.music.player.unMute();
    }
}

function seekTrack(val) {
    if (state.music.player && state.music.player.getDuration) {
        const total = state.music.player.getDuration();
        state.music.player.seekTo((val / 100) * total, true);
    }
}

function initYouTubeAPI() {
    // Si l'API est déjà chargée, on appelle direct
    if (window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady();
        return;
    }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// On attache à window pour que l'API YouTube puisse le trouver (même en mode module)
window.onYouTubeIframeAPIReady = function () {
    if (!document.getElementById('youtube-player')) return;
    
    state.music.player = new YT.Player('youtube-player', {
        height: '0', width: '0',
        videoId: state.music.tracks[0].videoId,
        playerVars: { 'playsinline': 1, 'controls': 0, 'disablekb': 1 },
        events: {
            'onReady': (e) => {
                e.target.setVolume(state.music.volume);
                setInterval(() => {
                    if (state.music.isPlaying && state.music.player && state.music.player.getCurrentTime) {
                        try {
                            const current = state.music.player.getCurrentTime();
                            const total = state.music.player.getDuration();
                            const progress = document.getElementById('track-progress');
                            if (progress && total > 0) {
                                progress.value = (current / total) * 100;
                            }
                        } catch (err) { /* Erreur mineure possible lors du seek */ }
                    }
                }, 1000);
            },
            'onStateChange': (e) => {
                // Si la vidéo se termine, on passe à la suivante
                if (e.data === YT.PlayerState.ENDED) {
                    const nextIdx = (state.music.currentTrackId + 1) % state.music.tracks.length;
                    changeTrack(nextIdx);
                }
            }
        }
    });
};

// --- 7. INITIALISATION DU DASHBOARD ---

async function init() {
    // Horloge
    setInterval(() => {
        state.currentTime = new Date();
        const clockEl = document.querySelector('.header-clock');
        if (clockEl) clockEl.innerText = state.currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);

    initialRender();

    // Fetch Data from Backend
    fetchWeather();
    fetchStocks();
    fetchFootball();
    fetchNews();

    // Attendre un petit instant pour être sûr que le DOM est monté avant YouTube
    setTimeout(initYouTubeAPI, 500);
}

// Lancement sécurisé
window.addEventListener('DOMContentLoaded', init);

// Exposer au global pour le HTML
window.toggleTheme = toggleTheme;
window.handleTrackPackage = handleTrackPackage;
window.handleAddTask = handleAddTask;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.handleCalc = handleCalc;
window.togglePlayback = togglePlayback;
window.changeTrack = changeTrack;
window.updateVolume = updateVolume;
window.seekTrack = seekTrack;