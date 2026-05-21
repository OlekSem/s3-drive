import Logo from "../ui/logo.tsx";



const Navbar = () => {
    return (
        <div
            className="flex flex-col
            justify-between
            bg-[var(--surface)]
            w-[25%] p-6 border-r-2 border-[var(--border)]
            h-screen
            ">
            <Logo />
            {/*<div*/}
            {/*    className="mt-6 flex flex-col gap-4">*/}

            {/*</div>*/}
        </div>
    );
};

export default Navbar;