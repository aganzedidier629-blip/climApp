import React, { useState } from 'react';
import MobileMockup from './components/MobileMockup';
import ShirikanoLogo from './components/ShirikanoLogo';
import SkyAnalyzer from './components/SkyAnalyzer';
import WeatherDashboard from './components/WeatherDashboard';
import Recommendations from './components/Recommendations';
import AIChatAssistant from './components/AIChatAssistant';
import { WeatherData, SkyAnalysisResult } from './types';
import { Sparkles, Search, Brain, MapPin, ChevronRight, Compass } from 'lucide-react';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [activeTab, setActiveTab] = useState<'analyse' | 'meteo' | 'conseils' | 'chat'>('analyse');
  const [error, setError] = useState<string | null>(null);

  // Handle weather query from the city input
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/search-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityInput.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de récupérer les données climatiques pour ce lieu.");
      }

      const data: WeatherData = await response.json();
      setCurrentWeather(data);
      setImageSrc(null); // Clear image if we searched by city
      setActiveTab('meteo');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la récupération.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful image/sky analysis
  const handleAnalysisComplete = (result: SkyAnalysisResult, imageBase64: string) => {
    // Map analysis to full weather model
    const mappedWeather: WeatherData = {
      city: `Mon Environnement (${result.detectedSeason})`,
      temperature: result.temperatureEstimate,
      condition: result.detectedWeather,
      conditionCode: result.conditionCode,
      humidity: result.humidityEstimate,
      windSpeed: result.windEstimate,
      uvIndex: result.uvEstimate,
      detectedSeason: result.detectedSeason,
      description: result.description,
      forecast: [
        {
          day: 'Aujourd\'hui',
          temperature: result.temperatureEstimate,
          minTemp: result.temperatureEstimate - 3,
          maxTemp: result.temperatureEstimate + 1,
          condition: result.detectedWeather,
          conditionCode: result.conditionCode,
        },
        {
          day: 'Demain',
          temperature: result.temperatureEstimate + 1,
          minTemp: result.temperatureEstimate - 2,
          maxTemp: result.temperatureEstimate + 3,
          condition: result.detectedWeather,
          conditionCode: result.conditionCode,
        },
        {
          day: 'Après-demain',
          temperature: result.temperatureEstimate - 1,
          minTemp: result.temperatureEstimate - 4,
          maxTemp: result.temperatureEstimate,
          condition: 'Nuageux',
          conditionCode: 'cloudy',
        },
        {
          day: 'Jeudi',
          temperature: result.temperatureEstimate - 2,
          minTemp: result.temperatureEstimate - 5,
          maxTemp: result.temperatureEstimate - 1,
          condition: 'Averses',
          conditionCode: 'rainy',
        },
        {
          day: 'Vendredi',
          temperature: result.temperatureEstimate + 2,
          minTemp: result.temperatureEstimate - 1,
          maxTemp: result.temperatureEstimate + 4,
          condition: 'Ensoleillé',
          conditionCode: 'sunny',
        },
      ],
      recommendations: result.recommendations,
    };

    setCurrentWeather(mappedWeather);
    setImageSrc(imageBase64);
    setActiveTab('meteo');
  };

  // Clear current data to return to landing or do another scan
  const handleReset = () => {
    setCurrentWeather(null);
    setImageSrc(null);
    setActiveTab('analyse');
    setCityInput('');
    setError(null);
  };

  return (
    <MobileMockup>
      {/* Scrollable Container */}
      <div className="flex flex-col h-full bg-slate-900 pb-20">
        
        {/* App Sticky Header */}
        <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-5 py-4 sticky top-0 z-40 select-none">
          <div className="flex items-center justify-between">
            <ShirikanoLogo size="sm" />
            <div className="flex gap-1 items-center bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20 text-teal-400 font-mono text-[9px] font-bold tracking-wider uppercase">
              <Sparkles className="w-2.5 h-2.5 animate-pulse text-teal-400" />
              <span>COGNITIVE v3.5</span>
            </div>
          </div>
        </header>

        {/* Dynamic Screens Area */}
        <main className="flex-1 p-5 overflow-y-auto">
          {!currentWeather ? (
            /* Welcome Landing Page */
            <div className="flex flex-col gap-6 animate-fade-in py-2">
              
              {/* Promo Visual Banner */}
              <div className="relative rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 border border-teal-950/60 p-5 overflow-hidden shadow-lg select-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800/40 flex items-center justify-center shrink-0">
                    <Compass className="w-6 h-6 text-teal-400 animate-spin [animation-duration:15s]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Éco-Clim Mobile</h3>
                    <p className="text-[11px] text-teal-400 font-semibold mt-0.5">Adaptation Climatique IA & Saisons</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-4">
                  Une solution d'intelligence artificielle innovante pour décrypter votre environnement par l'analyse visuelle du ciel et vous guider au quotidien.
                </p>
              </div>

              {/* City Search Form */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">Consultation par Ville</span>
                  <span className="text-[10px] text-slate-500">Météo & Saisons</span>
                </div>
                
                <form onSubmit={handleCitySearch} className="flex gap-2">
                  <div className="flex-1 flex gap-2 items-center bg-slate-950 border border-slate-900 rounded-xl px-3.5 shadow-inner">
                    <Search className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Rechercher une ville (Dakar, Goma, Paris...)"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      disabled={isLoading}
                      className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-0 py-3.5"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!cityInput.trim() || isLoading}
                    className="w-12 h-12 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-950 text-slate-950 disabled:text-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0 cursor-pointer transition-colors"
                  >
                    {isLoading ? <Brain className="w-4 h-4 animate-spin text-slate-950" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </form>

                {error && (
                  <p className="text-[11px] text-rose-400 mt-1 pl-1 flex items-center gap-1.5 font-medium">
                    <span>⚠️</span> {error}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center select-none">
                <div className="flex-grow border-t border-slate-900"></div>
                <span className="flex-shrink mx-4 text-[9px] font-bold tracking-widest text-slate-600 uppercase">Ou scanner le ciel</span>
                <div className="flex-grow border-t border-slate-900"></div>
              </div>

              {/* Direct access to Sky Analyzer */}
              <SkyAnalyzer
                onAnalysisComplete={handleAnalysisComplete}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />

              {/* Cognitive Pitch Footer */}
              <footer className="text-center py-4 select-none">
                <p className="text-[9px] text-slate-600 tracking-wide">
                  Développé sous l'égide de <span className="text-teal-400 font-semibold">Shirikano Training</span>
                </p>
                <p className="text-[8px] text-slate-700 mt-1 uppercase tracking-widest">
                  Formons l'avenir numérique • 2026
                </p>
              </footer>

            </div>
          ) : (
            /* Active Mode with Tabs */
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Back to Home Header */}
              <div className="flex justify-between items-center select-none shrink-0 border-b border-slate-900/60 pb-3">
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                >
                  ← Retour au Menu
                </button>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-500" />
                  <span className="font-semibold truncate max-w-[150px]">{currentWeather.city}</span>
                </div>
              </div>

              {/* Main image reference (if sky was analyzed) */}
              {imageSrc && activeTab === 'meteo' && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 aspect-video md:aspect-[4/3] group select-none shadow-md shadow-slate-950/50">
                  <img src={imageSrc} alt="Ciel Analysé" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Environnement Analysé</p>
                      <span className="text-[9px] text-white/70 bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> IA Confiance 98%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render Selected Tab Component */}
              {activeTab === 'analyse' && (
                <SkyAnalyzer
                  onAnalysisComplete={handleAnalysisComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}

              {activeTab === 'meteo' && (
                <WeatherDashboard weather={currentWeather} onReset={handleReset} />
              )}

              {activeTab === 'conseils' && (
                <Recommendations recommendations={currentWeather.recommendations} />
              )}

              {activeTab === 'chat' && (
                <AIChatAssistant currentWeather={currentWeather} />
              )}

            </div>
          )}
        </main>

        {/* Persistent Bottom Mobile Navigation Tabs (Unlocks when weather context is active) */}
        {currentWeather && (
          <nav className="absolute bottom-0 inset-x-0 h-[68px] bg-slate-950/90 backdrop-blur-lg border-t border-slate-900/80 grid grid-cols-4 items-center px-4 z-40 select-none">
            {/* Tab: Analyse */}
            <button
              onClick={() => setActiveTab('analyse')}
              className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                activeTab === 'analyse' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Compass className="w-5 h-5 stroke-[2]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Scanner</span>
            </button>

            {/* Tab: Météo */}
            <button
              onClick={() => setActiveTab('meteo')}
              className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                activeTab === 'meteo' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Brain className="w-5 h-5 stroke-[2]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Météo IA</span>
            </button>

            {/* Tab: Conseils */}
            <button
              onClick={() => setActiveTab('conseils')}
              className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                activeTab === 'conseils' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Sparkles className="w-5 h-5 stroke-[2]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Conseils</span>
            </button>

            {/* Tab: Chat */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer transition-all ${
                activeTab === 'chat' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="relative">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 absolute -top-0.5 -right-0.5 animate-pulse" />
                <Brain className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">Coach IA</span>
            </button>
          </nav>
        )}
      </div>
    </MobileMockup>
  );
}
