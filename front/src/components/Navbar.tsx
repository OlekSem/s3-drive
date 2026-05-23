import Logo from "../ui/Logo.tsx";
import {LuFileStack} from "react-icons/lu";
import Label from "../ui/Label.tsx";
import {FaTrashCan} from "react-icons/fa6";
import {FaFolderMinus, FaRegFileImage} from "react-icons/fa";
import {IoDocument} from "react-icons/io5";



const Navbar = () => {
    return (
        <div
            className="flex flex-col
            justify-start
            bg-[var(--surface)]
            w-[25%] p-6 border-r-2 border-[var(--border)]
            h-screen
            ">
            <Logo />
            <div
                className="mt-10 flex flex-col gap-4">
                <Label title={"All files"} icon={<LuFileStack />} />
                <Label title={"Bin"} icon={<FaTrashCan />} />
            </div>
            <div
                className="mt-10 flex flex-col gap-4">
                <Label title={"Images"} icon={<FaRegFileImage />} />
                <Label title={"Documents"} icon={<IoDocument />} />
                <Label title={"Folders"} icon={<FaFolderMinus />} />
            </div>

        </div>
    );
};

export default Navbar;