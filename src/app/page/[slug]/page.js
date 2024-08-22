// pages/[slug].js or pages/post/[slug].js (sesuaikan dengan struktur proyek Anda)
"use client";
import { useState, useEffect } from 'react';
import Single from '@/app/components/Single';
import { getSinglePostWithImage } from '@/app/lib/supabase';
import NotFound from '@/app/components/NotFound';

export default function Page({ params }) {
  const { slug } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const articleWithImage = await getSinglePostWithImage(slug);
      setData(articleWithImage);

    }

    fetchData();
  }, [slug]);


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
    />
  );
}
