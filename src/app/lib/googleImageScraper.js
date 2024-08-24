import {
  GOOGLE_IMG_SCRAP,
  GOOGLE_IMG_INVERSE_ENGINE_URL,
  GOOGLE_IMG_INVERSE_ENGINE_UPLOAD,
  GOOGLE_QUERY,
} from "google-img-scrap";
/**
 * Mengambil gambar dari Google berdasarkan kueri pencarian
 * @param {string} query - Kueri pencarian gambar
 * @param {number} [limit=10] - Jumlah gambar yang ingin diambil
 * @returns {Promise<string[]>} - Array URL gambar
 */
export async function scrapeImages(query, limit = 10) {
    try {

        const results = await GOOGLE_IMG_SCRAP({
            search: query,
            custom: "landscape -instagram.com -facebook.com",

            query: {
                EXTENSION: GOOGLE_QUERY.EXTENSION.JPG,
                SIZE:GOOGLE_QUERY.SIZE.LARGE

            },
            safeSearch: false,
            limit
        });

        return results;
    } catch (error) {

        throw new Error('Failed to scrape images');
    }
}
