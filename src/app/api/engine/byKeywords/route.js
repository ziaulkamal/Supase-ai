import supabase from '@/app/lib/supabase';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    try {
        // Ambil data dengan total tertinggi yang statusnya false
        const { data, error } = await supabase
            .from('telegram_articles')
            .select('id, keyword, category, lang, total, status')
            .eq('status', false) // Tambahkan filter untuk status false
            .order('total', { ascending: false })
            .limit(1);

        if (error) {
            throw new Error(error.message);
        }

        if (data.length === 0) {
            return NextResponse.json({ message: 'No data found' });
        }

        const article = data[0];

        // Jika total menjadi 0, rubah status jadi true
        let newStatus = article.status;
        let newTotal = article.total - 1;

        if (newTotal <= 0) {
            newStatus = true;
            newTotal = 0;
        }

        // Update artikel dengan total yang dikurangi
        const { error: updateError } = await supabase
            .from('telegram_articles')
            .update({ total: newTotal, status: newStatus })
            .eq('id', article.id);

        if (updateError) {
            throw new Error(updateError.message);
        }

        // Buat timestamp untuk bypass cache
        const timestamp = Math.floor(Date.now() / 1000);

        // Buat URL dengan parameter yang diperlukan
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/AI?id=${article.id}&table=telegram_articles&timestamp=${timestamp}`;

        // Kirimkan permintaan ke API lain menggunakan axios
        const response = await axios.get(apiUrl);

        // Tangani respons dari API lain
        const aiData = response.data;

        return NextResponse.json({
            id: article.id,
            keyword: article.keyword,
            category: article.category,
            lang: article.lang,
            total: newTotal,
            status: newStatus,
            aiData // Sertakan data dari API lain dalam respons
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
