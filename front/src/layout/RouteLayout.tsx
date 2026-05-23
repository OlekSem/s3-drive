import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./MainLayout.tsx";
import Home from "../pages/Home.tsx";
import Bin from "../pages/Bin.tsx";
import AllFiles from "../pages/AllFiles.tsx";
import Images from "../pages/Images.tsx";
import Documents from "../pages/Documents.tsx";
import Folders from "../pages/Folders.tsx";

export const RouteLayout = () => {
    const pages = [
        { path: "/Bin", element: <Bin /> },
        { path: "/AllFiles", element: <AllFiles /> },
        { path: "/Images", element: <Images /> },
        { path: "/Documents", element: <Documents /> },
        { path: "/Folders", element: <Folders /> },
    ] as const;

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout/>}>
                    <Route index element={<Home />} />
                    {pages.map((page) => (
                        <Route
                            key={page.path}
                            path={page.path}
                            element={page.element}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};