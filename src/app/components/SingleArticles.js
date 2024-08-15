import Breadcrumb from "./Breadcrumb";
import SingleSidebar from "./SingleSidebar";


const SingleArticles = ({ content , title, author, image, category, date, hit }) => {
    return(
        <>
            <Breadcrumb />
            <section className="echo-hero-section inner inner-post inner-post-2">
                <div className="echo-hero">
                    <div className="container">
                    <div className="echo-full-hero-content">
                        <div className="row gx-5 sticky-coloum-wrap">
                        <div className="col-xl-8 col-lg-8">
                            <div className="echo-hero-baner">
                            <span className="content-catagory-tag">{category}</span>
                            <h2 className="echo-hero-title text-capitalize font-weight-bold">
                                <a href="post-details.html" className="title-hover">
                                The Asus ROG Ally will start at $600 with AMD Z1
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
                                    <i className="fa-light fa-arrow-up-from-bracket" /> 1.5k
                                    Share
                                </a>
                                </div>
                            </div>
                            <div className="echo-inner-img-ct-1  img-transition-scale">
                                <a href="post-details.html">
                                <img
                                    src="/images/category-style-1/item-11.png"
                                    alt="Echo"
                                    className="echo-post-style-3-hero-banner"
                                />
                                </a>
                            </div>
                            <p className="echo-hero-discription">
                                Mauris in aliquam sem fringilla ut morbi tincidunt augue. Odio
                                ut sem nulla pharetra diam sit amet nisl suscipit. Leo a diam
                                sollicitudin tempor id eu nisl. Praesent semper feugiat nibh sed
                                pulvinar proin. Nisi quis eleifend quam adipiscing vitae proin.
                                Odio euismod lacinia at quis risus sed vulputate odio. Penatibus
                                et magnis dis parturient montes nascetur ridiculus mus. Pulvinar
                                pellentesque habitant morbi tristique senectus et netus. Gravida
                                neque convallis a cras. Maecenas pharetra convallis posuere
                                morbi leo. Nunc id cursus metus aliquam eleifend mi in nulla
                                posuere.
                            </p>
                            <p className="echo-hero-discription">
                                Arcu dui vivamus arcu felis bibendum ut tristique et. Eu nisl
                                nunc mi ipsum faucibus vitae aliquet nec. Et ultrices neque
                                ornare aenean euismod. Ornare arcu dui vivamus arcu felis Sapien
                                nec sagittis aliquam malesuada. Tincidunt arcu non sodales neque
                                sodales ut.
                            </p>
                            <h3>Data Center Loading &amp; Security</h3>
                            <p>
                                Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue.
                                Cras ornare arcu dui vivamus arcu felis bibendum ut tristique.
                                Malesuada fames ac turpis egestas sed tempus urna et pharetra.
                                Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet.
                                Tellus id interdum velit laoreet id donec.{" "}
                            </p>
                            <p>
                                Lacinia at quis risus sed. Nisi est sit amet facilisis magna
                                etiam tempor orci eu. Sodales neque sodales ut etiam sit amet
                                nisl purus. Sed id semper risus in hendrerit gravida rutrum.
                                Faucibus purus in massa tempor nec feugiat. Accumsan tortor
                                posuere ac ut. Donec pretium vulputate sapien nec sagittis.
                            </p>
                            </div>
                            <div className="echo-financial-area">
                            <div className="content">
                                <h3 className="title">Advance Features</h3>
                                <ul className="content-wrapper first">
                                <li className="wrapper-item">
                                    Mattis nun blandit libero the sed
                                </li>
                                <li className="wrapper-item">Eget duis at tellus at urna</li>
                                <li className="wrapper-item">
                                    Tellus pellentesque eu tincidunt.
                                </li>
                                <li className="wrapper-item">
                                    Mattis nunc blandit libero sed.
                                </li>
                                <li className="wrapper-item">
                                    Tincidunt eget nullam non est sit
                                </li>
                                <li className="wrapper-item">
                                    Tortor id aliquet lectus proin
                                </li>
                                </ul>
                                <p className="desc">
                                Mauris in aliquam sem fringilla ut morbi tincidunt augue. Odio
                                ut sem nulla pharetra diam sit amet nisl suscipit. Leo a diam
                                sollicitudin tempor id eu nisl. Praesent semper feugiat nibh
                                sed pulvinar proin. Nisi quis eleifend quam adipiscing vitae
                                proin. Odio euismod lacinia at quis risus sed vulputate odio.
                                Penatibus et magnis dis parturient montes nascetur ridiculus
                                mus.
                                </p>
                                <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 pr--15 pr_sm--0 pl_sm--0">
                                    <div className="image">
                                    <img
                                        src="/images/category-style-1/item-12.png"
                                        alt="Echo"
                                        className="echo-post-style-3-2end"
                                    />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 pl--15 pl_sm--0 pr_sm--0">
                                    <div className="image">
                                    <img
                                        src="/images/category-style-1/item-13.png"
                                        alt="Echo"
                                        className="echo-post-style-3-2end"
                                    />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="image bottom">
                                    <img
                                        src="/images/category-style-1/item-14.png"
                                        alt="Echo"
                                    />
                                    </div>
                                </div>
                                </div>
                                <h3 className="title">Features &amp; configurations</h3>
                                <p className="desc">
                                Nulla facilisi nullam vehicula ipsum a arcu cursus vitae
                                congue. Cras ornare arcu dui vivamus arcu felis bibendum ut
                                tristique. Malesuada fames ac turpis egestas sed tempus urna
                                et pharetra. Nunc mi ipsum faucibus vitae aliquet nec
                                ullamcorper sit amet. Tellus id interdum velit laoreet id
                                donec. Lacinia at quis risus sed. Nisi est sit amet facilisis
                                magna etiam tempor orci eu. Sodales neque sodales ut etiam sit
                                amet nisl purus. Sed id semper risus in hendrerit gravida
                                rutrum.
                                </p>
                                <ul className="content-wrapper wrapper-2">
                                <li className="wrapper-item">
                                    350-mile range (the bar is 300 miles)
                                </li>
                                <li className="wrapper-item">
                                    Your smartphone can be your key to the vehicle
                                </li>
                                <li className="wrapper-item">
                                    Reverse charging, so your car can power your house during a
                                    power outage
                                </li>
                                <li className="wrapper-item">
                                    An impressive 0-60 time of around 3.6 seconds (I like
                                    performance)
                                </li>
                                <li className="wrapper-item">
                                    A solar panel roof to increase range and supply emergency
                                    power
                                </li>
                                <li className="wrapper-item">
                                    Convertible-like mode (which really opens the car up)
                                </li>
                                </ul>
                                <p className="desc">
                                Condimentum id venenatis a condimentum vitae. Non curabitur
                                gravida arcu ac tortor dignissim way convallis aenean et. Amet
                                est placerat in egestas erat imperdiet sed euismod nisi.
                                Lectus magna fringilla urna porttitor rhoncus dolor purus non
                                enim. Sapien eget mi proin sed libero enim sed for faucibus
                                turpis. A condimentum vitae sapien pellentesque habitant morbi
                                tristique senectus et. Risk Tincidunt eget nullam non nisi est
                                sit. Commodo viverra maecenas accumsan lacus vel facilisis.
                                </p>
                                <div className="row  align-items-center">
                                <div className="col-lg-6 col-md-6">
                                    <div className="details-tag">
                                    <h6>Tags:</h6>
                                    <button>Finance</button>
                                    <button>Economic</button>
                                    <button>Bank</button>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="details-share">
                                    <h6>Share:</h6>
                                    <button>
                                        <i className="fab fa-facebook-f" />
                                    </button>
                                    <button>
                                        <i className="fab fa-twitter" />
                                    </button>
                                    <button>
                                        <i className="fab fa-instagram" />
                                    </button>
                                    <button>
                                        <i className="fab fa-linkedin-in" />
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="echo-author-area">
                            <div className="image-area">
                                <img
                                src="/images/home-1/trending-left/lady.png"
                                alt="author"
                                />
                            </div>
                            <div className="content">
                                <h5 className="title">Alex Olimiya</h5>
                                <p className="desc">
                                I am an Example Writer. Lorem ipsum dolor sit amet,
                                consectetur adipisicing elit, sed do eiusmod tempor incididunt
                                labored et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat.
                                </p>
                            </div>
                            </div>
                            <div className="echo-more-news-area">
                            <h3 className="title">You Might Also Like</h3>
                            <div className="inner">
                                <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="echo-top-story">
                                    <div className="echo-story-picture img-transition-scale">
                                        <a href="post-details.html">
                                        <img
                                            src="/images/home-1/trending-left/item-9.png"
                                            alt="Echo"
                                            className="img-hover"
                                        />
                                        </a>
                                    </div>
                                    <div className="echo-story-text">
                                        <h6>
                                        <a href="#" className="title-hover">
                                            ChatGPT returns to Italy after ban
                                        </a>
                                        </h6>
                                        <a href="#" className="pe-none">
                                        <i className="fa-light fa-clock" /> 06 minute read
                                        </a>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="echo-top-story">
                                    <div className="echo-story-picture img-transition-scale">
                                        <a href="post-details.html">
                                        <img
                                            src="/images/home-1/trending-left/item-10.png"
                                            alt="Echo"
                                            className="img-hover"
                                        />
                                        </a>
                                    </div>
                                    <div className="echo-story-text">
                                        <h6>
                                        <a href="#" className="title-hover">
                                            Meta to wind down NFTs on platforms...
                                        </a>
                                        </h6>
                                        <a href="#" className="pe-none">
                                        <i className="fa-light fa-clock" /> 06 minute read
                                        </a>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
   
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
export default SingleArticles;