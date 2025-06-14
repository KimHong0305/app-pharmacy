import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumb = ({ paths }) => {
    return (
        <div className="text-xs text-gray-600 mb-4 flex items-center flex-wrap gap-1">
            {paths.map((path, index) => (
                <span key={index} className="flex items-center gap-1">
                    {index !== 0 && <IoIosArrowForward className="text-gray-400" />}
                    {path.to ? (
                        <Link to={path.to} className="hover:text-gray-900 text-gray-600">
                            {path.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{path.label}</span>
                    )}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
