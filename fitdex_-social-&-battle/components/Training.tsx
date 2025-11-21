import React, { useState } from 'react';
import { TrainingGoal } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Sparkles, RefreshCw, Dumbbell } from 'lucide-react';

const Training: React.FC = () => {
  const [goal, setGoal] = useState<TrainingGoal>(TrainingGoal.HYPERTROPHY);
  const [days, setDays] = useState(3);
  const [level, setLevel] = useState('Intermediário');
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateWorkoutPlan(goal, days, level);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="p-4 pb-24 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Treino Inteligente</h2>
        <p className="text-gray-400 text-sm">IA Personalizada para você</p>
      </div>

      {!plan ? (
        <div className="space-y-6 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          {/* Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo Principal</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TrainingGoal).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    goal === g
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Dias por Semana: {days}</label>
            <input
              type="range"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 dia</span>
              <span>7 dias</span>
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nível de Experiência</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option>Iniciante</option>
              <option>Intermediário</option>
              <option>Avançado</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Gerar Treino com IA</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-slide-up">
           <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-4 bg-emerald-900/30 border-b border-gray-700 flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-emerald-400">
                    <Dumbbell size={20} />
                    <span className="font-bold">Seu Plano</span>
                 </div>
                 <button 
                    onClick={() => setPlan(null)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                 >
                    Novo
                 </button>
              </div>
              <div className="p-6 prose prose-invert prose-sm max-w-none">
                 <div className="whitespace-pre-line leading-relaxed">
                    {plan}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Training;