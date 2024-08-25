
import Link from 'next/link';
const Breadcrumb = ({title, category, slug}) => {
    return(
        <div className="echo-breadcrumb-area">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    {/* bread crumb inner wrapper */}
                    <div className="breadcrumb-inner text-center">
                    <div className="meta">
                        <Link href="#" className="prev">
                        {category} /
                        </Link>
                        <Link href="#" className="next">
                        {slug}
                        </Link>
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