

const NotFound = () => {
    return(
        <div className="echo-404-page">
            <section className="echo-404-area">
                <div className="echo-container">
                    <div className="echo-error-content">
                    <div className="echo-error">
                        <div className="echo-error-heading">
                        <h1>404</h1>
                        </div>
                        <div className="echo-error-sub-heading">
                        <h3>page not found</h3>
                        </div>
                        <div className="echo-error-pera">
                        <p>
                            Sorry, the page you seems looking for,
                            <br /> has been moved, redirected or moved permanently.
                        </p>
                        </div>
                        <div className="error-btn">
                        <a href="index.html" className="text-capitalize">
                            go back home
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NotFound;