import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./MainLayout.tsx";
import Home from "../pages/Home.tsx";
import Upload from "../pages/Upload.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

import Folder from "../pages/Folder.tsx";
import Trash from "../pages/Trash.tsx";

export const RouteLayout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />

                    {/* Protected Routes Block */}
                    <Route element={<ProtectedRoute redirectPath="/" />}>
                        <Route path="/folder" element={<Folder />} />
                        <Route path="/trash" element={<Trash />} />
                        <Route path='upload' element={<Upload />} />
                        {/* You can drop any other private routes here easily */}
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
};