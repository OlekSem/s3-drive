import Avatar from "../ui/Avatar.tsx";
import ThemeSwitch from "../ui/ThemeSwitch.tsx";
import Search from "../ui/Search";
import UploadButton from "../ui/UploadButton";



const Header = () => {

    return (
        <div className="
         bg-[var(--surface)] w-[100%]
         flex flex-row items-center gap-4
         p-6 h-21 justify-end border-b-2
         border-[var(--border)]
         ">
            <ThemeSwitch />
            <Search />
            <UploadButton />
            <Avatar />
        </div>
    );
};

export default Header;