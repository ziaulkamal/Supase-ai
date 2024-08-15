

const Breadcrumb = () => {
    return(
        <div className="echo-breadcrumb-area">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    {/* bread crumb inner wrapper */}
                    <div className="breadcrumb-inner text-center">
                    <div className="meta">
                        <a href="#" className="prev">
                        ECHO /
                        </a>
                        <a href="#" className="next">
                        Single News
                        </a>
                    </div>
                    <h1 className="title">Standard Style 02</h1>
                    </div>
                    {/* bread crumb inner wrapper end */}
                </div>
                </div>
            </div>
        </div>
    );
}

export default Breadcrumb;