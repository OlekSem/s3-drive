import { IoMdMoon } from "react-icons/io";
import { useTheme } from "../hooks/useTheme.ts";
import { MdSunny } from "react-icons/md";

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            <div
                className="rounded-md hover:cursor-pointer mr-2 bg-[var(--search)] border-[var(--border)] border-1 p-2.5 flex items-center justify-center"
                onClick={toggleTheme}
            >
                {theme === "light" ? (
                    <IoMdMoon className="w-5 h-5 text-slate-700" />
                ) : (
                    <MdSunny className="w-5 h-5 text-yellow-400" />
                )}
            </div>
        </div>
    );
}