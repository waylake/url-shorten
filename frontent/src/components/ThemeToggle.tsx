import React, { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
