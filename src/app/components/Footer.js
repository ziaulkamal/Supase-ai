const { default: FooterScript } = require("./FooterScript")
import Link from 'next/link';

const Footer = () => {
    return(
        <>
            <footer className="echo-footer-area" id="footer">
                <div className="container">
                    <div className="echo-footer-copyright-area">
                    <div className="copyright-area-inner">

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