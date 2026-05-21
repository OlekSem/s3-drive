import Search from "../ui/search.tsx";
import UploadButton from "../ui/uploadButton.tsx";
import Avatar from "../ui/avatar.tsx";
import ThemeSwitch from "../ui/themeSwitch.tsx";


const Header = () => {
    return (
        <div className="
         bg-[var(--surface)] w-[75%]
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