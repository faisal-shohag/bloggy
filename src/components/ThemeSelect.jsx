import React, { use } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { IoMdColorPalette } from "react-icons/io";

const ThemeSelect = () => {
    const { theme, themes, handleTheme } = use(ThemeContext)

  return (
    <>
    <div className="dropdown dropdown-end  ">
    <div tabIndex={0} role="button" className="btn rounded-field">
    <IoMdColorPalette /> {themes.find(th=> th.themeName == theme).title}</div>
    <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-1 mt-0 w-52 p-2 shadow-sm">
     {
        themes.map((th, index) =>  <li className={`${theme === th.themeName ? 'bg-primary-content text-secondary rounded-field' : ''}`} onClick={() => handleTheme(th.themeName)} key={index}><a>{th.title}</a></li>)
     }
    </ul>
      </div>
    </>
  );
};

export default ThemeSelect;
