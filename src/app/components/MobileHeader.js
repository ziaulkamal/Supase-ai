

const MobileHeader = () => {
    return(
        <div className="mobile-menu d-block d-lg-none">
                <nav className="nav-main mainmenu-nav mt--30">
                <ul className="mainmenu" id="mobile-menu">
                    <li className="menu-item">
                    <a href="#" className="main mobile-menu-link">
                        Home
                    </a>
                    </li>
                    <li className="menu-item">
                    <a className="main mobile-menu-link" href="contact.html">
                        Contact
                    </a>
                    </li>
                </ul>
                </nav>
                <div className="social-wrapper-one">
                <ul>
                    <li>
                    <a href="#">
                        <i className="fa-brands fa-facebook-f" />
                    </a>
                    </li>
                    <li>
                    <a href="#">
                        <i className="fa-brands fa-twitter" />
                    </a>
                    </li>
                    <li>
                    <a href="#">
                        <i className="fa-brands fa-youtube" />
                    </a>
                    </li>
                    <li>
                    <a href="#">
                        <i className="fa-brands fa-instagram" />
                    </a>
                    </li>
                    <li>
                    <a href="#">
                        <i className="fa-brands fa-linkedin-in" />
                    </a>
                    </li>
                </ul>
                </div>
            </div>
    );
}

export default MobileHeader;