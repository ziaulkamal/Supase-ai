import axios from 'axios';
import { NextResponse } from 'next/server';

const WEBHOOK_URL = `${process.env.BASE_URL}/api/telegram-webhook`;

export async function GET() {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/setWebhook`,
            {
                url: WEBHOOK_URL,
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const update = await request.json();

        // Log pesan yang diterima
        console.log('Received update:', update);

        // Kirim balasan ke pengguna Telegram jika diperlukan
        await axios.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
            {
                chat_id: process.env.USER_ID,
                text: `Pesan diterima: ${update.message.text}`,
            }
        );

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
    }
}
