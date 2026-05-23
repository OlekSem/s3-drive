import { Outlet } from "react-router-dom";
import Header from "../components/Header.tsx";
import Navbar from "../components/Navbar.tsx";

const MainLayout = () => {
    return (
        // min-h-screen anchors the container theme down to the bottom of the monitor viewport
        <div className="w-full min-h-screen bg-[var(--bg)] flex flex-row overflow-x-hidden">

            {/* Left Column: Fixed Sidebar Navigation */}
            <Navbar />

            {/* Right Column: Dynamic Application Window Container */}
            {/* flex-1 handles calculating the correct width size alongside the Navbar width automatically */}
            <div className="flex flex-col flex-1 min-w-0">

                {/* Header now correctly consumes 100% of the dynamic right column window size */}
                <Header />

                {/* Main route layout component injected securely below the navigation bar header */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;