
import Link from 'next/link';
const Popup = () => {
    return(
        <div className="echo-popup-model" id="id01">
            <div className="echo-popup-transition">
                <div className="model-content animate-subscribe-popup">
                <Link
                    href="#!"
                    onclick="document.getElementById('id01').style.display='none'"
                >
                    <i className="fa-regular fa-xmark" />
                </Link>
                <div className="echo-p-flexing">
                    <div className="echo-p-img">
                    <img
                        src="/images/home-1/feature-right/news-item-1.png"
                        alt="Echo"
                    />
                    </div>
                    <div className="form">
                    <div className="echo-p-sub-heading">
                        <p>Weekly Updates</p>
                    </div>
                    <div className="echo-p-sub-heading">
                        <h3>Let's join our newsletter!</h3>
                    </div>
                    <form method="POST">
                        <input type="email" required="" placeholder="Enter Your Email.." />
                        <button type="submit">Submit</button>
                    </form>
                    <div className="echo-bottom-popup">
                        <p>Do not worry we don't spam!</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Popup;