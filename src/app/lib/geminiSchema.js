import axios from 'axios';
import { getAndHitToken } from './supabase';

let apiKey = null;
let apiUrl = null;
let sessionCount = 0;

async function callGeminiAPI(prompt) {
    try {
        // Cek apakah perlu mendapatkan API key baru
        if (!apiKey || sessionCount >= 7) {
            const { token, endpoint } = await getAndHitToken();
            apiKey = token;
            apiUrl = endpoint;
            sessionCount = 0;  // Reset hitungan sesi setelah mengganti API key
        }

        sessionCount += 1;  // Tambah hitungan sesi

        const response = await axios.post(
            apiUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.8,
                    topK: 145,
                    topP: 1,
                    maxOutputTokens: 1300,
                    stopSequences: []
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    key: apiKey
                }
            }
        );

        console.log(`Session ${sessionCount}`);
        return response.data;

    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Retry mechanism
async function retryFunction(fn, retries = 1, delay = 500) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            if (attempt === retries) {
                throw error;
            }
            await sleep(delay);
        }
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePageDataWithRetry(prompt, lang, tone, sessionType, retries = 1){
    let sessionPrompt;
    switch (sessionType) {
        case 1:
            sessionPrompt = `Create a JSON object with the following structure for an page about ${prompt}: { "title": "create new title, and use language formated ${lang} ", "slug": "a-slug-for-the-title" }. only get object without include opening and say thats a json, long of title must be 140 character`;
            break;
        case 2:
            sessionPrompt = `relate with before prompt, avoid using existing context, Create a comprehensive article into a JSON object, Please ensure that the response does not include json\n at the start or at the end, inside paragraph must include heading tag html formatted for an article about ${prompt} based on the title, lang formatted ${lang}, with tone writing ${tone}. make sure data inside the right place, do not insert more attribute inside data object, The format should be: { "data": "html formatted with opening <h2> and add more heading tags, if it is a heading and each heading has 2 paragraphs, H2: Should clearly define the pages main topic." }. only get object without include opening and say thats a json`;
            break;
        default:
            throw new Error('Invalid session type');
    }
    const fetchSessionData = async () => {
        const response = await callGeminiAPI(sessionPrompt);
        if (!response.candidates || response.candidates.length === 0 ||
            !response.candidates[0].content || 
            !response.candidates[0].content.parts || 
            response.candidates[0].content.parts.length === 0 ||
            !response.candidates[0].content.parts[0].text) {
            throw new Error('No valid data found in session response.');
        }
        return response;
    };

    return retryFunction(() => fetchSessionData(), retries);
}

