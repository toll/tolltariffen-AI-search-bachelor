import { useState } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import MainSearchPage from "./pages/MainSearchPage";
import "./styles.css";

const App = () => {
  const [themeColor, setThemeColor] = useState("dark");
  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      <MainSearchPage />
    </ThemeContext.Provider>
  );
};

export default App;
