import Header from "./components/Header.tsx";
import {Outlet, Route, Routes} from "react-router-dom";
import {useAppSelector} from "./store";
import './main.css'
import Register from "./pages/Users/Register.tsx";
import LogIn from "./pages/Users/LogIn.tsx";
import Home from "./pages/Home.tsx";


const MainLayout = () => {
    return (
        <div className="min-h-screen">
            <Header />

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default function App() {
    const user =
        useAppSelector(redux => redux.auth.user);

    console.log("User roles", user?.roles);
    return (
        // <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<MainLayout/>}>
                <Route index element={<Home/>}/>

                <Route path={"register"} element={<Register/>}/>
                <Route path={"login"} element={<LogIn/>}/>

            </Route>

            {/* Auth Layout */}



            {/* Fallback Route */}
        </Routes>
        // </BrowserRouter>

    );
}
