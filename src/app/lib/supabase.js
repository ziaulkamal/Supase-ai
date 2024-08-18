import { createClient } from '@supabase/supabase-js';
import { processImages } from '../utils/imageUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getSettings() {
    try {
        const { data: existingSettings, error: fetchError } = await supabase
            .from('settings')
            .select('bygoogles, bykeywords')
            .single();

        if (fetchError) {
            throw new Error('Error Fetching Settings: ' + fetchError.message);
        }

        if (!existingSettings) {
            const { data: insertedData, error: insertError } = await supabase
                .from('settings')
                .insert([{ bygoogles: false, bykeywords: true, updated_at: new Date() }])
                .single();

            if (insertError) {
                throw new Error('Error Inserting Default Settings: ' + insertError.message);
            }

            return { bygoogles: insertedData.bygoogles, bykeywords: insertedData.bykeywords };
        }

        return { bygoogles: existingSettings.bygoogles, bykeywords: existingSettings.bykeywords };
    } catch (error) {
        console.error('Error in getSettings function:', error.message);
        throw error;
    }
}

async function saveArticle(result) {
    const { title, slug, category, articles, keywords } = result;
    try {
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
            throw new Error('Error Saving Article: ' + error.message);
        }
    } catch (error) {
        console.error('Error in saveArticle:', error.message);
        throw error;
    }
}

async function saveImage(slug, data) {
    try {
        const { error } = await supabase
            .from('images_ai')
            .upsert([
                {
                    slug,
                    images_data: data,
                }
            ]);

        if (error) {
            throw new Error('Error saving to Supabase: ' + error.message);
        }
    } catch (error) {
        console.error('Error in saveImage:', error.message);
        throw error;
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
            throw new Error('Error updating token hit count: ' + updateError.message);
        }

        return {
            token: tokenData.secretkey,
            endpoint: tokenData.url_endpoint,
            status: 'success'
        };
    } catch (error) {
        console.error('Error in getAndHitToken:', error.message);
        throw error;
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
            throw new Error('Error inserting token into Supabase: ' + error.message);
        }
    } catch (error) {
        console.error('Error in insertToken:', error.message);
        throw error;
    }
}

async function insertArticles(result, category) {
    try {
        const { title, slug, articles, keywords } = result;

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
            throw new Error('Error Saving Article: ' + error.message);
        }

        const imageJson = await processImages(slug, 20);
        await saveImage(slug, imageJson);
        return 'success';
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
            throw new Error('Error fetching article count: ' + articlesError.message);
        }

        const { data: categoriesData, error: categoriesError } = await supabase
            .from('articles_ai')
            .select('category');

        if (categoriesError) {
            throw new Error('Error fetching categories: ' + categoriesError.message);
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

        if (selectError && selectError.code !== 'PGRST116') {
            throw new Error('Error checking existing title: ' + selectError.message);
        }

        return !!existingArticle;
    } catch (error) {
        console.error('Error in validationGoogleTrends:', error.message);
        throw error;
    }
}

async function saveGoogleTrendsData(trendingSearchesDays, geo) {
    try {
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

        const insertPromises = allArticles.map(async article => {
            const exists = await validationGoogleTrends(article.title);
            if (!exists) {
                return supabase.from('googletrends').insert([{
                    geo,
                    title: article.title,
                    url: article.url,
                    source: article.source,
                    snippet: article.snippet,
                    timestamp: new Date(),
                }]);
            }
        });

        const results = await Promise.all(insertPromises);

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
                throw new Error('Error saving data to Supabase: ' + error.message);
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
        const { data: ideas, error: fetchError } = await supabase
            .from('ideas')
            .select('*')
            .eq('status', false)
            .order('total', { ascending: false })
            .limit(1);

        if (fetchError) {
            throw new Error('Error Fetching Ideas: ' + fetchError.message);
        }

        if (ideas.length === 0) {
            return null;
        }

        const idea = ideas[0];

        const updatedTotal = idea.total - 1;

        const { error: updateError } = await supabase
            .from('ideas')
            .update({
                total: updatedTotal,
                status: updatedTotal <= 0 ? true : false,
                updated_at: new Date()
            })
            .eq('id', idea.id);

        if (updateError) {
            throw new Error('Error Updating Idea: ' + updateError.message);
        }

        return idea;
    } catch (error) {
        console.error('Error in getRandomIdeas:', error.message);
        throw error;
    }
}

async function getRandomGoogle() {
    try {
        const { data: googleTrends, error: fetchError } = await supabase
            .from('googletrends')
            .select('*')
            .eq('status', false)
            .order('timestamp', { ascending: true })
            .limit(1);

        if (fetchError) {
            throw new Error('Error Fetching Google Trend: ' + fetchError.message);
        }

        if (googleTrends.length === 0) {
            return null;
        }

        const trend = googleTrends[0];

        const { error: updateError } = await supabase
            .from('googletrends')
            .update({
                status: true,
                timestamp: new Date()
            })
            .eq('id', trend.id);

        if (updateError) {
            throw new Error('Error Updating Google Trend Status: ' + updateError.message);
        }

        return trend;
    } catch (error) {
        console.error('Error in getRandomGoogle:', error.message);
        throw error;
    }
}

async function getSingleDatas(id, type) {
    let prompt, lang, category;

    try {
        switch (type) {
            case 'keyword':
                const { data: keywordData, error: keywordError } = await supabase
                    .from('ideas')
                    .select('keyword, category, language')
                    .eq('id', id)
                    .single();

                if (keywordError) {
                    throw new Error('Error fetching keyword data: ' + keywordError.message);
                }

                if (keywordData) {
                    prompt = keywordData.keyword;
                    lang = keywordData.language;
                    category = keywordData.category;
                }
                break;

            case 'google':
                const { data: googleData, error: googleError } = await supabase
                    .from('googletrends')
                    .select('title, geo, source')
                    .eq('id', id)
                    .single();

                if (googleError) {
                    throw new Error('Error fetching google trends data: ' + googleError.message);
                }

                if (googleData) {
                    prompt = googleData.title.endsWith('...') ? googleData.title.slice(0, -3) : googleData.title;
                    lang = googleData.geo;
                    category = googleData.source;
                }
                break;

            default:
                throw new Error('Invalid type provided');
        }

        return { prompt, lang, category };
    } catch (error) {
        console.error('Error in getSingleDatas:', error.message);
        throw error;
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
    getRandomGoogle,
    getSingleDatas,
    insertArticles
};
