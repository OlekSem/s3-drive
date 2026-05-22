
import {Outlet} from "react-router-dom";
import Header from "../components/header.tsx";
import Navbar from "../components/Navbar.tsx";


const MainLayout = () => {
    return (
        <div className="w-full h-full bg-[var(--bg)] ">
            <div className="flex flex-row">
                <Navbar />
                <Header />
            </div>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;