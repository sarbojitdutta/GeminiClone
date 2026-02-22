import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatHistory, GenerationConfig, ChatSettings } from "@/types";

const apiKey = process.env.GEMINI_API_KEY;

if(!apiKey){
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey)

export async function chattoGemini(
    userMessage: string,
    history: ChatHistory,
    settings: ChatSettings
    ):Promise<string>{
        
    const model = genAI.getGenerativeModel({
        model: settings.model || "gemini-2.5-flash",
        systemInstruction: settings.systemInstructions || "You are a helpful assistant.",
    })

    const generateConfig: GenerationConfig = {
        temperature: settings.temperature || 1,
        topP: 0.95,
        responseMimeType: "text/plain",
    }

    const chatSession = model.startChat({
        generationConfig: generateConfig,
        history: history
    })
    try{
        const result = await chatSession.sendMessage(userMessage)
        return result.response.text()
    }catch(error){
        console.error("Error communicating with Gemini API:", error)
        throw new Error("Failed to get response from Gemini API.");
    }
}