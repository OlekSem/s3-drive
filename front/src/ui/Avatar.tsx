import { CgProfile } from "react-icons/cg";
import { useTheme } from "../hooks/useTheme.ts";
import { useEffect, useRef, useState } from "react";
import useModal from "../hooks/useModal.ts";
import RegisterModalWindow from "./RegisterModalWindow.tsx";
import LoginModalWindow from "./LoginModalWindow.tsx";
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts";
import { logout } from "../store/reducers/AuthSlice.ts";
import API_ENV from "../env";

const Avatar = () => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.authReducer.user);

    const registerModal = useModal();
    const loginModal = useModal();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Базовий контейнер один для всіх випадків */}
            <div
                onClick={() => setOpen(!open)}
                className="
                    rounded-full
                    bg-[var(--avatar-bg)]
                    w-10 h-10
                    flex items-center justify-center
                    hover:cursor-pointer
                    transition hover:brightness-110
                    overflow-hidden
                "
            >
                {/* Змінюється тільки те, що всередині круглого контейнера */}
                {user?.image ? (
                    <img
                        src={`${API_ENV.API_BASE_URL}/small/${user.image}`}
                        alt={user.username || "logo"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <CgProfile
                        className="w-8 h-8"
                        color={theme === "light" ? "white" : "black"}
                    />
                )}
            </div>

            {/* Випадаюче меню */}
            {open && (
                <div
                    className="
                        absolute top-12 right-0
                        w-52 rounded-xl shadow-lg
                        bg-[var(--avatar-menu)]
                        border border-[var(--border-color)]
                        p-2 z-50
                    "
                >
                    {user ? (
                        <>
                            <div className="px-3 py-1.5 text-xs text-gray-400 dark:text-zinc-500 border-b border-[var(--border-color)] dark:border-zinc-800 mb-1 truncate">
                                {user.username}
                            </div>
                            <button
                                className="w-full text-left px-3 py-2 text-xs rounded-lg text-red-500 dark:text-red-400 font-medium hover:bg-red-500/10 dark:hover:bg-red-500/20 transition hover:cursor-pointer"
                                onClick={handleLogout}
                            >
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-zinc-200 rounded-lg hover:bg-[var(--hover-bg)] dark:hover:bg-[#25252e] transition hover:cursor-pointer"
                                onClick={() => {
                                    loginModal.openModal();
                                    setOpen(false);
                                }}
                            >
                                Log in
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-zinc-200 rounded-lg hover:bg-[var(--hover-bg)] dark:hover:bg-[#25252e] transition hover:cursor-pointer"
                                onClick={() => {
                                    registerModal.openModal();
                                    setOpen(false);
                                }}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            )}
            <RegisterModalWindow isOpen={registerModal.isOpen} closeModal={registerModal.closeModal} />
            <LoginModalWindow isOpen={loginModal.isOpen} closeModal={loginModal.closeModal} />
        </div>
    );
};

export default Avatar;