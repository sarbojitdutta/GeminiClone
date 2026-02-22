import { NextResponse } from 'next/server';
import { chattoGemini } from '@/utils/geminiHelper';
import { ChatHistory, ChatSettings } from '@/types';

export async function POST(request: Request) {
    try{
        const {userMessage, history, settings} = (await request.json()) as {
            userMessage: string;
            history: ChatHistory;
            settings: ChatSettings;
        }
        const aiResponse = await chattoGemini(userMessage, history, settings)
        return NextResponse.json({response: aiResponse})
    }catch(error){
        console.error("Error processing chat request:", error)
        return NextResponse.json({error: "Failed to process chat request"}, {status: 500})
    }
}