"use client";
import React, { useEffect, useState } from 'react';
import { getTopCategories } from '@/app/lib/supabase';

const Header = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const topCategories = await getTopCategories();
            console.log(topCategories);
            setCategories(topCategories);
        };
        fetchCategories();
    }, []);

    return (
        <header className="echo-header-area">
            <div className="echo-home-1-menu">
                <div className="echo-site-main-logo-menu-social">
                    <div className="container">
                        <div className="row align-items-center plr_md--30 plr_sm--30 plr--10">
                            <div className="col-xl-2 col-lg-2 col-md-7 col-sm-7 col-7">
                                <div className="echo-site-logo">
                                    <a className="logo-light" href="index.html">
                                        <img src="/images/home-1/site-logo/site-logo.svg" alt="Echo" />
                                    </a>
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-7 d-none d-lg-block">
                                <nav>
                                    <div className="echo-home-1-menu">
                                        <ul className="list-unstyled echo-desktop-menu">
                                            <li className="menu-item"> 
                                                <a href="/" className="echo-dropdown-main-element"> Home </a> 
                                            </li>
                                            {categories.map(category => (
                                                <li key={category} className="menu-item">
                                                    <a href={`/category/${category}`} className="echo-dropdown-main-element">
                                                        {category}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-5 col-sm-5 col-5">
                                <div className="echo-home-1-social-media-icons">
                                    <ul className="list-unstyled social-area">
                                        <li><a href="#"><i className="fa-brands fa-facebook-f" /></a></li>
                                        <li><a href="#"><i className="fa-brands fa-twitter" /></a></li>
                                        <li><a href="#"><i className="fa-brands fa-linkedin-in" /></a></li>
                                        <li><a href="#"><i className="fa-brands fa-instagram" /></a></li>
                                        <li><a href="#"><i className="fa-brands fa-pinterest-p" /></a></li>
                                        <li><a href="#"><i className="fa-brands fa-youtube" /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
