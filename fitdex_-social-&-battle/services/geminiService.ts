import { GoogleGenAI } from "@google/genai";
import { TrainingGoal } from "../types";

// Initialize the Gemini API client
// Ensure process.env.API_KEY is set in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWorkoutPlan = async (
  goal: TrainingGoal,
  daysPerWeek: number,
  level: string
): Promise<string> => {
  try {
    const prompt = `
      Atue como um personal trainer de elite. Crie um plano de treino curto e direto para um aluno com as seguintes características:
      Objetivo: ${goal}
      Frequência: ${daysPerWeek} dias por semana
      Nível: ${level}

      Formate a resposta em Markdown limpo. Use bullet points.
      Inclua uma frase motivacional no final.
      Não use introduções longas, vá direto ao treino.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o treino no momento.";
  } catch (error) {
    console.error("Erro ao gerar treino:", error);
    return "Erro ao conectar com a IA. Verifique sua conexão ou chave de API.";
  }
};

export const generateBattleTaunt = async (won: boolean): Promise<string> => {
    try {
        const prompt = won 
            ? "Gere uma frase curta (máximo 10 palavras) de vitória épica em um jogo de batalha de academia."
            : "Gere uma frase curta (máximo 10 palavras) engraçada de derrota encorajando a tentar de novo na academia.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || (won ? "Vitória!" : "Tente novamente!");
    } catch (e) {
        return won ? "Você venceu!" : "Mais sorte na próxima!";
    }
};

export const generateRecipes = async (goal: string): Promise<string> => {
    try {
        const prompt = `
            Sugira uma receita deliciosa e saudável focada em: ${goal}.
            Inclua:
            - Título criativo
            - Lista de ingredientes
            - Modo de preparo resumido
            - Estimativa de calorias e proteínas.
            
            Formate em Markdown. Seja breve e direto.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Não foi possível gerar a receita.";
    } catch (error) {
        console.error("Erro ao gerar receita:", error);
        return "Erro de conexão.";
    }
};

export const analyzeFoodImage = async (base64Image: string): Promise<string> => {
    try {
        // Remove header if present (data:image/jpeg;base64,)
        const cleanBase64 = base64Image.includes('base64,') 
            ? base64Image.split('base64,')[1] 
            : base64Image;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: cleanBase64
                        }
                    },
                    {
                        text: "Analise esta imagem de comida. Estime as calorias totais e a divisão de macronutrientes (Proteínas, Carboidratos, Gorduras). Se houver múltiplos itens, liste-os. Retorne em formato Markdown curto e legível."
                    }
                ]
            }
        });
        
        return response.text || "Não foi possível analisar a imagem.";
    } catch (error) {
        console.error("Erro ao analisar imagem:", error);
        return "Erro ao processar a imagem. Tente novamente.";
    }
};