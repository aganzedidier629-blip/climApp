import React, { useState } from 'react';
import { Shirt, Utensils, Dumbbell, Navigation, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { Recommendations as RecTypes } from '../types';

interface RecommendationsProps {
  recommendations: RecTypes;
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>('habillement');

  const categories = [
    {
      id: 'habillement',
      title: 'Habillement & Style',
      subtitle: 'Comment se vêtir confortablement',
      icon: <Shirt className="w-5 h-5 text-teal-400" />,
      colorClass: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
      items: recommendations.habillement,
    },
    {
      id: 'alimentation',
      title: 'Nutrition & Hydratation',
      subtitle: 'Quoi manger et boire pour l\'énergie',
      icon: <Utensils className="w-5 h-5 text-amber-400" />,
      colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      items: recommendations.alimentation,
    },
    {
      id: 'activites',
      title: 'Activités Physiques',
      subtitle: 'Sports adaptés aux conditions',
      icon: <Dumbbell className="w-5 h-5 text-emerald-400" />,
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      items: recommendations.activites,
    },
    {
      id: 'lieux',
      title: 'Lieux à Fréquenter',
      subtitle: 'Où se rendre aujourd\'hui',
      icon: <Navigation className="w-5 h-5 text-sky-400" />,
      colorClass: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
      items: recommendations.lieux,
    },
    {
      id: 'eviter',
      title: 'Comportements à Éviter',
      subtitle: 'Risques et précautions à prendre',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      items: recommendations.eviter,
    },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fade-in" id="recommendations-container">
      {/* Mini Title */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
          Recommandations Shirikano IA
        </span>
        <span className="text-[10px] text-slate-500">Personnalisé pour vous</span>
      </div>

      {/* Accordion / List of categories */}
      <div className="flex flex-col gap-2.5">
        {categories.map((cat) => {
          const isOpen = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all duration-300 bg-slate-950 overflow-hidden ${
                isOpen 
                  ? 'border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.04)] shadow-teal-950/20' 
                  : 'border-slate-900 hover:border-slate-800'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setActiveCategory(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between p-4 text-left select-none cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 border ${cat.colorClass}`}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold text-white leading-snug tracking-tight">{cat.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-none truncate">{cat.subtitle}</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                )}
              </button>

              {/* Items List */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 animate-slide-down border-t border-slate-900/30">
                  <ul className="flex flex-col gap-2.5">
                    {cat.items && cat.items.length > 0 ? (
                      cat.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs leading-relaxed text-slate-300 group">
                          {/* Bullet marker */}
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                            cat.id === 'eviter' ? 'bg-rose-500' : 'bg-teal-500'
                          }`} />
                          <span className="flex-1 opacity-90 group-hover:opacity-100 group-hover:text-white transition-colors duration-200">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-500 italic">Aucune recommandation disponible.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
