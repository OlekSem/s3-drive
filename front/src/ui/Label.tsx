import type {ReactNode} from "react";


const Label = ({title, icon}: { title: string; icon: ReactNode }) => {
    return (
        <button
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg bg-[var(--label)]
              text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900
              data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900
              data-[active=true]:font-medium transition-colors hover:cursor-pointer">
            {icon}

            {title}
        </button>
    );
};

export default Label;