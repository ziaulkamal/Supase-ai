export async function GET(request, { params }) {
    try {
        const { id, type } = params; // Mengambil nilai [id] dan [type] dari URL

        // Memastikan bahwa id dan type diterima
        if (!id || !type) {
            return new Response(
                JSON.stringify({ error: 'ID and type are required' }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 400
                }
            );
        }

        // Log data yang diterima
        console.log('Received ID and Type:', {
            id,
            type
        });

        // Kembalikan response dengan data yang diterima
        return new Response(
            JSON.stringify({
                message: 'ID and Type received successfully',
                id,
                type
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            }
        );

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
