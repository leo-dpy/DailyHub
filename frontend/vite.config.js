import { defineConfig } from 'vite';

export default defineConfig({
  envDir: '../',
  envPrefix: ['VITE_', 'WEATHER_', 'FOOTBALL_', 'FINANCE_', 'NEWS_', 'YOUTUBE_', 'TRACKING_'],
});
