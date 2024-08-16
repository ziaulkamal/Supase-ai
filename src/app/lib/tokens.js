import supabase from './supabase';

export async function getTokenAndUpdateHit() {
  try {
    // Ambil token yang aktif dengan total_hit terendah
    const { data: tokenData, error: fetchError } = await supabase
      .from('geminitoken')
      .select('id, secretkey, url_endpoint')
      .eq('status', true)
      .order('hit', { ascending: true })
      .limit(1)
      .single();

    // Validasi hasil query
    if (fetchError || !tokenData) {
      throw new Error(fetchError?.message || 'Token not found');
    }

    // Ambil ID token
    const tokenId = tokenData.id;

    // Perbarui jumlah hit untuk token yang diambil
    const { error: updateError } = await supabase
      .from('geminitoken')
      .update({ hit: tokenData.hit + 1 })
      .eq('id', tokenId);

    // Validasi hasil update
    if (updateError) {
      throw new Error(updateError.message);
    }

    // Kembalikan token dan endpoint
    return {
      token: tokenData.secretkey,
      endpoint: tokenData.url_endpoint,
      status: 'success'
    };

  } catch (error) {
    throw new Error(error.message);
  }
}
