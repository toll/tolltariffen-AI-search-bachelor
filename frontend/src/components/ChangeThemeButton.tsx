import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import setBodyColor from "../util/setBodyColor";

const ChangeThemeButton = () => {
  const { themeColor, setThemeColor } = useContext(ThemeContext);

  const toggleTheme = () => {
    if (themeColor == "dark") {
      setThemeColor("light");
      setBodyColor("rgb(233, 230, 230)");
    } else {
      setThemeColor("dark");
      setBodyColor("rgb(32, 32, 34)");
    }
  };

  return (
    <button onClick={toggleTheme}>
      {themeColor == "light" ? (
        <svg
          className="h-6 w-6 mb-0.5 text-blue-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 mb-0.5 text-yellow-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default ChangeThemeButton;
