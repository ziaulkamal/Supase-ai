import { createClient } from '@supabase/supabase-js';

// Gantilah dengan URL dan kunci API dari proyek Supabase Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getSettings() {
    try {
        // Cek apakah data sudah ada
        const { data: existingSettings, error: fetchError } = await supabase
            .from('settings')
            .select('bygoogles, bykeywords') // Pilih kolom yang diinginkan
            .single(); // Ambil satu baris saja

        if (fetchError) {
            throw new Error('Error Fetching Settings: ' + fetchError.message);
        }

        if (!existingSettings) {
            // Jika data belum ada, tambahkan baris default
            const { data: insertedData, error: insertError } = await supabase
                .from('settings')
                .insert([{ bygoogles: false, bykeywords: true, updated_at: new Date() }])
                .single(); // Ambil data yang baru saja dimasukkan

            if (insertError) {
                throw new Error('Error Inserting Default Settings: ' + insertError.message);
            }

            // Kembalikan data yang baru ditambahkan
            return { bygoogles: insertedData.bygoogles, bykeywords: insertedData.bykeywords };
        }

        // Kembalikan data yang diambil
        return { bygoogles: existingSettings.bygoogles, bykeywords: existingSettings.bykeywords };
    } catch (error) {
        console.error('Error in getSettings function:', error);
        throw error; // Re-throw error to propagate it up
    }
}


async function saveArticle(result) {
    const { title, slug, category, articles, keywords } = result;
    const { error } = await supabase
        .from('articles_ai')
        .upsert([
            {
                title,
                slug,
                category,
                articles,
                keywords
            }
        ]);

    if (error) {
        throw new Error('Error Saving Article');
    }
}

async function saveImage(slug, data) {
    const { error } = await supabase
        .from('images_ai')
        .upsert([
            {
                slug,
                images_data: data,
            }
        ]);

    if (error) {
        throw new Error('Error saving to Supabase');
    }
}

