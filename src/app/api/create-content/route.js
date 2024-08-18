import { generateSessionDataWithRetry, formatSessionData } from "@/app/lib/gemini";
import { getSingleDatas, insertArticles } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');
    const timestamp = url.searchParams.get('timestamp');

    try {
        if (!id || !type) {
            return NextResponse.json(
                { error: 'Bad Request: Missing query parameters' },
                {
                    status: 400,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                }
            );
        }

        const singleDatas = await getSingleDatas(id, type);

        if (!singleDatas || !singleDatas.prompt || !singleDatas.lang) {
            return NextResponse.json(
                { error: 'Data not found or invalid' },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                }
            );
        }

        const langCode = singleDatas.lang; 
        const prompt = singleDatas.prompt;
        const category = singleDatas.category;

        const results = {};

        for (let sessionType = 1; sessionType <= 7; sessionType++) {
            const response = await generateSessionDataWithRetry(prompt, langCode, 'neutral', sessionType);
            results[`session_${sessionType}`] = formatSessionData(response);
        }

        const letsInsert = await insertArticles(results, category);

        return NextResponse.json(letsInsert, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error('Error in GET request handler:', error.message);
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
