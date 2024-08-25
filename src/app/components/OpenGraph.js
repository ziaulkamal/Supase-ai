

const OpenGraph = ({ title, slug, image, shorts, keywords }) => {

  return (
    <>
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={shorts} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Your Website Name" />
      <meta property="og:locale" content="en_US" />
      {/* Twitter Open Graph */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={shorts} />
      <meta name="twitter:image" content={image} />
      {/* Meta Keywords */}
      <meta name="keywords" content={keywords} />
      <meta name="description" content={shorts} />
    </>
  );
};

export default OpenGraph;