// Function to generate session data with retry
async function generateSessionDataWithRetry(prompt, lang, tone, sessionType, retries = 1) {
    let sessionPrompt;
    switch (sessionType) {
        case 1:
            sessionPrompt = `Create a JSON object with the following structure for an article about ${prompt}: { "title": "create new title, and use language formated ${lang} ", "slug": "a-slug-for-the-title" }. only get object without include opening and say thats a json, long of title must be 140 character`;
            break;
        case 2:
            sessionPrompt = `relate with before prompt, avoid using existing context, Create a comprehensive article into a JSON object, Please ensure that the response does not include json\n at the start or at the end, inside paragraph must include heading tag html formatted for an article about ${prompt} based on the title, lang formatted ${lang}, with tone writing ${tone}. make sure data inside the right place, do not insert more attribute inside data object, The format should be: { "data": "html formatted with opening <h2> if it is a heading and each heading has 2 to 3 paragraphs, Each paragraph contains a 600 words, H2: Should clearly define the article’s main topic, at the beginning using good opener context." }. only get object without include opening and say thats a json`;
            break;
        case 3:
            sessionPrompt = `relate with before prompt, avoid using existing context, Create a comprehensive article into a JSON object, Please ensure that the response does not include '''json\n at the start or at the end, inside paragraph must include heading tag html formatted for an article about ${prompt} based on the title, lang formatted ${lang}, with tone writing ${tone}. Make sure data inside the right place, do not insert more attribute inside data object, The format should be: { "data": "html formatted with opening <h3> if it is a heading and each heading has 2 to 3 paragraphs, Each paragraph contains a 600 words, H3: Organize content into significant sections. and if there is a table or other HTML element, make sure DON'T INCLUDE CONCLUSION, it must be attached as well" }. only get object without include opening and say thats a json`;
            break;
        case 4:
            sessionPrompt = `relate with before prompt, avoid using existing context, Create a comprehensive article into a JSON object, Please ensure that the response does not include json\n at the start or at the end, inside paragraph must include heading tag html formatted for an article about ${prompt} based on the title, lang formatted ${lang}, with tone writing ${tone}. Make sure data inside the right place, do not insert more attribute inside data object, The format should be: { "data": "html formatted with opening <h3> if it is a heading and each heading has 2 to 3 paragraphs, Each paragraph contains a 800 words, an HTML document with <h3>, <p>, <ul> and <table> elements, ensuring pure HTML output without markdown. H3: Break down each H3 section into more detailed topics.. and if there is a table or other HTML element, make sure DON'T INCLUDE CONCLUSION, it must be attached as well. like table html tag or number Html tag or bullet html tag" }. only get object without include opening and say thats a json`;
            break;
        case 5:
            sessionPrompt = `Relate with the previous prompt, avoid using existing context. Create a comprehensive article in a JSON object. Ensure the response does not include '''json\n at the start or end. Inside the paragraph, include heading tags formatted in HTML for an article about ${prompt}, based on the title, formatted in ${lang}, with a tone of ${tone}. Ensure data is in the correct place and do not insert additional attributes inside the data object. The format should be: { "data": "HTML formatted with opening <h4> for headings, each heading has 2 to 3 paragraphs, each paragraph contains 800 words, and includes <h4>, <p> and <table> elements, ensuring pure HTML output without markdown. H4: Provide in-depth information within each section,make sure DON'T INCLUDE CONCLUSION. If there is a table or other HTML elements, include them as well." } Only return the object without including the opening or indicating it’s JSON.`;
            break;
        case 6:
            sessionPrompt = `Relate with the previous prompt, avoid using existing context. Create a comprehensive article in a JSON object. Please ensure the response does not include '''json\n at the start or end. Inside the paragraph, include heading tags formatted in HTML for an article about ${prompt}, based on the title, formatted in ${lang}, with a tone of ${tone}. Make sure data is in the right place and do not insert additional attributes inside the data object. The format should be: { "data": "HTML formatted with opening <h5> for headings, each heading has 2 paragraphs, each paragraph contains 800 words, and includes <h5>, <p> and <ol> elements, ensuring pure HTML output without markdown. Include a SPECIFIC CONCLUSION under an <h5> heading, and context conclusion include inside tag <p>, they must be attached as well." }. Only get the object without including the opening and saying it's JSON.`;
            break;
        case 7:
            sessionPrompt = `Create a JSON object with keywords related to the article on ${prompt}. The format should be: { "keywords": ["keyword1", "keyword2", "keyword3", ...] }, Only get the object without including the opening and saying it's JSON.`;
            break;
        default:
            throw new Error('Invalid session type');
    }

    const fetchSessionData = async () => {
        const response = await callGeminiAPI(sessionPrompt);
        if (!response.candidates || response.candidates.length === 0 ||
            !response.candidates[0].content || 
            !response.candidates[0].content.parts || 
            response.candidates[0].content.parts.length === 0 ||
            !response.candidates[0].content.parts[0].text) {
            throw new Error('No valid data found in session response.');
        }
        return response;
    };

    return retryFunction(() => fetchSessionData(), retries);
}

// Function to format session data
function formatSessionData(response) {
    if (response.candidates && response.candidates.length > 0 &&
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts.length > 0 &&
        response.candidates[0].content.parts[0].text) {

        try {
            const cleanedText = response.candidates[0].content.parts[0].text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
            return JSON.parse(cleanedText);
        } catch (error) {
            console.warn('Failed to format session data:', error);
            return {}; // Return an empty object if parsing fails
        }
    } else {
        console.warn('No valid parts found in session data.');
        return {}; // Return an empty object if no valid data found
    }
}

// Function to convert string to slug
function stringToSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export {
    generateSessionDataWithRetry,
    generatePageDataWithRetry,
    formatSessionData,
    stringToSlug
};
