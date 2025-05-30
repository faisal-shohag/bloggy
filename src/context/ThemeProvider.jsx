import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const themes = [
    { title: "Light", themeName: "light" },
    { title: "Dark", themeName: "dark" },
    { title: "Caupcake", themeName: "caupcake" },
    { title: "Bumblebee", themeName: "bumblebee" },
    { title: "Emerald", themeName: "emerald" },
    { title: "Corporate", themeName: "corporate" },
    { title: "Synthwave", themeName: "synthwave" },
    { title: "Retro", themeName: "retro" },
    { title: "Cyberpunk", themeName: "cyberpunk" },
    { title: "Valentine", themeName: "valentine" },
    { title: "Halloween", themeName: "halloween" },
    { title: "Garden", themeName: "garden" },
    { title: "Forest", themeName: "forest" },
    { title: "Aqua", themeName: "aqua" },
    { title: "Lofi", themeName: "lofi" },
    { title: "Pastel", themeName: "pastel" },
    { title: "Fantasy", themeName: "fantasy" },
    { title: "Wireframe", themeName: "wireframe" },
    { title: "Black", themeName: "black" },
    { title: "Luxury", themeName: "luxury" },
    { title: "Dracula", themeName: "dracula" },
    { title: "CMYK", themeName: "cmyk" },
    { title: "Autumn", themeName: "autumn" },
    { title: "Business", themeName: "business" },
    { title: "Acid", themeName: "acid" },
    { title: "Lemonade", themeName: "lemonade" },
    { title: "Night", themeName: "night" },
    { title: "Coffee", themeName: "coffee" },
    { title: "Winter", themeName: "winter" },
    { title: "Dim", themeName: "dim" },
    { title: "Nord", themeName: "nord" },
    { title: "Sunset", themeName: "sunset" },
    { title: "Caramellatte", themeName: "caramellatte" },
    { title: "Abyss", themeName: "abyss" },
    { title: "Silk", themeName: "silk" },
  ];

  const handleTheme = (themeName) => {
    localStorage.setItem("theme", themeName);
    setTheme(themeName);
  };
  const themeData = {
    theme,
    handleTheme,
    themes,
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    } else {
      setTheme(theme);
    }
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return <ThemeContext value={themeData}>{children}</ThemeContext>;
}
