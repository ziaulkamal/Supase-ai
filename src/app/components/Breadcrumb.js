

const Breadcrumb = ({title, category, slug}) => {
    return(
        <div className="echo-breadcrumb-area">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    {/* bread crumb inner wrapper */}
                    <div className="breadcrumb-inner text-center">
                    <div className="meta">
                        <a href="#" className="prev">
                        {category} /
                        </a>
                        <a href="#" className="next">
                        {slug}
                        </a>
                    </div>
                    </div>
                    {/* bread crumb inner wrapper end */}
                </div>
                </div>
            </div>
        </div>
    );
}

export default Breadcrumb;