async function getAndHitToken() {
    try {
        const { data: tokenData, error: fetchError } = await supabase
            .from('geminitoken')
            .select('id, secretkey, hit, url_endpoint')
            .eq('status', true)
            .order('hit', { ascending: true })
            .limit(1)
            .single();

        if (fetchError || !tokenData) {
            throw new Error(fetchError?.message || 'Token not found');
        }

        const tokenId = tokenData.id;

        const { error: updateError } = await supabase
            .from('geminitoken')
            .update({ hit: tokenData.hit + 1 })
            .eq('id', tokenId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        return {
            token: tokenData.secretkey,
            endpoint: tokenData.url_endpoint,
            status: 'success'
        };

    } catch (error) {
        throw new Error(error.message);
    }
}

async function insertToken(secretkey) {
    try {
        if (!secretkey) {
            throw new Error('Missing secretkey');
        }

        const { error } = await supabase
            .from('geminitoken')
            .upsert([
                {
                    secretkey,
                    url_endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                    status: true
                }
            ]);

        if (error) {
            throw new Error('Error inserting token into Supabase');
        }

    } catch (error) {
        console.error('Error in insertToken:', error.message);
        throw error;
    }
}

async function insertArticles(result) {
    try {
        const { title, slug, category, articles, keywords } = result;

        const { error } = await supabase
            .from('articles_ai')
            .upsert([
                {
                    title,
                    slug,
                    category,
                    articles,
                    keywords
                }
            ]);

        if (error) {
            throw new Error('Error Saving Article');
        }

    } catch (error) {
        console.error('Error in insertArticles:', error.message);
        throw error;
    }
}

async function countArticles() {
    try {
        const { count: totalArticles, error: articlesError } = await supabase
            .from('articles_ai')
            .select('*', { count: 'exact' });

        if (articlesError) {
            throw new Error('Error fetching article count');
        }

        const { data: categoriesData, error: categoriesError } = await supabase
            .from('articles_ai')
            .select('category');

        if (categoriesError) {
            throw new Error('Error fetching categories');
        }

        const uniqueCategories = new Set(categoriesData.map(row => row.category));
        const totalCategories = uniqueCategories.size;

        return {
            totalArticles,
            totalCategories
        };

    } catch (error) {
        console.error('Error in countArticles:', error.message);
        throw error;
    }
}

async function validationGoogleTrends(title) {
    try {
        const { data: existingArticle, error: selectError } = await supabase
            .from('googletrends')
            .select('id')
            .eq('title', title)
            .single();

        if (selectError && selectError.code !== 'PGRST116') {  // Check for specific 'not found' error
            console.error('Error checking existing title:', selectError);
            throw new Error('Error checking existing title');
        }

        return !!existingArticle;  // Return true if exists, false otherwise

    } catch (error) {
        console.error('Error in checkIfExists:', error.message);
        throw error;
    }
}

// Fungsi untuk menyimpan data Google Trends ke Supabase
async function saveGoogleTrendsData(trendingSearchesDays, geo) {
  try {
    // Gabungkan semua artikel dari semua hari ke dalam satu array
    const allArticles = trendingSearchesDays.flatMap(day =>
      day.trendingSearches.flatMap(search =>
        search.articles.map(article => ({
          title: article.title,
          url: article.url,
          source: article.source || search.image?.source || '',
          snippet: article.snippet || '',
        }))
      )
    );

    // Buat array promises untuk validasi dan insert data
    const insertPromises = allArticles.map(async article => {
      const exists = await validationGoogleTrends(article.title);
      if (!exists) {
        return supabase.from('googletrends').insert([{
          geo,
          title: article.title,
          url: article.url,
          source: article.source,
          snippet: article.snippet,
          timestamp: new Date(),  // Menggunakan timestamp saat ini
        }]);
      }
    });

    // Eksekusi semua promises secara paralel
    const results = await Promise.all(insertPromises);

    // Cek error dari hasil insert
    const errors = results.filter(result => result && result.error);
    if (errors.length) {
      errors.forEach(error => console.error('Error inserting data into Supabase:', error.message));
      throw new Error('Some inserts failed');
    }

  } catch (error) {
    console.error('Error in saveGoogleTrendsData:', error.message);
    throw error;
  }
}

async function webHookTelegram(data, type) {
    try {
        if (type === 'insert') {
            const { keyword, category, language, total } = data;
            if (!keyword || !category || !language || total === undefined) {
                throw new Error('Invalid data');
            }

            const { error } = await supabase
                .from('ideas')
                .upsert([
                    {
                        keyword,
                        category,
                        language,
                        total,
                        status: false
                    }
                ]);

            if (error) {
                throw new Error('Error saving data to Supabase');
            }

        } else if (type === 'read') {
            return await countArticles();
        } else if (type === 'insertToken') {
            const { secretkey } = data;

            if (!secretkey) {
                throw new Error('Missing secretkey');
            }

            await insertToken(secretkey);

        } else if (type === 'insertArticles') {
            await insertArticles(data);

        } else {
            throw new Error('Invalid type');
        }

    } catch (error) {
        console.error('Error in webHookTelegram:', error.message);
        throw error;
    }
}

async function getRandomIdeas() {
    try {
        // Ambil data dengan status false dan total tertinggi
        const { data: ideas, error: fetchError } = await supabase
            .from('ideas')
            .select('*')
            .eq('status', false)
            .order('total', { ascending: false }) // Urutkan berdasarkan total tertinggi
            .limit(1); // Ambil satu baris

        if (fetchError) {
            throw new Error('Error Fetching Ideas: ' + fetchError.message);
        }

        if (ideas.length === 0) {
            // Tidak ada ide dengan status false
            return null;
        }

        const idea = ideas[0]; // Ambil baris pertama dari hasil

        const updatedTotal = idea.total - 1;

        // Update ide jika total sudah 0
        const { error: updateError } = await supabase
            .from('ideas')
            .update({
                total: updatedTotal,
                status: updatedTotal <= 0 ? true : false, // Set status ke true jika total <= 0
                updated_at: new Date() // Set updated_at ke waktu saat ini
            })
            .eq('id', idea.id);

        if (updateError) {
            throw new Error('Error Updating Idea: ' + updateError.message);
        }

        // Kembalikan ide yang diambil
        return idea;

    } catch (error) {
        console.error('Error in getRandomIdeas function:', error);
        throw error; // Re-throw error to propagate it up
    }
}

async function getRandomGoogle() {
    try {
        // Ambil data dengan status false
        const { data: googleTrends, error: fetchError } = await supabase
            .from('googletrends')
            .select('*')
            .eq('status', false)
            .order('timestamp', { ascending: true }) // Urutkan berdasarkan timestamp
            .limit(1); // Ambil satu baris

        if (fetchError) {
            throw new Error('Error Fetching Google Trend: ' + fetchError.message);
        }

        if (googleTrends.length === 0) {
            // Tidak ada tren Google dengan status false
            return null;
        }

        const trend = googleTrends[0]; // Ambil baris pertama dari hasil

        // Update status menjadi true setelah data diambil
        const { error: updateError } = await supabase
            .from('googletrends')
            .update({
                status: true,
                timestamp: new Date() // Update timestamp ke waktu saat ini
            })
            .eq('id', trend.id);

        if (updateError) {
            throw new Error('Error Updating Google Trend Status: ' + updateError.message);
        }

        // Kembalikan data yang diambil
        return trend;

    } catch (error) {
        console.error('Error in getRandomGoogle function:', error);
        throw error; // Re-throw error to propagate it up
    }
}

export {
    saveArticle,
    saveImage,
    getAndHitToken,
    webHookTelegram,
    saveGoogleTrendsData,
    getSettings,
    getRandomIdeas,
    getRandomGoogle 
};
