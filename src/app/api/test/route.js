
import { NextResponse } from 'next/server';
import { getAndHitToken } from '@/app/lib/supabase'; // Sesuaikan path sesuai dengan lokasi supabase.js Anda
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request) {
    try {
        // Ambil parameter 'prompt' dari query string
        const url = new URL(request.url);
        const prompt = url.searchParams.get('prompt');
        
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Ambil API key dari environment variables atau dari token yang diperoleh
        const { token } = await getAndHitToken();
        const API_KEY = token;

        // Inisialisasi model Google Generative AI
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        // Definisikan prompt
        const prompts = [prompt];

        // Panggil API untuk menghasilkan konten
        const result = await model.generateContent(prompts);
        
        console.log(JSON.stringify(result.response, null, 2));
        // Kirimkan hasil sebagai respons
        return NextResponse.json({
            success: true,
            text: result.response.text
        });

    } catch (error) {
        console.error('Error in /test route:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}