import {useState, useEffect} from "react";
import {useContext} from "react";
import {article} from "../types/itemType";
import Content from "./Content";
import SearchIcon from "./SearchIcon";
import LoadingIndicator from "./LoadingIndicator";
import {ThemeContext} from "../contexts/ThemeContext";

const Search = () => {
    const {themeColor} = useContext(ThemeContext);
    const [responseData, setResponseData] = useState<article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Clears the error when searchTerm is changed
        setError("");
    }, [searchTerm]);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const trimmedTerm = searchTerm.trim();
            if (trimmedTerm.length >= 2) {
                submitSearch(trimmedTerm);
            } else {
                setError("Please enter at least 2 letters to search.");
            }
        }
    };

    const submitSearch = (searchTerm: string) => {
        setIsLoading(true);
        const apiUrl = `/api/process-input?query=${encodeURIComponent(searchTerm)}`;

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                const sortedData = data.sort((a: article, b: article) => b.similarity - a.similarity);
                setResponseData(sortedData);
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            {isLoading && <LoadingIndicator/>}
            <div className="md:flex md:justify-center">
                <div
                    className="mt-16 mx-2 text-sm
          md:text-2xl tracking-wider 
          md:w-5/6 lg:w-2/3"
                >
                    {error && (
                        <div className="ml-3.5 text-red-600 text-sm font-medium md:text-base">
                            {error}
                        </div>
                    )}
                    <div
                        className={
                            "w-full pb-1.5 rounded-[30px] " +
                            (themeColor == "light"
                                ? "bg-neutral-200"
                                : "bg-black bg-opacity-40")
                        }
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className={
                                    `flex w-full h-[6vh] md:h-[7vh] rounded-2xl ` +
                                    (themeColor == "light" ? "bg-neutral-500" : "bg-neutral-700")
                                }
                            >
                                <input
                                    className={`w-full h-[80%] ml-2.5 pl-3 
                  self-center text-lg text-slate-50 font-medium
                bg-neutral-800 bg-opacity-50 rounded-lg transition-colors duration-300 
                                    ${
                                        error
                                            ? "border-2 border-red-600 text-slate-50 bg-red-900 bg-opacity-25"
                                            : "text-slate-50 bg-neutral-800 bg-opacity-50"
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch} // Handle Enter key press
                                    placeholder="Search..."
                                />
                                <button
                                    onClick={() =>
                                        searchTerm.trim().length >= 2
                                            ? submitSearch(searchTerm.trim())
                                            : setError("Please enter at least 2 letters to search.")
                                    }
                                    className="px-3 md:px-5 text-base md:text-lg
                font-semibold rounded-r-2xl transition-colors 
                duration-300 active:bg-amber-200/10"
                                >
                                    <SearchIcon/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Content items={responseData}/>
        </>
    );
};

export default Search;
