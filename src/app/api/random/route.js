import { getSettings, getRandomIdeas, getRandomGoogle } from '@/app/lib/supabase'; // Pastikan path sesuai dengan lokasi file Anda

export async function GET() {
    // Ambil pengaturan dari tabel
    const settings = await getSettings();
    const timestamp = Math.floor(Date.now() / 1000);

    // Simpan data dalam variabel
    const settingsData = {
        google: settings.bygoogles,
        keyword: settings.bykeywords
    };

    let id;
    let type;

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
        // Redirect langsung ke endpoint create-content dengan format baru
        return new Response(
            JSON.stringify({
                redirect: `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-content/timestamp?id=${id}&type=${type}`
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 's-maxage=1, stale-while-revalidate=0' // Mencegah caching
                },
                status: 302
            }
        );
    } else {
        return new Response(
            JSON.stringify({ error: 'No data available to redirect' }),
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 's-maxage=1, stale-while-revalidate=0' // Mencegah caching
                },
                status: 404
            }
        );
    }
}
