// /app/auto/page.js
"use client";
import { useEffect } from 'react';
import axios from 'axios';

async function fetchGoogleTrendsData(geo, timestamp) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends?geo=${geo}&timestamp=${timestamp}`);
    console.log(response);
    return response.data;  // Pastikan untuk mengembalikan data yang relevan
  } catch (error) {
    console.error('Error in fetchGoogleTrendsData:', error.message);
    return { status: 'error', message: error.message };
  }
}

const Auto = () => {
  useEffect(() => {
    const geo = 'ID'; // Ganti dengan nilai default atau parameter yang sesuai
    const timestamp = Math.floor(Date.now() / 1000);

    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Fungsi untuk fetch data dan melakukan redirect
    const fetchDataAndRedirect = async () => {
      const data = await fetchGoogleTrendsData(geo, timestamp);
      // Tampilkan data di konsol untuk debugging
      console.log(data);

      // Melakukan redirect
      window.location.href = redirectUrl;
    };

    fetchDataAndRedirect();
  }, []);

  return <p>Redirecting...</p>;
};

export default Auto;
