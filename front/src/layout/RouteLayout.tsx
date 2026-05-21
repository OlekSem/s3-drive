import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./MainLayout.tsx";
import Home from "../pages/Home.tsx";

export const RouteLayout = () => {
    // const pages = [
    //     // { path: "/cities", element: <Cities /> },
    //
    // ] as const;

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainLayout/>}>
                    <Route index element={<Home />} />
                    {/*{pages.map((page) => (*/}
                    {/*    <Route*/}
                    {/*        key={page.path}*/}
                    {/*        path={page.path}*/}
                    {/*        element={page.element}*/}
                    {/*    />*/}
                    {/*))}*/}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};