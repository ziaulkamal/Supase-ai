"use client";
import { useEffect, useState } from 'react';
import { getLatestArticles } from '@/app/lib/supabase'; // Sesuaikan path ini dengan struktur foldermu
import Link from 'next/link';

const SingleSidebar = () => {
    const [latestArticles, setLatestArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articles = await getLatestArticles();
                setLatestArticles(articles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="col-xl-4 col-lg-4 sticky-coloum-item">
            <div className="echo-right-ct-1">
                <div className="echo-home-1-hero-area-top-story">
                    <h5 className="text-center">New Recent Post</h5>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error loading articles</p>
                    ) : latestArticles.length > 0 ? (
                        latestArticles.map(article => (
                            <div key={article.id} className="mb-2">
                                <div className="echo-story-text">
                                    <h6>
                                        <Link href={`/${article.slug}`} className="title-hover">
                                            {article.title}
                                        </Link>
                                    </h6>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No articles available</p>
                    )}
                </div>


                <div className="echo-ct-1-add">
                    <div className="echo-ct-add-img">
                        <Link href="#">
                            <img
                                src="/images/category-style-1/item-10.png"
                                alt="Echo"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleSidebar;
