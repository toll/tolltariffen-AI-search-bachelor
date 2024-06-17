import React, {Dispatch, SetStateAction, useContext} from "react";
import ChangeThemeButton from "./ChangeThemeButton";
import {ThemeContext} from "../contexts/ThemeContext";

interface TabsProps {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

const Tabs: React.FC<TabsProps> = ({activeTab, setActiveTab}) => {
    const {themeColor} = useContext(ThemeContext);
    return (
        <div className="lg:flex lg:justify-center">
            <div
                className={`flex gap-5 md:mt-12 lg:pl-8 font-semibold tracking-wide lg:justify-start justify-center lg:w-2/3 ${themeColor === "light" ? "text-black" : "text-slate-100"}`}
            >
                <button onClick={() => setActiveTab('search')}
                        className={`text-[14px] md:text-lg ${activeTab === 'search' ? 'underline' : ''}`}>
                    Search
                </button>
                <button onClick={() => setActiveTab('chat')}
                        className={`text-[14px] md:text-lg ${activeTab === 'chat' ? 'underline' : ''}`}>
                    Chat
                </button>
                <ChangeThemeButton/>
            </div>
        </div>
    );
};

export default Tabs;
