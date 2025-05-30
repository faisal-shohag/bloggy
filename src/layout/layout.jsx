import { Outlet, useNavigation } from "react-router";
import NavBar from "../components/NavBar";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { use } from "react";
import Splash from "../components/Splash";

const Layout = () => {
  const navigation = useNavigation();
  const { isLoading } = use(AuthContext)

  return (
    <div>
    { isLoading ? <Splash/> : <>
     <NavBar />
      <div className="container mx-auto mt-3">
        {navigation.state === "loading" ? "Loading..." : <Outlet />}
      </div>
     </>}
      <Toaster />
    </div>
  );
};

export default Layout;
