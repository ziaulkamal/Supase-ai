import supabase from '@/app/lib/supabase';
import { processImages } from '@/app/utils/imageUtils';

async function saveToSupabase(result) {
    const { title, slug, articles, category, keywords } = result;

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
        console.error('Error saving to Supabase:', error);
        throw new Error('Error saving to Supabase');
    }
}

async function saveImageToSupabase(slug, data) {
    const { error } = await supabase
        .from('images_ai')
        .upsert([
            {
                slug,
                images_data: data,
            }
        ]);
    if (error) {
        console.error('Error saving to Supabase:', error);
        throw new Error('Error saving to Supabase');
    }
}

export async function formatAndSaveData(results, category) {
    try {
        const result = {
            title: "",
            slug: "",
            category: "",
            articles: "",
            keywords: ""
        };

        let combinedData = [];
        let title = '';
        let slug = '';
        let keywords = '';

        Object.keys(results).forEach(key => {
            const item = results[key];

            if (item.title) {
                title = item.title;
            }
            if (item.slug) {
                slug = item.slug;
            }
            if (item.category) {
                category = item.category;
            }
            if (item.articles) {
                combinedData.push(item.articles);
            }
            if (item.keywords) {
                keywords = item.keywords.join(', ');
            }
        });

        result.title = title;
        result.slug = slug;
        result.category = category;
        result.articles = combinedData.join(' ');
        result.keywords = keywords;

        await saveToSupabase(result);
        const imageJson = await processImages(result.slug, 20);
        await saveImageToSupabase(result.slug, imageJson);

    } catch (error) {
        console.error('Error processing data:', error);
    }
}
