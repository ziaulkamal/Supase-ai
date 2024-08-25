import Link from 'next/link';
const SidebarSingle = () => {
    return(
        <div className="col-xl-4 col-lg-4 sticky-coloum-item">
                        <div className="echo-right-ct-1">
                        <div className="echo-popular-hl-img">
                            <div className="echo-home-2-title">
                            <div className="row">
                                <div className="col-lg-12">
                                <div className="echo-home-2-main-title">
                                    <h5 className="text-capitalize text-center">
                                    Popular Categories
                                    </h5>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="echo-popular-item">
                            <ul className="list-unstyled">
                                <li>
                                <h5>Fashion &amp; Life Style</h5>
                                </li>
                                <li>
                                <h5>Relationship</h5>
                                </li>
                                <li>
                                <h5>Art &amp; Culture</h5>
                                </li>
                                <li>
                                <h5>Self Development</h5>
                                </li>
                                <li>
                                <h5>travel &amp; tourism</h5>
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div className="echo-home-1-hero-area-top-story">
                            <h5 className="text-center">Top Story</h5>
                            <div className="echo-top-story">
                            <div className="echo-story-picture img-transition-scale">
                                <Link href="post-details.html">
                                <img
                                    src="/images/category-style-1/item-9.png"
                                    alt="Echo"
                                    className="img-hover"
                                />
                                </Link>
                            </div>
                            <div className="echo-story-text">
                                <h6>
                                <Link href="#" className="title-hover">
                                    14 Tight Samurai Games You...
                                </Link>
                                </h6>
                                <Link href="#" className="pe-none">
                                <i className="fa-light fa-clock" /> 06 minute read
                                </Link>
                            </div>
                            </div>
                            <div className="echo-top-story">
                            <div className="echo-story-picture img-transition-scale">
                                <Link href="post-details.html">
                                <img
                                    src="/images/category-style-1/item-6.png"
                                    alt="Echo"
                                    className="img-hover"
                                />
                                </Link>
                            </div>
                            <div className="echo-story-text">
                                <h6>
                                <Link href="#" className="title-hover">
                                    The Google Pixel Fold looks...
                                </Link>
                                </h6>
                                <Link href="#" className="pe-none">
                                <i className="fa-light fa-clock" /> 06 minute read
                                </Link>
                            </div>
                            </div>
                            <div className="echo-top-story">
                            <div className="echo-story-picture img-transition-scale">
                                <Link href="post-details.html">
                                <img
                                    src="/images/category-style-1/item-7.png"
                                    alt="Echo"
                                    className="img-hover"
                                />
                                </Link>
                            </div>
                            <div className="echo-story-text">
                                <h6>
                                <Link href="#" className="title-hover">
                                    ChatGPT returns to Italy after ban
                                </Link>
                                </h6>
                                <Link href="#" className="pe-none">
                                <i className="fa-light fa-clock" /> 06 minute read
                                </Link>
                            </div>
                            </div>
                            <div className="echo-top-story">
                            <div className="echo-story-picture img-transition-scale">
                                <Link href="post-details.html">
                                <img
                                    src="/images/category-style-1/item-8.png"
                                    alt="Echo"
                                    className="img-hover"
                                />
                                </Link>
                            </div>
                            <div className="echo-story-text">
                                <h6>
                                <Link href="#" className="title-hover">
                                    Avatar: The Way Of Water - how...
                                </Link>
                                </h6>
                                <Link href="#" className="pe-none">
                                <i className="fa-light fa-clock" /> 06 minute read
                                </Link>
                            </div>
                            </div>
                        </div>
                        <div className="echo-feature-area-right-site-follower">
                            <div className="echo-home-2-title">
                            <div className="row">
                                <div className="col-lg-12">
                                <div className="echo-home-2-main-title">
                                    <h5 className="text-capitalize text-center">
                                    Follow Us
                                    </h5>
                                </div>
                                </div>
                            </div>
                            </div>
                            <ul className="list-unstyled">
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-facebook" />
                                20K Fans
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-twitter" />
                                10K Followers
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-instagram" />
                                50K Followers
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-linkedin" />
                                30K Followers
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-pinterest" />
                                30K Followers
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                <i className="fa-brands fa-youtube" />
                                04K Subscriber
                                </Link>
                            </li>
                            </ul>
                        </div>
                        <div className="echo-feature-area-right-site-newsletter">
                            <div className="echo-feature-area-rigth-site-newsletter-title">
                            <h4>Newsletter</h4>
                            </div>
                            <div className="echo-feature-area-right-site-newsletter-img">
                            <img
                                src="/images/home-1/feature-right/news-item-1.png"
                                alt="Echo"
                            />
                            </div>
                            <div className="echo-feature-area-right-site-sub-title">
                            <p>Stay Tuned With Updates</p>
                            </div>
                            <div className="echo-feature-area-right-site-news-subscribe">
                            <form action="POST">
                                <div className="echo-feature-area-right-site-input-box">
                                <input
                                    type="email"
                                    placeholder="Email Addresss.."
                                    required=""
                                />
                                <button type="submit">
                                    <i className="fa-regular fa-arrow-right" />
                                </button>
                                </div>
                            </form>
                            </div>
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
    )
}

export default SingleSidebar;