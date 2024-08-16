import { getTokenAndUpdateHit } from '@/app/lib/geminiService';

(async () => {
    try {
        const result = await getTokenAndUpdateHit();
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
