import { getSettings, getRandomIdeas, getRandomGoogle } from '@/app/lib/supabase'; // Pastikan path sesuai dengan lokasi file Anda

export async function GET() {
    // Ambil pengaturan dari tabel
    const settings = await getSettings();
    const timestamp = Math.floor(Date.now() / 1000);


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

    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-content/${id}/${type}?timestamp=${timestamp}`, 302);
}

