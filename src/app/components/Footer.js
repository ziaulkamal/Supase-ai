const { default: FooterScript } = require("./FooterScript")


const Footer = () => {
    return(
        <>
            <footer className="echo-footer-area" id="footer">
                <div className="container">
                    <div className="echo-row">
                    <div className="echo-footer-content-1">
                        <div className="echo-get-in-tuch">
                        <h4 className="text-capitalize">Get In Touch</h4>
                        </div>
                        <div className="echo-footer-address">
                        <span className="text-capitalize">
                            <i className="fa-regular fa-map" /> 255 Sheet, New Avanew, NY
                        </span>
                        <span className="text-capitalize">
                            <i className="fa-regular fa-phone" /> (00) 236 123 456 88
                        </span>
                        <span className="text-capitalize">
                            <i className="fa-sharp fa-regular fa-envelope" />
                            info@demomail.com
                        </span>
                        <div className="echo-footer-social-media">
                            <a href="#">
                            <i className="fa-brands fa-facebook-f" />
                            </a>
                            <a href="#">
                            <i className="fa-brands fa-twitter" />
                            </a>
                            <a href="#">
                            <i className="fa-brands fa-linkedin-in" />
                            </a>
                            <a href="#">
                            <i className="fa-brands fa-instagram" />
                            </a>
                            <a href="#">
                            <i className="fa-brands fa-youtube" />
                            </a>
                        </div>
                        </div>
                    </div>
                    <div className="echo-footer-content-2">
                        <div className="echo-get-in-tuch">
                        <h4 className="text-capitalize">Most Popular</h4>
                        </div>
                        <div className="echo-footer-most-popular">
                        <ul className="list-unstyled">
                            <li>
                            <a href="#">Business</a>
                            </li>
                            <li>
                            <a href="#">Life Style</a>
                            </li>
                            <li>
                            <a href="#">Word</a>
                            </li>
                            <li>
                            <a href="#">Fashion</a>
                            </li>
                            <li>
                            <a href="#">Politics</a>
                            </li>
                            <li>
                            <a href="#">Travels</a>
                            </li>
                            <li>
                            <a href="#">Tech</a>
                            </li>
                            <li>
                            <a href="#">Sports</a>
                            </li>
                            <li>
                            <a href="#">Video</a>
                            </li>
                            <li>
                            <a href="#">Game</a>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div className="echo-footer-content-3">
                        <div className="echo-get-in-tuch">
                        <h4 className="text-capitalize">Help</h4>
                        </div>
                        <div className="echo-footer-help">
                        <ul className="list-unstyled">
                            <li>
                            <a href="about.html">About</a>
                            </li>
                            <li>
                            <a href="#">Media Kit</a>
                            </li>
                            <li>
                            <a href="#">Advertise</a>
                            </li>
                            <li>
                            <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                            <a href="#">FAQ</a>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div className="echo-footer-content-4">
                        <div className="echo-get-in-tuch">
                        <h4 className="text-capitalize">Newsletter</h4>
                        </div>
                        <div className="echo-footer-news-text">
                        <p>Register now to get latest updates on promotion &amp; coupons.</p>
                        </div>
                        <div className="echo-subscribe-box-button">
                        <form action="POST">
                            <div className="echo-subscribe-input-fill">
                            <svg
                                width={15}
                                height={13}
                                viewBox="0 0 15 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                opacity="0.8"
                                d="M14.4414 11.6674C14.4402 11.8345 14.3734 11.9944 14.2553 12.1127C14.1371 12.2309 13.9773 12.2979 13.8101 12.2993H2.34541C2.17792 12.2991 2.01736 12.2325 1.89899 12.114C1.78062 11.9955 1.71413 11.8348 1.71413 11.6674V11.0265H13.1687V3.58109L8.07777 8.16291L1.71413 2.43564V1.48109C1.71413 1.31232 1.78118 1.15045 1.90052 1.03111C2.01986 0.911772 2.18172 0.844727 2.3505 0.844727H13.805C13.9738 0.844727 14.1357 0.911772 14.255 1.03111C14.3744 1.15045 14.4414 1.31232 14.4414 1.48109V11.6674ZM3.26304 2.11745L8.07777 6.45109L12.8925 2.11745H3.26304ZM0.441406 8.48109H5.53232V9.75382H0.441406V8.48109ZM0.441406 5.29927H3.62322V6.572H0.441406V5.29927Z"
                                fill="white"
                                />
                            </svg>
                            <input type="email" placeholder="Enter your email" required="" />
                            </div>
                            <div className="echo-footer-area-subscribe-button">
                            <a href="#" className="echo-py-btn-border text-capitalize">
                                subscribe
                            </a>
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
                    <div className="echo-footer-copyright-area">
                    <div className="copyright-area-inner">
                        <div className="footer-logo">
                        <a href="index.html">
                            <img
                            src="/images/home-1/site-logo/footer-logo-1.svg"
                            alt="logo"
                            />
                        </a>
                        </div>
                        <div className="copyright-content">
                        <h5 className="title">© Copyright 2023 by Echo</h5>
                        </div>
                        <div className="select-area">
                        <select name="lang" id="lang">
                            <option value="english">English</option>
                            <option value="bengali">Bengali</option>
                            <option value="arabic">Arabic</option>
                            <option value="hindi">Hindi</option>
                            <option value="urdu">Urdu</option>
                            <option value="french">French</option>
                            <option value="tamil">Tamil</option>
                            <option value="marathi">Marathi</option>
                        </select>
                        </div>
                    </div>
                    </div>
                </div>
            </footer>
            <button className="scroll-top-btn">
                <i className="fa-regular fa-angles-up"></i>
            </button>
            <div id="anywhere-home"></div>
            <FooterScript />
        </>
    )
}

export default Footer;