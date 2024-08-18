import { getSettings, getRandomIdeas, getRandomGoogle } from '@/app/lib/supabase'; // Pastikan path sesuai dengan lokasi file Anda

export async function GET() {
    try {
        // Ambil pengaturan dari tabel
        const settings = await getSettings();
        
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
            // Arahkan data ke endpoint create-content
            const response = await fetch(`http://localhost:3000/api/create-content/${id}/${type}`, {
                method: 'GET', // Menggunakan metode GET
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching from create-content endpoint');
            }

            const result = await response.json();
            return new Response(
                JSON.stringify({
                    message: 'Data redirected and processed successfully',
                    result
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'No data available to redirect' }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 404
                }
            );
        }
    } catch (error) {
        // Menangani error jika terjadi kesalahan
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            }
        );
    }
}
