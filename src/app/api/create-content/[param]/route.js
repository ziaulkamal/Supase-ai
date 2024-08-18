export async function GET(request) {
    // Ambil URL dari request
    const url = new URL(request.url);
    
    // Ambil query parameters
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');

    // Ambil timestamp dari path
    const timestamp = url.pathname.split('/').pop(); // Mengambil 'timestamp' dari URL path

    // Validasi id, type, dan timestamp
    if (!id || !type || !timestamp) {
        return new Response(
            JSON.stringify({ error: 'ID, type, and timestamp are required' }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            }
        );
    }

    // Log data yang diterima
    console.log('Received Data:', {
        id,
        type,
        timestamp
    });

    // Kembalikan response dengan data yang diterima
    return new Response(
        JSON.stringify({
            message: 'Data received successfully',
            id,
            type,
            timestamp
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        }
    );
}
