// app/random/page.js (untuk Next.js 13 dengan App Router)
'use client'; // Untuk client-side rendering

import { useEffect } from 'react';

export default function RandomPage() {
  useEffect(() => {
    const redirectImmediately = () => {
      const timestamp = Math.floor(Date.now() / 1000);
      // Langsung redirect ke URL tanpa menunggu respon axios
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/random?timestamp=${timestamp}`;
    };

    redirectImmediately();
  }, []);

  return <div>Redirecting...</div>;
}
