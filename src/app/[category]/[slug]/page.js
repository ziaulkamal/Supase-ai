// pages/[slug].js or pages/post/[slug].js (sesuaikan dengan struktur proyek Anda)
"use client";
import { useState, useEffect } from 'react';
import Single from '@/app/components/Single';
import { getSinglePostWithImage } from '@/app/lib/supabase';

export default function Page({ params }) {
  const { slug } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const articleWithImage = await getSinglePostWithImage(slug);
      setData(articleWithImage);
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Artikel tidak ditemukan</div>;
  }

  return (
    <Single 
      title={data.title}
      slug={data.slug}
      category={data.category}
      data={data.data}
      image={data.image_data} // Kirimkan data gambar ke komponen Single
    />
  );
}
