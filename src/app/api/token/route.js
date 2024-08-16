import { getTokenAndUpdateHit } from '@/app/lib/geminiService';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Panggil fungsi dari utils/gemini.js
        const result = await getTokenAndUpdateHit();
        
        // Kirim respons dengan data yang didapat
        return NextResponse.json(result);
    } catch (error) {
        // Tangani error dengan respons JSON
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
