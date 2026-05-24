import Logo from "../ui/Logo.tsx";

import { NavLink } from "react-router-dom";
import { HardDrive, Trash2 } from "lucide-react"; // Імпортуємо гарні іконки

export type NodeType = 'FILE' | 'FOLDER';

const Navbar = () => {
    // Спільні базові стилі для кнопок навігації
    const navLinkClass = ({ isActive }: { isActive: boolean }) => {
        const base = "flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 select-none";

        if (isActive) {
            // Стилі для активного стану (плавний фон та яскравіший текст)
            return `${base} bg-blue-500/10 text-blue-500 shadow-sm border border-blue-500/20`;
        }

        // Стилі для звичайного стану (з ховером)
        return `${base} text-[var(--text-muted,gray)] hover:bg-[var(--border)] hover:text-current`;
    };

    return (
        <div
            className="flex flex-col
            justify-top
            bg-[var(--surface)]
            w-44 flex-shrink-0 px-4 py-6 border-r-2 border-[var(--border)]
            h-100% sticky top-0
            "
        >
            <Logo />

            {/* Блок навігації */}
            <div className="mt-8 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-4 mb-2 text-gray-400 opacity-80">
                    Locations
                </span>

                {/* Посилання на Головний диск (root) */}
                <NavLink
                    to="/folder"
                    className={navLinkClass}
                    // end гарантує, що підсвітка буде працювати правильно,
                    // якщо ти переходиш на інші чіткі роути
                >
                    {({ isActive }) => (
                        <>
                            <HardDrive size={18} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                            <span>My Drive</span>
                        </>
                    )}
                </NavLink>

                {/* Посилання на Смітник */}
                <NavLink
                    to="/trash"
                    className={navLinkClass}
                >
                    {({ isActive }) => (
                        <>
                            <Trash2 size={18} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                            <span>Trash Bin</span>
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;