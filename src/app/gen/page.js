// app/random/page.js (untuk Next.js 13 dengan App Router)
'use client'; // Untuk client-side rendering

import { useEffect } from 'react';
import axios from 'axios';

export default function RandomPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await axios.get(`/api/random?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.status === 200) {
          const { id, type } = response.data; // Asumsikan respons mengandung id dan type
          window.location.href = `/api/create-content?id=${id}&type=${type}&timestamp=${timestamp}`;
        } else {
          // Tangani jika status bukan 200
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  return <div>Redirecting...</div>;
}
