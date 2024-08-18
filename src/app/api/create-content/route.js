export async function GET(request) {
    // Ambil URL dari request
    const url = new URL(request.url);
    
    // Ambil query parameters
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');
    const timestamp = url.searchParams.get('timestamp');

    // Validasi id, type, dan timestamp
    if (!id || !type || !timestamp) {
        return new Response(
            JSON.stringify({ error: 'ID, type, and timestamp are required' }),
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 's-maxage=1, stale-while-revalidate=0' // Mencegah caching
                },
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
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=1, stale-while-revalidate=0' // Mencegah caching
            },
            status: 200
        }
    );
}
