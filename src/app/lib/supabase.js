import { createClient } from '@supabase/supabase-js';

// Gantilah dengan URL dan kunci API dari proyek Supabase Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function saveGoogleTrendsData(trendingSearches, geo) {
    try {
        for (const search of trendingSearches) {
            const articles = search.articles || [];

            for (const article of articles) {
                const { title, url, source = search.image?.source || '', snippet = '' } = article;

                // Cek apakah artikel sudah ada di database
                const exists = await validationGoogleTrends(title);

                if (!exists) {
                    // Insert artikel jika belum ada
                    const { error: insertError } = await supabase
                        .from('googletrends')
                        .insert([{
                            geo,
                            title,
                            url,
                            source,
                            snippet,
                            timestamp: new Date()  // Using current timestamp
                        }]);

                    if (insertError) {
                        console.error('Error inserting data into Supabase:', insertError);
                        throw new Error('Error inserting data into database');
                    }
                }
            }
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
            console.log(`Kondisi Ini Bekerja`);
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

export {
    saveArticle,
    saveImage,
    getAndHitToken,
    webHookTelegram,
    saveGoogleTrendsData
};
