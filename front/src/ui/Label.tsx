import type {ReactNode} from "react";
import {useLocation, useNavigate} from "react-router-dom";


const Label = ({title, icon}: { title: string; icon: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.pathname)
    return (
        <button
            className={`flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg bg-[var(--label)]
              text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900
              data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900
              data-[active=true]:font-medium transition-colors hover:cursor-pointer
              ${location.pathname === "/" + title.replaceAll(" ", "")
                && "bg-gray-100 text-gray-900 border border-gray-300 rounded-md" }
              `}
                onClick={()=>{
                    navigate(title.replaceAll(" ", ""));
                }}
        >
            {icon}

            {title}
        </button>
    );
};

export default Label;