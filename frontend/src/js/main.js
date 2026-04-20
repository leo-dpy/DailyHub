import { fetchWeather, fetchNews, fetchFinance, fetchFootball } from './api.js';
import { el, appendChildren } from './dom.js';

// Elements state
let tasks = JSON.parse(localStorage.getItem('dailyhub_tasks') || '[]');
let currentTheme = localStorage.getItem('dailyhub_theme') || 'dark';

// DOM Setup
document.documentElement.setAttribute('data-theme', currentTheme);
const app = document.getElementById('app');

// Build UI Layout
const buildHeader = () => {
  const header = el('div', 'bento-box header-widget');
  
  // LEFT: Weather
  const weatherDiv = el('div', 'weather-widget');
  const weatherIcon = el('div', 'weather-icon', '🌍');
  const wInfo = el('div', 'weather-info');
  const wTitle = el('div', 'weather-temp', 'Chargement...');
  
  const wInputContainer = el('div', 'weather-input-container'); 
  const cityInput = el('input');
  cityInput.placeholder = "Ville...";
  const cityBtn = el('button', '', '📍');
  appendChildren(wInputContainer, [cityInput, cityBtn]);
  
  appendChildren(wInfo, [wTitle, wInputContainer]);
  appendChildren(weatherDiv, [weatherIcon, wInfo]);

  // CENTER: Clock & Date
  const centerDiv = el('div', 'header-center');
  const clockDiv = el('div', 'clock-main', '00:00:00');
  const dateDiv = el('div', 'date-main', 'Lundi...');
  appendChildren(centerDiv, [clockDiv, dateDiv]);

  // RIGHT: Logo & Actions
  const rightDiv = el('div', 'header-right');
  
  const fsBtn = el('button', 'fullscreen-btn', '⛶');
  fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      fsBtn.innerHTML = '✖';
    } else {
      document.exitFullscreen();
      fsBtn.innerHTML = '⛶';
    }
  });

  const logoDiv = el('div');
  logoDiv.innerHTML = '<span class="logo-bold">Daily</span>Hub';

  appendChildren(rightDiv, [fsBtn, logoDiv]);

  appendChildren(header, [weatherDiv, centerDiv, rightDiv]);

  setInterval(() => {
    const now = new Date();
    clockDiv.textContent = now.toLocaleTimeString('fr-FR');
    dateDiv.textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, 1000);

  // Handle weather fetch
  const getIcon = (code) => {
    if(code.includes('01')) return '☀️';
    if(code.includes('02')) return '⛅';
    if(code.includes('03') || code.includes('04')) return '☁️';
    if(code.includes('09') || code.includes('10')) return '🌧️';
    if(code.includes('11')) return '⛈️';
    if(code.includes('13')) return '❄️';
    return '🌍';
  };

  const updateWeather = (city) => {
    wTitle.textContent = `${city}...`;
    fetchWeather(city).then(data => {
      if(data) {
        wTitle.textContent = `${data.main.temp.toFixed(1)}°C`;
        weatherIcon.textContent = getIcon(data.weather[0].icon);
        localStorage.setItem('dailyhub_city', data.name);
      } else {
        wTitle.textContent = `Introuvable`;
      }
    });
  };

  let currentCity = localStorage.getItem('dailyhub_city') || 'Paris';
  updateWeather(currentCity);

  cityBtn.addEventListener('click', () => {
    if(cityInput.value.trim()) {
      updateWeather(cityInput.value.trim());
      cityInput.value = '';
    }
  });

  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cityBtn.click();
  });

  return header;
};

const buildNews = () => {
  const panel = el('div', 'bento-box grid-news scrollable');
  panel.appendChild(el('h3', '', 'Sur le web'));
  const list = el('div', 'news-list');
  panel.appendChild(list);

  fetchNews().then(articles => {
    if(articles.length === 0) list.appendChild(el('p', '', 'Aucune news trouvée.'));
    articles.forEach(article => {
      const item = el('div', 'news-item');
      const link = el('a', '', article.title);
      if(article.url) {
        link.href = article.url;
        link.target = "_blank";
      }
      item.appendChild(link);
      list.appendChild(item);
    });
  });

  return panel;
};

const buildFinance = () => {
  const panel = el('div', 'bento-box grid-finance');
  panel.appendChild(el('h3', '', 'Marchés Financiers'));
  const ticker = el('div', 'finance-ticker');
  panel.appendChild(ticker);

  const defaultSyms = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
  fetchFinance(defaultSyms).then(stocks => {
    if(stocks.length === 0) ticker.appendChild(el('p', '', 'Données inaccessibles.'));
    stocks.forEach(stock => {
      const sDiv = el('div', 'stock-item');
      const sym = el('div', '', stock.symbol);
      const diff = stock.current - stock.previous;
      const sVal = el('div', diff >= 0 ? 'stock-positive' : 'stock-negative', 
        `$${stock.current.toFixed(2)} (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`);
      appendChildren(sDiv, [sym, sVal]);
      ticker.appendChild(sDiv);
    });
  });

  return panel;
};

