import {Link, useLocation} from "react-router-dom";

const UploadButton = () => {

    const location = useLocation();

    return (
        <div>
            <button className={`
            h-10 rounded-lg text-lg p-2.5 bg-[var(--button-bg)]
            flex items-center text-lg text-[var(--button-text)]
            px-5 hover:scale-105 transition hover:cursor-pointer
            
            `}
            >
                {/*<a href={"/upload"}>Upload</a>*/}
                <Link to={{ pathname: "/upload", search: location.search }}>
                    Upload
                </Link>
            </button>
        </div>
    );
};

export default UploadButton;