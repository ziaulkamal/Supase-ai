// app/api/AI/route.js
import { generateSessionDataWithRetry, formatSessionData, stringToSlug } from '@/app/lib/gemini';
import { formatAndSaveData } from '@/app/lib/formatAndSave';
import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';


export async function GET(request) { 
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const table = url.searchParams.get('table');
    const timeStamp = url.searchParams.get('timestamp');

    const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id) // Tambahkan filter untuk status false
        .limit(1);

    if (error) {
        throw new Error(error.message);
    }

    let prompt, lang, category;

    if (table === 'telegram_articles') {
        // Pilih kolom keyword, lang, dan category
        if (data.length > 0) {
            const item = data[0];
            prompt = item.keyword;
            lang = item.lang;
            category = item.category;
        }
    } else {
        // Pilih kolom title, geo, dan source
        if (data.length > 0) {
            const item = data[0];
            prompt = item.title;
            lang = item.geo;
            category = item.source;
        }
    }

    if (data.length === 0) {
        return NextResponse.json({ message: 'No data found' });
    }


    try {
        const langCode = lang || 'en_en'; // Anda bisa mengubah ini sesuai kebutuhan
        const results = {};

        for (let sessionType = 1; sessionType <= 7; sessionType++) {
        const response = await generateSessionDataWithRetry(prompt, langCode, 'neutral', sessionType);
        results[`session_${sessionType}`] = formatSessionData(response);
        }

        await formatAndSaveData(results, category);
        return NextResponse.json('Content generated and saved to database successfully.', {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
         }); 
    } catch (error) {
        return NextResponse.json(
        { error: `Internal Server Error: ${error.message}` },
            {
                status: 500,
                headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                },
            }
        );
    }
}
