import Logo from "../ui/Logo.tsx";
import React from "react";

export type NodeType = 'FILE' | 'FOLDER';

const Navbar = () => {





    return (
        <div
            className="flex flex-col
            justify-top
            bg-[var(--surface)]
            w-64 flex-shrink-0 p-6 border-r-2 border-[var(--border)]
            h-screen sticky top-0
            "
        >
            <Logo />
            {/*<div className="mt-6 flex flex-col gap-4"></div>*/}
            {/*<div className="my-4 w-full px-2">*/}
            {/*    /!* SIDEBAR NAVIGATION *!/*/}
            {/*    <aside className={`w-[200px] p-4 border-r flex flex-col gap-4 select-none ${colors.sidebar}`}>*/}
            {/*    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 ${colors.textMuted}`}>*/}
            {/*        Locations*/}
            {/*    </span>*/}
            {/*        <nav className="flex flex-col gap-1">*/}
            {/*            <button*/}
            {/*                // onClick={() => { setCurrentView('DRIVE'); setCurrentFolderId(null); setSelectedFile(null); }}*/}
            {/*                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors duration-150 ${*/}
            {/*                    currentView === 'DRIVE' && currentFolderId === null*/}
            {/*                        ? 'bg-blue-600 text-white shadow-sm'*/}
            {/*                        : `hover:text-current ${colors.textLabel} ${colors.itemHover}`*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <HardDrive size={16} className={currentView === 'DRIVE' && currentFolderId === null ? 'text-white' : 'text-blue-500'} />*/}
            {/*                My Drive*/}
            {/*            </button>*/}
            {/*            <button*/}
            {/*                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors duration-150 ${*/}
            {/*                    currentView === 'TRASH'*/}
            {/*                        ? 'bg-red-600 text-white shadow-sm'*/}
            {/*                        : `hover:text-current ${colors.textLabel} ${colors.itemHover}`*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <Trash2 size={16} className={currentView === 'TRASH' ? 'text-white' : 'text-red-500'} />*/}
            {/*                Trash Bin*/}
            {/*            </button>*/}
            {/*        </nav>*/}
            {/*    </aside>*/}
            {/*</div>*/}


        </div>
    );
};

export default Navbar;