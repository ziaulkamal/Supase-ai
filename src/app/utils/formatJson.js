export async function cleanFormat(results, category){
    try {
        const result = {
            title: "",
            slug: "",
            category: "",
            data: "",
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
            if (item.data) {
                combinedData.push(item.data);
            }
            if (item.keywords) {
                keywords = item.keywords.join(', ');
            }
        });

        result.title = title;
        result.slug = slug;
        result.category = category;
        result.data = combinedData.join(' ');
        result.keywords = keywords;

        return result;

    } catch (error) {
        console.error('Error processing data:', error);
    }
}