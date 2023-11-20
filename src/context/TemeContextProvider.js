import { createContext, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleMode: () => {},
});

function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme" || "light"),
  );

  const toggleMode = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    window.localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;
