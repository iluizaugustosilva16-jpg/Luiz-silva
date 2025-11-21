import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { Camera, ArrowLeft, RefreshCw, CheckCircle, Upload } from 'lucide-react';

interface CalorieCalculatorProps {
    onBack: () => void;
}

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({ onBack }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setAnalysis(null); // Clear previous analysis
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imagePreview) return;
        
        setLoading(true);
        const result = await analyzeFoodImage(imagePreview);
        setAnalysis(result);
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
                        <Camera className="mr-2 text-indigo-500" /> Scanner de Macros
                    </h2>
                    <p className="text-gray-400 text-xs">Analise seu prato com uma foto</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="w-full aspect-square sm:aspect-video bg-gray-900 border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Food" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                                <Camera size={32} />
                            </div>
                            <p className="text-gray-300 font-medium mb-2">Tire uma foto ou faça upload</p>
                            <p className="text-gray-600 text-xs">Formatos: JPG, PNG</p>
                        </div>
                    )}
                    
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {/* Overlay button for changing image if one exists */}
                    {imagePreview && !loading && (
                        <div className="absolute bottom-4 right-4">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70"
                             >
                                <Upload size={20} />
                             </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {imagePreview && !loading && !analysis && (
                    <button
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-900/30 active:scale-95 transition-transform flex items-center justify-center"
                    >
                        <CheckCircle size={20} className="mr-2" />
                        Calcular Calorias
                    </button>
                )}

                {loading && (
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center">
                        <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-3" size={32} />
                        <p className="text-gray-300 text-sm">Analisando os alimentos...</p>
                    </div>
                )}

                {/* Result */}
                {analysis && (
                    <div className="animate-slide-up bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-4 bg-purple-900/20 border-b border-gray-800 flex items-center space-x-2">
                            <CheckCircle className="text-green-400" size={20} />
                            <h3 className="font-bold text-white">Resultado Nutricional</h3>
                        </div>
                        <div className="p-6 prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-line leading-relaxed text-gray-200">
                                {analysis}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-800">
                             <button 
                                onClick={() => {
                                    setImagePreview(null);
                                    setAnalysis(null);
                                }}
                                className="w-full py-3 bg-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-700 transition-colors"
                             >
                                Analisar Outro Prato
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalorieCalculator;