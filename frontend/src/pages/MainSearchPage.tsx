import {useContext, useState} from "react";
import InfoModal from "../components/InfoModal";
import Search from "../components/Search";
import Chat from "../components/Chat";
import Tabs from "../components/Tabs";
import {ThemeContext} from "../contexts/ThemeContext";

const MainSearchPage = () => {
  const {themeColor} = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="h-full px-4 md:px-28">
      <div>
        <h1
          className={`text-center pt-16 text-3xl lg:text-[33px] font-bold tracking-wider font-roboto ${
            themeColor === "light" ? "text-black" : "text-yellow-200"
          }`}
        >
          AI-Klassifisering
        </h1>
        <h1
          className={`text-center mt-1 text-[14px]/[20px] font-roboto ${
            themeColor === "light" ? "text-black" : "text-yellow-200"
          }`}
        >
          Bachelorprosjekt
        </h1>
        <InfoModal />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "search" ? <Search /> : <Chat />}
      </div>
    </div>
  );
};

export default MainSearchPage;
