import axios from 'axios';
import { getSettings, getRandomIdeas, getRandomGoogle } from '@/app/lib/supabase'; // Pastikan path sesuai dengan lokasi file Anda

export async function GET() {
    // Ambil pengaturan dari tabel
    const settings = await getSettings();
    const timestamp = Math.floor(Date.now() / 1000);

    let id;
    let type;

    try {
        // Cek pengaturan bykeywords
        if (settings.bykeywords === false) {
            // Jika bykeywords false, ambil data dari getRandomGoogle
            const googleData = await getRandomGoogle();
            id = googleData ? googleData.id : null;
            type = "google";
        } else {
            // Jika bykeywords true, ambil data dari getRandomIdeas
            let data = await getRandomIdeas();

            if (!data) {
                // Jika tidak ada data dari getRandomIdeas, ambil dari getRandomGoogle
                data = await getRandomGoogle();
                id = data ? data.id : null;
                type = "google";
            } else {
                id = data.id;
                type = "keyword";
            }
        }

        // Pastikan id dan type valid
        if (id && type) {
            // Redirect langsung ke endpoint create-content dengan parameter
            return Response.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-content?id=${id}&type=${type}&timestamp=${timestamp}`,
                302
            );
        } else {
            // Jika tidak ada data, redirect ke endpoint lain atau ke error page
            return Response.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/error`,
                302
            );
        }
    } catch (error) {
        // Redirect ke halaman error jika terjadi kesalahan
        return Response.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/error`,
            302
        );
    }
}
