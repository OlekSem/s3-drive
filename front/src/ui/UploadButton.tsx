


const UploadButton = () => {

    return (
        <div>
            <button className={`
            h-10 rounded-lg text-lg p-2.5 bg-[var(--button-bg)]
            flex items-center text-lg text-[var(--button-text)]
            px-5 hover:scale-105 transition hover:cursor-pointer
            
            `}
            >
                Upload</button>
        </div>
    );
};

export default UploadButton;