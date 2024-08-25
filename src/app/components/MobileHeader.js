
import Link from 'next/link';
const MobileHeader = () => {
    return(
        <div className="mobile-menu d-block d-lg-none">
                <nav className="nav-main mainmenu-nav mt--30">
                <ul className="mainmenu" id="mobile-menu">
                    <li className="menu-item">
                    <Link href="#" className="main mobile-menu-link">
                        Home
                    </Link>
                    </li>
                    <li className="menu-item">
                    <Link className="main mobile-menu-link" href="contact.html">
                        Contact
                    </Link>
                    </li>
                </ul>
                </nav>
                <div className="social-wrapper-one">
                <ul>
                    <li>
                    <Link href="#">
                        <i className="fa-brands fa-facebook-f" />
                    </Link>
                    </li>
                    <li>
                    <Link href="#">
                        <i className="fa-brands fa-twitter" />
                    </Link>
                    </li>
                    <li>
                    <Link href="#">
                        <i className="fa-brands fa-youtube" />
                    </Link>
                    </li>
                    <li>
                    <Link href="#">
                        <i className="fa-brands fa-instagram" />
                    </Link>
                    </li>
                    <li>
                    <Link href="#">
                        <i className="fa-brands fa-linkedin-in" />
                    </Link>
                    </li>
                </ul>
                </div>
            </div>
    );
}

export default MobileHeader;