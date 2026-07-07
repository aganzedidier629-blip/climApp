import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Thermometer, Wind, Droplet, Compass, RefreshCw } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherDashboardProps {
  weather: WeatherData;
  onReset: () => void;
}

export function getWeatherIcon(code: string, className = "w-10 h-10") {
  switch (code.toLowerCase()) {
    case 'sunny':
      return <Sun className={`${className} text-amber-400 animate-pulse`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'rainy':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'stormy':
      return <CloudLightning className={`${className} text-indigo-400`} />;
    case 'snowy':
      return <CloudSnow className={`${className} text-teal-200`} />;
    case 'foggy':
      return <CloudFog className={`${className} text-emerald-200/80`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

export default function WeatherDashboard({ weather, onReset }: WeatherDashboardProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="weather-dashboard">
      {/* City & Season Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-teal-950 border border-teal-900/40 p-5 shadow-lg shadow-teal-950/10">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-teal-400 bg-teal-950/80 border border-teal-800/40 px-2 py-0.5 rounded-full uppercase">
              {weather.detectedSeason}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2 leading-none">{weather.city}</h2>
            <p className="text-xs text-slate-400 mt-1 capitalize">{weather.condition}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              {getWeatherIcon(weather.conditionCode, "w-12 h-12")}
            </div>
            <p className="text-3xl font-black text-white tracking-tighter mt-1">{Math.round(weather.temperature)}°C</p>
          </div>
        </div>

        {/* Poetic/Scientific Summary */}
        <p className="text-xs text-teal-100/80 leading-relaxed mt-4 bg-teal-950/50 p-3 rounded-xl border border-teal-900/30">
          {weather.description}
        </p>
      </div>

      {/* Grid of micro-environmental variables */}
      <div className="grid grid-cols-2 gap-3">
        {/* Température */}
        <div className="bg-slate-950 border border-slate-900/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Température</p>
            <p className="text-sm font-black text-white">{weather.temperature}°C</p>
          </div>
        </div>

        {/* Humidité */}
        <div className="bg-slate-950 border border-slate-900/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
            <Droplet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Humidité</p>
            <p className="text-sm font-black text-white">{weather.humidity}%</p>
          </div>
        </div>

        {/* Vent */}
        <div className="bg-slate-950 border border-slate-900/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg shrink-0">
            <Wind className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vent</p>
            <p className="text-sm font-black text-white">{weather.windSpeed} km/h</p>
          </div>
        </div>

        {/* Index UV */}
        <div className="bg-slate-950 border border-slate-900/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg shrink-0">
            <Sun className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Index UV</p>
            <p className="text-sm font-black text-white">{weather.uvIndex}</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-slate-950 border border-slate-900/60 rounded-xl p-4">
        <h3 className="text-[10px] font-bold tracking-widest text-teal-400 uppercase mb-3">Prévisions Hebdomadaires</h3>
        <div className="flex flex-col gap-2">
          {weather.forecast.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-900 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5 min-w-[70px]">
                <span className="text-xs font-bold text-white">{f.day}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-1 justify-center">
                {getWeatherIcon(f.conditionCode, "w-5 h-5")}
                <span className="text-[11px] text-slate-400 truncate max-w-[110px]">{f.condition}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end min-w-[60px]">
                <span className="text-xs font-black text-white">{Math.round(f.maxTemp)}°</span>
                <span className="text-[10px] text-slate-500 font-medium">{Math.round(f.minTemp)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset button to scan again */}
      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-teal-500/30 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-98 text-xs shrink-0 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4 text-teal-400" />
        <span>Nouvelle Analyse d'Image / Lieu</span>
      </button>
    </div>
  );
}
