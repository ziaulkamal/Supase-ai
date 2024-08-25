
import MobileHeader from './MobileHeader';
import Link from 'next/link';
const Sidebar = () => {
    return(
        <div id="side-bar" className="side-bar header-one">
            <div className="inner">
                <button className="close-icon-menu">
                <i className="far fa-times" />
                </button>

                <div className="inner-main-wrapper-desk d-none d-lg-block">
                <div className="thumbnail">
                    <img src="/images/sidemenu-logo.svg" alt="echo" />
                </div>
                <div className="inner-content">
                    <div className="category-menu-area">
                    <ul className="category-area">
                        <li className="item">
                        <div className="image-area">
                            <Link href="#">
                            <img src="/images/category-style-1/1.png" alt="" />
                            </Link>
                        </div>
                        <div className="content">
                            <div className="recent-post-title">
                            <Link href="#">The incident began as an argument among.</Link>
                            </div>
                            <p className="desc">
                            <Link href="#">
                                <i className="fa-light fa-user" />
                                Asley Graham
                            </Link>
                            </p>
                        </div>
                        </li>
                        <li className="item">
                        <div className="image-area">
                            <Link href="#">
                            <img src="/images/category-style-1/2.png" alt="" />
                            </Link>
                        </div>
                        <div className="content">
                            <div className="recent-post-title">
                            <Link href="#">The incident began as an argument among.</Link>
                            </div>
                            <p className="desc">
                            <Link href="#">
                                <i className="fa-light fa-user" />
                                Emily Dicingson
                            </Link>
                            </p>
                        </div>
                        </li>
                    </ul>
                    </div>
                    <div className="newsletter-form">
                    <div className="form-inner">
                        <div className="content">
                        <div className="newsletter-image">
                            <img
                            src="/images/home-1/feature-right/news-item-1.png"
                            alt=""
                            />
                        </div>
                        <h3 className="title">Get Newsletter</h3>
                        <p className="desc">Notification products, updates</p>
                        </div>
                        <form action="#">
                        <div className="input-div">
                            <input type="email" placeholder="Your email..." required="" />
                        </div>
                        <button type="submit" className="subscribe-btn">
                            Subscribe Now
                        </button>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <MobileHeader />
        </div>

    )
}

export default Sidebar;