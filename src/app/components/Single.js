import React from 'react';
import Breadcrumb from './Breadcrumb';
import SingleAuthor from './SingleAuthor';
import SingleSidebar from './SingleSidebar';
import Readmore from './Readmore';
import OpenGraph from './OpenGraph';
import Link from 'next/link';


const parseHTMLString = (htmlString, images) => {
    let imageIndex = 0;
    let addedImageAfterHeading = false;

    // Function to clean the text content
    const cleanText = (text) => {
        return text.replace(/(^,)|(,$)/g, ''); // Remove leading and trailing commas
    };

    // Function to add margin to headings
    const addHeadingWithMargin = (headingTag) => {
        return `${headingTag}<div style="margin-bottom: 20px;"></div>`; // Adjust margin as needed
    };

    // Split by tags while preserving the tags
    const fragments = htmlString.split(/(<\/?p>|<\/?h1>|<\/?h2>|<\/?h3>|<\/?h4>|<\/?h5>)/).filter(tag => tag.trim());

    // Initialize an empty array to hold the cleaned HTML
    let result = '';

    // Iterate through fragments and build the resulting HTML string
    fragments.forEach((fragment, index) => {
        if (fragment.startsWith('<h1>') || fragment.startsWith('<h2>') || fragment.startsWith('<h3>') || fragment.startsWith('<h4>') || fragment.startsWith('<h5>')) {
            // Add the heading tag with margin
            result += addHeadingWithMargin(fragment);

            // If it's not the first heading, insert an image after it
            if (addedImageAfterHeading && images[imageIndex]) {
                result += `<img src="${images[imageIndex].url}" alt="${images[imageIndex].title}" class="post-inline-img" />`;
                imageIndex++;
            }

            // Mark that an image should be added after the next heading
            addedImageAfterHeading = true;
        } else if (fragment.startsWith('<p>') && fragment.endsWith('</p>')) {
            const text = cleanText(fragment.replace(/<\/?p>/g, ''));
            if (text) {
                result += `<p class="echo-hero-discription">${text}</p>`;
            }
            // Reset image addition status after a paragraph is added
            addedImageAfterHeading = false;
        } else {
            const cleanedFragment = cleanText(fragment);
            if (cleanedFragment) {
                result += cleanedFragment;
            }
        }
    });

    return result;
};


const extractRandomParagraph = (htmlString) => {
    // Hapus semua tag HTML kecuali <p>
    const cleanedHtml = htmlString.replace(/<(?!\/?p\b)[^>]+>/g, "");

    // Ambil semua teks dalam tag <p>
    const paragraphs = cleanedHtml.match(/<p>(.*?)<\/p>/g);

    if (!paragraphs) {
        return ''; // Tidak ada paragraf ditemukan
    }

    // Ekstrak teks dari tag <p>
    const paragraphTexts = paragraphs.map(p => p.replace(/<\/?p>/g, ''));

    // Pilih paragraf acak
    const randomParagraph = paragraphTexts[Math.floor(Math.random() * paragraphTexts.length)];

    // Potong paragraf menjadi 180 karakter
    const snippet = randomParagraph.substring(0, 180);

    return snippet;
};

const getRandomNumber = (min, max) => {
    if (min > max) {
        throw new Error('Min harus lebih kecil atau sama dengan max');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Single = ({ title, slug, category, data, date, image, keywords, hit }) => {
    // Shuffle the image array to randomize the images
    const shuffledImages = [...image].sort(() => 0.5 - Math.random());

    const parsedData = parseHTMLString(data, shuffledImages);

    return (
        <>
            <OpenGraph
                title={title}
                slug={slug}
                image={shuffledImages[0].url}
                shorts={extractRandomParagraph(parsedData)}
                keywords={keywords}
            />
            <Breadcrumb title={title} slug={slug} category={category} />
            <section className="echo-hero-section inner inner-post">
                <div className="echo-hero">
                    <div className="container">
                        <div className="echo-full-hero-content">
                            <div className="row gx-5 sticky-coloum-wrap">
                                <div className="col-xl-8 col-lg-8">
                                    <div className="echo-hero-baner">
                                        <h2 className="echo-hero-title text-capitalize font-weight-bold">
                                            <Link href={`/${slug}`} className="title-hover">
                                                {title}
                                            </Link>
                                        </h2>
                                        <div className="echo-hero-area-titlepost-post-like-comment-share">
                                            <div className="echo-hero-area-like-read-comment-share">
                                                <Link href="#">
                                                    <i className="fa-light fa-clock" /> 06 minute read
                                                </Link>
                                            </div>
                                            <div className="echo-hero-area-like-read-comment-share">
                                                <Link href="#">
                                                    <i className="fa-light fa-eye" /> {hit} Views
                                                </Link>
                                            </div>
                                            <div className="echo-hero-area-like-read-comment-share">
                                                <Link href="#">
                                                    <i className="fa-light fa-comment-dots" /> 0 Comment
                                                </Link>
                                            </div>
                                            <div className="echo-hero-area-like-read-comment-share">
                                                <Link href="#">
                                                    <i className="fa-light fa-arrow-up-from-bracket" /> {getRandomNumber(111,9999)} Share
                                                </Link>
                                            </div>
                                        </div>
                                        <main dangerouslySetInnerHTML={{ __html: parsedData }}></main>
                                        <div className="keyword mb-5" > <strong>Keywords: </strong> {keywords}</div>
                                    </div>
                                    <Readmore slug={slug} />
                                </div>
                                <SingleSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Single;
