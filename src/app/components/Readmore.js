"use client";
import { useEffect, useState } from 'react';
import { getNextAndPrevious } from '@/app/lib/supabase'; // Pastikan path ini sesuai dengan struktur foldermu
import Link from 'next/link';


const Readmore = ({ slug }) => {
    const [previous, setPrevious] = useState(null);
    const [next, setNext] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { previous, next } = await getNextAndPrevious(slug);
                setPrevious(previous);
                setNext(next);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        
        <div className="echo-more-news-area">
            <h3 className="title">Next & Previous</h3>
            <div className="inner">
                <div className="row">
                    {previous ? (
                        <div className="col-lg-6">
                            <div className="">
                                <div className="echo-story-text">
                                    <h6>
                                        <Link href={`/${previous.slug}`} className="title-hover">
                                            {previous.title}
                                        </Link>
                                    </h6>
                                    <Link href={`/${previous.slug}`} className="pe-none">
                                        <i className="fa-light fa-clock"/>
                                        {previous.timestamp ? new Date(previous.timestamp).toLocaleDateString() : 'Unknown date'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-lg-6">
                            
                        </div>
                    )}
                    {next ? (
                        <div className="col-lg-6">
                            <div className="">
                                <div className="echo-story-text">
                                    <h6>
                                        <Link href={`/${next.slug}`} className="title-hover">
                                            {next.title}
                                        </Link>
                                    </h6>
                                    <Link href={`/${next.slug}`} className="pe-none">
                                        <i className="fa-light fa-clock"/>
                                        {next.timestamp ? new Date(next.timestamp).toLocaleDateString() : 'Unknown date'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-lg-6">
                            
                        </div>
                    )}
                </div>
            </div>
        </div>  
    );
};

export default Readmore;
