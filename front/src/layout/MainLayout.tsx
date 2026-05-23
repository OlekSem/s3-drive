
import {Outlet} from "react-router-dom";

import Navbar from "../components/Navbar.tsx";

import Header from "../components/Header.tsx";


const MainLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden">

            <Navbar />


            <div className="flex flex-col flex-1 ">
                <Header />

                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;