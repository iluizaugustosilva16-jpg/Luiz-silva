import React, { useState } from 'react';
import { generateRecipes } from '../services/geminiService';
import { Utensils, Flame, Leaf, ChefHat, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppView } from '../types';

interface RecipesProps {
    onBack: () => void;
}

const Recipes: React.FC<RecipesProps> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        { id: 'hipertrofia', label: 'Hipertrofia', icon: <Flame size={20} className="text-orange-500"/>, desc: 'Alto em proteínas' },
        { id: 'emagrecimento', label: 'Emagrecimento', icon: <Leaf size={20} className="text-emerald-500"/>, desc: 'Baixas calorias' },
        { id: 'pre-treino', label: 'Pré-Treino', icon: <Utensils size={20} className="text-yellow-500"/>, desc: 'Energia rápida' },
        { id: 'vegetariano', label: 'Vegetariano', icon: <Leaf size={20} className="text-green-400"/>, desc: 'Plant-based' },
    ];

    const handleGenerate = async (category: string) => {
        setLoading(true);
        setRecipe(null);
        setSelectedCategory(category);
        const result = await generateRecipes(category);
        setRecipe(result);
        setLoading(false);
    };

    return (
        <div className="p-4 pb-24 animate-fade-in min-h-screen bg-black text-white">
            <div className="flex items-center mb-6 pt-4">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 hover:bg-gray-800 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold flex items-center">
                        <ChefHat className="mr-2 text-indigo-500" /> Receitas Fit
                    </h2>
                    <p className="text-gray-400 text-xs">Nutrição personalizada pela IA</p>
                </div>
            </div>

            {!recipe && !loading && (
                <div className="grid grid-cols-1 gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleGenerate(cat.label)}
                            className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center space-x-4 hover:border-indigo-500/50 transition-all active:scale-95 text-left group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{cat.label}</h3>
                                <p className="text-gray-500 text-xs">{cat.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <RefreshCw className="animate-spin text-indigo-500" size={40} />
                    <p className="text-gray-400 text-sm animate-pulse">O Chef IA está cozinhando...</p>
                </div>
            )}

            {recipe && (
                <div className="animate-slide-up">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-4 bg-indigo-900/20 border-b border-gray-800 flex justify-between items-center">
                             <span className="text-indigo-400 font-bold text-sm uppercase">{selectedCategory}</span>
                             <button 
                                onClick={() => handleGenerate(selectedCategory!)}
                                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors flex items-center"
                             >
                                <RefreshCw size={12} className="mr-1" /> Nova
                             </button>
                        </div>
                        <div className="p-6 prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-line leading-relaxed text-gray-200">
                                {recipe}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setRecipe(null)}
                        className="w-full mt-6 py-3 bg-gray-800 rounded-xl font-bold text-gray-300 hover:bg-gray-700"
                    >
                        Escolher outra categoria
                    </button>
                </div>
            )}
        </div>
    );
};

export default Recipes;