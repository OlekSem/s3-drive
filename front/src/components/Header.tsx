import {Link, useNavigate} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import APP_ENV from "../env";
import { logout } from "../services/authSlice.ts";
import { useState } from "react";


export default function Header() {
    const user = useAppSelector(redux => redux.auth.user);
    const isAdmin = useAppSelector(redux => redux.auth.isAdmin);
    console.log(isAdmin + "---- is admin");

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        appDispatch(logout());
        // appDispatch(appApi.util.resetApiState());
        navigate("/");
    };

    return (
        <header className="bg-blue-600 text-white">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo / Brand */}

                <div className="hidden md:flex items-center gap-4 ">
                    <div className="text-xl font-bold">
                        <Link to="/" className="hover:underline">Home</Link>
                    </div>
                    {
                        user &&
                        <div className="text-xl font-bold">
                            <Link to="/library" className="hover:underline">My Library</Link>
                        </div>
                    }

                    {
                        isAdmin &&
                        <div className="text-xl font-bold">
                            <Link to="/add" className="hover:underline">Add a book</Link>
                        </div>
                    }

                    {/*<div className="text-xl font-bold">*/}
                    {/*    <Link to="/transportations" className="hover:underline">Transportations</Link>*/}
                    {/*</div>*/}
                </div>

                {user &&
                    <div className="flex md:hidden items-center gap-4 min-w-1/2">
                        <Link to="/Profile" className="flex items-center gap-2 hover:underline">
                            <img
                                src={`${APP_ENV.API_BASE_URL}/small/${user.image || "default.png"}`}
                                alt="avatar"
                                className="rounded-full w-8 h-8"
                            />
                            <span>{`${user.username}`}</span>
                        </Link>
                    </div>
                }

                {
                    !user &&
                    <div className="flex md:hidden items-center gap-4 min-w-1/2 text-xl">
                        <Link to="/register" className="hover:underline">Register</Link>
                        <Link to="/login" className="hover:underline">Log in</Link>
                    </div>
                }



                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">

                    {user && isAdmin && (
                        <Link to="/admin" className="hover:underline">Admin Menu</Link>
                    )}
                    {user ? (
                        <>
                            <Link to="/Profile" className="flex items-center gap-2 hover:underline">
                                <img
                                    src={`${APP_ENV.API_BASE_URL}/small/${user.image || "default.png"}`}
                                    alt="avatar"
                                    className="rounded-full w-8 h-8"
                                />
                                <span>{`${user.username}`}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hover:underline">Register</Link>
                            <Link to="/login" className="hover:underline">Log in</Link>
                        </>
                    )}
                </div>
                <div className={"md:hidden flex items-center gap-4"}>
                    {/* Mobile Menu Button */}
                    <button
                        className=" flex items-center focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (

                <div className="md:hidden bg-blue-600 space-y-2 pb-2">
                    <hr/>
                    <ul className="flex flex-col space-y-2 w-full mt-2">
                        <li className={"w-full"}>
                            <Link
                                to="/transportations"
                                className="block py-2 rounded hover:bg-blue-700 transition w-full px-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Transportations
                            </Link>
                        </li>
                        <li className={"w-full "}>
                            <Link
                                to="/"
                                className="block py-2 rounded hover:bg-blue-700 transition px-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li className={"w-full"}>
                            <Link
                                to="/cities"
                                className="block px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Cities
                            </Link>
                        </li>
                        {user && isAdmin && (
                            <li>
                                <Link
                                    to="/admin"
                                    className="block px-3 py-2 rounded hover:bg-blue-700 transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Admin Menu
                                </Link>
                            </li>
                        )}
                    </ul>


                    {user && (
                        <>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full px-4 py-2 bg-red-700 rounded-xl hover:bg-red-800 mx-4"
                            >
                                Log out
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>


    );
}