const buildFootball = () => {
  const panel = el('div', 'bento-box grid-football scrollable');
  panel.appendChild(el('h3', '', 'Scores en Direct'));
  const list = el('div');
  panel.appendChild(list);

  fetchFootball().then(matches => {
    if(matches.length === 0) list.appendChild(el('p', '', 'Pas de match pour aujourd\'hui.'));
    matches.forEach(m => {
      const row = el('div', 'football-item'); 
      const hName = m.teams?.home?.name || 'Home';
      const aName = m.teams?.away?.name || 'Away';
      // api-football goals might be null before match starts
      const hScore = m.goals?.home !== null ? m.goals.home : '-';
      const aScore = m.goals?.away !== null ? m.goals.away : '-';
      
      const st = m.fixture?.status?.short;
      const elapsed = m.fixture?.status?.elapsed;
      let statusStr = '';
      if (['FT', 'AET', 'PEN'].includes(st)) {
        statusStr = 'Terminé';
      } else if (st === 'HT') {
        statusStr = 'Mi-temps';
      } else if (['1H', '2H', 'ET', 'P', 'LIVE'].includes(st)) {
        statusStr = elapsed ? `${elapsed}'` : 'En cours';
      } else if (['PST', 'CANC', 'ABD'].includes(st)) {
        statusStr = 'Annulé/Reporté';
      } else if (st === 'NS' || st === 'TBD') {
        statusStr = new Date(m.fixture.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
      } else {
        statusStr = st;
      }
      
      const statusDiv = el('div', 'football-status', statusStr);
      const detailsDiv = el('div', 'football-details');
      
      const homeSpan = el('span', 'team-name', hName);
      homeSpan.style.flex = '1';
      homeSpan.style.textAlign = 'right';
      
      const scoreSpan = el('span', 'score-badge', `${hScore} - ${aScore}`);
      scoreSpan.style.padding = '0 1rem';
      scoreSpan.style.fontWeight = '700';
      scoreSpan.style.color = 'var(--text-main)';
      
      const awaySpan = el('span', 'team-name', aName);
      awaySpan.style.flex = '1';
      awaySpan.style.textAlign = 'left';

      appendChildren(detailsDiv, [homeSpan, scoreSpan, awaySpan]);
      appendChildren(row, [detailsDiv, statusDiv]);
      list.appendChild(row);
    });
  });

  return panel;
};

const buildTaskManager = () => {
  const panel = el('div', 'bento-box grid-tasks scrollable');
  panel.appendChild(el('h3', '', 'À Faire Aujourd\'hui'));

  const inputCont = el('div', 'task-input-container');
  const input = el('input');
  input.placeholder = "Nouvelle tâche...";
  const btn = el('button', '', 'Ajouter');
  appendChildren(inputCont, [input, btn]);
  panel.appendChild(inputCont);

  const list = el('ul', 'task-list');
  panel.appendChild(list);

  const renderTasks = () => {
    list.innerHTML = '';
    tasks.forEach((t, i) => {
      const li = el('li', t.done ? 'task-item completed' : 'task-item');
      const txt = el('span', '', t.text);
      
      const del = el('button', 'delete-btn', 'X');
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        tasks.splice(i, 1);
        saveRender();
      });

      li.addEventListener('click', () => {
        t.done = !t.done;
        saveRender();
      });

      appendChildren(li, [txt, del]);
      list.appendChild(li);
    });
  };

  const saveRender = () => {
    localStorage.setItem('dailyhub_tasks', JSON.stringify(tasks));
    renderTasks();
  };

  btn.addEventListener('click', () => {
    if(!input.value.trim()) return;
    tasks.push({ text: input.value, done: false });
    input.value = '';
    saveRender();
  });
  
  // Also add on enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btn.click();
    }
  });

  renderTasks();
  return panel;
};

const buildMusic = () => {
  const panel = el('div', 'bento-box grid-music');
  panel.appendChild(el('h3', '', 'Radio'));
  
  const ytInputCont = el('div', 'task-input-container');
  ytInputCont.style.marginBottom = "0.5rem";
  const ytInput = el('input');
  ytInput.placeholder = "ID Vidéo ou URL...";
  const loadBtn = el('button', '', 'Charger');
  appendChildren(ytInputCont, [ytInput, loadBtn]);
  panel.appendChild(ytInputCont);
  
  const ytContainer = el('div');
  ytContainer.id = "yt-player";
  ytContainer.style.display = "none"; 
  panel.appendChild(ytContainer);

  const controls = el('div', 'task-input-container');
  controls.style.marginTop = "0.5rem";
  const playBtn = el('button', '', 'Lecture');
  const stopBtn = el('button', '', 'Pause');
  stopBtn.style.opacity = '0.5';
  appendChildren(controls, [playBtn, stopBtn]);
  panel.appendChild(controls);

  // Setup Youtube Iframe API natively
  let player;
  let currentVideoId = 'jfKfPfyJRdk'; // default lofi
  
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('yt-player', {
      height: '0', 
      width: '0',
      videoId: currentVideoId,
      playerVars: { 'autoplay': 0, 'controls': 0 },
    });
  };

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if(firstScriptTag) firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  else document.head.appendChild(tag);

  const extractVideoID = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  };

  loadBtn.addEventListener('click', () => {
    let val = ytInput.value.trim();
    if(!val) return;
    const extracted = extractVideoID(val);
    const finalId = extracted ? extracted : val;
    if(player && player.loadVideoById) {
      player.loadVideoById(finalId);
      ytInput.value = '';
      ytInput.placeholder = "Musique chargée !";
      playBtn.style.opacity = '0.5'; 
      stopBtn.style.opacity = '1';
    }
  });

  playBtn.addEventListener('click', () => { 
    if(player && player.playVideo) {
      player.playVideo();
      playBtn.style.opacity = '0.5'; 
      stopBtn.style.opacity = '1'; 
    }
  });

  stopBtn.addEventListener('click', () => { 
    if(player && player.pauseVideo) {
      player.pauseVideo();
      stopBtn.style.opacity = '0.5'; 
      playBtn.style.opacity = '1'; 
    }
  });

  return panel;
};

// Assembly
const initApp = () => {
  app.innerHTML = '';
  const header = buildHeader();
  const news = buildNews();
  const finance = buildFinance();
  const tasksW = buildTaskManager();
  const football = buildFootball();
  const music = buildMusic();

  appendChildren(app, [header, news, finance, tasksW, football, music]);
};

initApp();
