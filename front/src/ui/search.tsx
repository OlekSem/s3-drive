

const Search = () => {
    return (
        <div>
            <input
                className=" h-10 rounded-lg text-lg p-2.5 pl-5
                 border-1 bg-[var(--search)] border-[var(--border)]
                  outline-none focus:outline-none
                   text-[var(--placeholder)]
            "
                placeholder="Пошук..."/>
        </div>
    );
};

export default Search;