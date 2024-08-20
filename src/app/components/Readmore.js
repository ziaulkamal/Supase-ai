
const Readmore = () => {
    return(
        <>
                                <div className="echo-more-news-area">
                        <h3 className="title">You Might Also Like</h3>
                        <div className="inner">
                            <div className="row">
                            <div className="col-lg-6">
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
                            <div className="col-lg-6">
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
                        <div className="echo-reply-area">
                        <h5 className="title">Comment</h5>
                        <ul className="comment-inner">
                            <li className="wrapper">
                            <div className="image-area">
                                <img
                                src="/images/home-1/trending-left/commentator-1.png"
                                alt="author"
                                />
                            </div>
                            <div className="content">
                                <h5 className="title">Esther Howard</h5>
                                <a href="#" className="pe-none">
                                2 Jul 2023
                                </a>
                                <p className="desc">
                                Efficiently simplify alternative customer service rather
                                than efficient "outside the box" thinking. Dramatically
                                deploy an expanded array of manufactured.
                                </p>
                            </div>
                            <div className="reply">
                                <i className="fa-regular fa-share" /> Reply
                            </div>
                            </li>
                            <li className="wrapper">
                            <div className="image-area">
                                <img
                                src="/images/home-1/trending-left/commentator-2.png"
                                alt="author"
                                />
                            </div>
                            <div className="content">
                                <h5 className="title">Esther Howard</h5>
                                <a href="#" className="pe-none">
                                2 Jul 2023
                                </a>
                                <p className="desc">
                                Efficiently simplify alternative customer service rather
                                than efficient "outside the box" thinking. Dramatically
                                deploy an expanded array of manufactured.
                                </p>
                            </div>
                            <div className="reply">
                                <i className="fa-regular fa-share" /> Reply
                            </div>
                            </li>
                        </ul>
                        </div>
                        <div className="echo-comment-box">
                        <div className="comment-box-inner">
                            <h5 className="title">Leave A Comment</h5>
                            <form action="#">
                            <div className="row">
                                <div className="col-lg-6">
                                <input type="text" placeholder="Full Name" required="" />
                                </div>
                                <div className="col-lg-6">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required=""
                                />
                                </div>
                                <div className="col-lg-12">
                                <textarea
                                    name="text"
                                    placeholder="Write Your Comment Here"
                                    defaultValue={""}
                                />
                                </div>
                                <div className="col-12">
                                <button type="submit" className="submit-btn">
                                    Submit Now
                                </button>
                                </div>
                            </div>
                            </form>
                        </div>
                        </div>
                    </>
    )
}

export default Readmore;