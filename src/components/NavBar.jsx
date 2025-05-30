import { use } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../context/AuthContext";
import ThemeSelect from "./ThemeSelect";

const NavBar = () => {
  const { user, logout } = use(AuthContext);
  return (
    <nav className="navbar bg-base-100 shadow-lg border-b border-b-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost md:hidden lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink to={"/"}>Home</NavLink>
            </li>
             <li>
              <NavLink to={"/blogs/create-blog"}>Create</NavLink>
            </li>
         
            { !user &&
              <>
                <li>
                  <NavLink to={"/login"}>Login</NavLink>
                </li>
                <li>
                  <NavLink to={"/register"}>Register</NavLink>
                </li>
              </>
            }
            <li>
              <NavLink to={"/profile"}>Profile</NavLink>
            </li>
          </ul>
        </div>
        <Link to={'/'} className="btn btn-ghost text-xl">Bloggy</Link>
      </div>
      <div className="navbar-center hidden md:flex lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-5">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>
            <li>
              <NavLink to={"/blogs/create-blog"}>Create</NavLink>
            </li>
        
          { !user &&
              <>
                <li>
                  <NavLink to={"/login"}>Login</NavLink>
                </li>
                <li>
                  <NavLink to={"/register"}>Register</NavLink>
                </li>
              </>
            }
          <li>
            <NavLink to={"/profile"}>Profile</NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        {user && (
          <>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img
                className="h-8 w-8"
                  src={
                    user.photoURL ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <button onClick={logout} className="btn btn-error btn-xs">
              Logout
            </button>
          </>
        )}

        <ThemeSelect/>
      </div>
    </nav>
  );
};

export default NavBar;
