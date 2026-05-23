import {useLocation} from "react-router-dom";


const FinderSpace = () => {
    const location = useLocation();
    return (
        <div
            className="p-4"
        >
            {location.pathname}
        </div>
    );
};

export default FinderSpace;