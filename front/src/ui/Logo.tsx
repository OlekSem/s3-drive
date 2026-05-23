

const Logo = () => {
    return (
        <div className="flex flex-row items-center gap-2 hover:cursor-pointer ">
            <div
                className="bg-[var(--logo-text)] w-9 h-9
                 flex items-center justify-center
                 rounded-[7px] text-xl text-[var(--logo)] font-semibold
                 "

            >
                S3
            </div>
            <div
                className="
                text-xl font-bold text-[var(--logo-text)]
            ">
                s3drive
            </div>
        </div>
    );
};

export default Logo;