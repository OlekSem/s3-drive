import {CgProfile} from "react-icons/cg";
import {useTheme} from "../hooks/useTheme.ts";
import {useEffect, useRef, useState} from "react";
import useModal from "../hooks/useModal.ts";
import RegisterModalWindow from "./RegisterModalWindow.tsx";
import LoginModalWindow from "./LoginModalWindow.tsx";



const Avatar = () => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const registerModal= useModal();
    const loginModal= useModal();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }

        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);
    return (
        <div className="relative" ref={menuRef}>
            <div
                onClick={() => setOpen(!open)}
                className="
                    rounded-full
                    bg-[var(--avatar-bg)]
                    w-10 h-10
                    flex items-center justify-center
                    hover:cursor-pointer
                    transition hover:brightness-110
                "
            >
                <CgProfile
                    className="w-8 h-8"
                    color={theme === "light" ? "white" : "black"}
                />
            </div>
            {open && (
                <div
                    className="
                        absolute top-12 right-0
                        w-48 rounded-xl shadow-lg
                        bg-[var(--avatar-menu)]
                        border border-[var(--border-color)]
                        p-2 z-50
                    "
                >

                    <button
                        className="
                            w-full text-left
                            px-3 py-2 rounded-lg
                            hover:bg-[var(--hover-bg)]
                            transition
                            hover:cursor-pointer
                        "
                        onClick={() => loginModal.openModal()}
                    >
                        Log in
                    </button>
                    <button
                        className="
                            w-full text-left
                            px-3 py-2 rounded-lg
                            hover:bg-[var(--hover-bg)]
                            transition
                            hover:cursor-pointer
                        "
                        onClick={() => registerModal.openModal()}
                    >
                        Sing up
                    </button>
                    <button
                        className="
                            w-full text-left
                            px-3 py-2 rounded-lg
                            hover:bg-[var(--hover-bg)]
                            transition
                            hover:cursor-pointer
                        "

                    >
                       Google
                    </button>

                    {/*<button*/}
                    {/*    className="*/}
                    {/*        w-full text-left*/}
                    {/*        px-3 py-2 rounded-lg*/}
                    {/*        hover:bg-red-500/10*/}
                    {/*        text-red-500*/}
                    {/*        transition*/}
                    {/*        hover:cursor-pointer*/}
                    {/*    "*/}
                    {/*>*/}
                    {/*    Вийти*/}
                    {/*</button>*/}
                </div>
            )}
            <RegisterModalWindow isOpen={registerModal.isOpen} closeModal={registerModal.closeModal} />
            <LoginModalWindow isOpen={loginModal.isOpen} closeModal={loginModal.closeModal} />
        </div>

    );
};

export default Avatar;