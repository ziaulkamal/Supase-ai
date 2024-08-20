
import Breadcrumb from './Breadcrumb';
import SingleAuthor from './SingleAuthor';
import SingleSidebar from './SingleSidebar';
import Readmore from './Readmore';

const parseHTMLString = (htmlString) => {
    let h1Found = false;

    // Function to clean the text content
    const cleanText = (text) => {
        return text.replace(/(^,)|(,$)/g, ''); // Remove leading and trailing commas
    };

    // Split by tags while preserving the tags
    const fragments = htmlString.split(/(<\/?p>|<\/?h1>|<\/?h2>|<\/?h3>|<\/?h4>|<\/?h5>)/).filter(tag => tag.trim());

    // Initialize an empty array to hold the cleaned HTML
    let result = '';
    
    // Iterate through fragments and build the resulting HTML string
    fragments.forEach((fragment, index) => {
        if (fragment.startsWith('<h1>') && !h1Found) {
            h1Found = true; // Skip the first <h1> tag
            return;
        } else if (fragment.startsWith('</h1>')) {
            result += '</h2>'; // Convert </h1> to </h2>
            return;
        } else if (fragment.startsWith('<h1>')) {
            result += '<h2 class="title">'; // Convert <h1> to <h2>
            return;
        } else if (fragment.startsWith('<p>') && fragment.endsWith('</p>')) {
            const text = cleanText(fragment.replace(/<\/?p>/g, ''));
            if (text) {
                result += `<p class="echo-hero-discription">${text}</p>`;
            }
        } else if (fragment.startsWith('<h5>') && fragment.endsWith('</h5>')) {
            const text = cleanText(fragment.replace(/<\/?h5>/g, ''));
            if (text) {
                result += `<h5 class="title">${text}</h5>`;
            }
        } else if (fragment.startsWith('<h4>') && fragment.endsWith('</h4>')) {
            const text = cleanText(fragment.replace(/<\/?h4>/g, ''));
            if (text) {
                result += `<h4 class="title">${text}</h4>`;
            }
        } else if (fragment.startsWith('<h3>') && fragment.endsWith('</h3>')) {
            const text = cleanText(fragment.replace(/<\/?h3>/g, ''));
            if (text) {
                result += `<h3 class="title">${text}</h3>`;
            }
        } else if (fragment.startsWith('<h2>') && fragment.endsWith('</h2>')) {
            const text = cleanText(fragment.replace(/<\/?h2>/g, ''));
            if (text) {
                result += `<h2 class="title">${text}</h2>`;
            }
        } else {
            const cleanedFragment = cleanText(fragment);
            if (cleanedFragment) {
                result += cleanedFragment;
            }
        }
    });

    // Handle any remaining open tags
    if (result.endsWith('<h1 class="title">')) {
        result = result.replace(/<h1 class="title">$/, '<h2 class="title">');
    }
    if (result.endsWith('</h1>')) {
        result = result.replace(/<\/h1>$/, '</h2>');
    }

    return result;
};



const Single = ({title, slug, category, data, date, image}) => {
    const parsedData = parseHTMLString(data);
    return(
        <>
            <Breadcrumb title={title} slug={slug} category={category} />
            <section className="echo-hero-section inner inner-post">
            <div className="echo-hero">
                <div className="container">
                <div className="echo-full-hero-content">
                    <div className="row gx-5 sticky-coloum-wrap">
                    <div className="col-xl-8 col-lg-8">
                        <div className="echo-hero-baner">
                        <div className="echo-inner-img-ct-1  img-transition-scale">
                            <a href="post-details.html">
                            <img
                                src="/images/category-style-1/item-1.png"
                                alt="Echo"
                                className="post-style-1-frist-hero-img"
                            />
                            </a>
                        </div>
                        <h2 className="echo-hero-title text-capitalize font-weight-bold">
                            <a href="post-details.html" className="title-hover">
                            {title}
                            </a>
                        </h2>
                        <div className="echo-hero-area-titlepost-post-like-comment-share">
                            <div className="echo-hero-area-like-read-comment-share">
                            <a href="#">
                                <i className="fa-light fa-clock" /> 06 minute read
                            </a>
                            </div>
                            <div className="echo-hero-area-like-read-comment-share">
                            <a href="#">
                                <i className="fa-light fa-eye" /> 3.5k Views
                            </a>
                            </div>
                            <div className="echo-hero-area-like-read-comment-share">
                            <a href="#">
                                <i className="fa-light fa-comment-dots" /> 05 Comment
                            </a>
                            </div>
                            <div className="echo-hero-area-like-read-comment-share">
                            <a href="#">
                                <i className="fa-light fa-arrow-up-from-bracket" /> 1.5k
                                Share
                            </a>
                            </div>
                        </div>
                        <main dangerouslySetInnerHTML={{ __html: parsedData }}></main>
                        

                        </div>

                        <SingleAuthor />
                        <Readmore />
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