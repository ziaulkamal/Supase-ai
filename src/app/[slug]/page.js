// pages/[slug].js or pages/post/[slug].js (sesuaikan dengan struktur proyek Anda)
"use client";
import { useState, useEffect } from 'react';
import Single from '@/app/components/Single';
import { getSinglePostWithImage } from '@/app/lib/supabase';
import NotFound from '../components/NotFound';
import Loading from '../components/Loading';

export default function Page({ params }) {
  const { slug } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk kondisi loading

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Set loading ke true saat mulai fetch data
      const articleWithImage = await getSinglePostWithImage(slug);
      setData(articleWithImage);
      setLoading(false); // Set loading ke false setelah data berhasil diambil
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <title>Loading</title>; // Tampilkan indikator loading
  }

  if (!data) {
    return <NotFound />;
  }


  return (
    <Single 
      title={data.title}
      slug={data.slug}
      category={data.category}
      data={data.data}
      image={data.image_data} // Kirimkan data gambar ke komponen Single
      keywords={data.keywords}
      hit={data.hit}
    />
  );
}
