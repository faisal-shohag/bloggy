import { use, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const location = useLocation();
  const emailRef = useRef();
  const navigate = useNavigate();
  const { loginWithEmailAndPassword, signInWithGoogle, signInWithGithub } = use(AuthContext);
  const [show, setShow] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.loading("Loging in...", { id: "login" });
    const email = e.target.email.value;
    const passoword = e.target.password.value;

    loginWithEmailAndPassword(email, passoword)
      .then(() => {
        toast.success("Successfully logged in!", { id: "login" });
        navigate(location.state || "/");
      })
      .catch((error) => {
        console.log(error);
        setLoginError('Error jhdsjsdfg')
        toast.error(error.message, { id: "login" });
      });
  };

  const handleGoogleSignIn = () => {
    toast.loading("Loging in...", { id: "login" });
    signInWithGoogle()
    .then(() => {
      toast.success("Successfully logged in!", { id: "login" });
      console.log(location)
      navigate(location.state || "/");
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.message, { id: "login" });
    });
  }

  const handleGithubSignIn = () => {
    toast.loading("Loging in...", { id: "login" });
    signInWithGithub()
    .then(() => {
      toast.success("Successfully logged in!", { id: "login" });
      navigate(location.state || "/");
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.message, { id: "login" });
    });
  }

  const handleForgetPassword = () => {
    toast.loading("Sending password reset email...", { id: "forget-pass" });
    const email = emailRef.current.value;
    if (!email) {
      toast.error("Please enter valid email!", { id: "forget-pass" });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email has been sent!", {
          id: "forget-pass",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Password reset failed!", { id: "forget-pass" });
      });
  };

  console.log(loginError)

  return (
    <div className="bg-base-200 p-10 rounded-xl shadow-2xl">
      <div className="flex-col justify-center items-center ">
        <div className="text-center my-5">
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
        
        <form
          onSubmit={handleSubmit}
        >
          <div >
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                ref={emailRef}
                type="email"
                name="email"
                className="input"
                placeholder="Email"
                required
              />
             <div className="relative">
             <label className="label">Password</label>
              <input
                type={show ? "text" : "password"}
                name="password"
                className="input"
                placeholder="Password"
                required
              />
              {!show && <span onClick={()=>setShow((prev) => !prev)} className="absolute right-7 z-50 cursor-pointer bottom-3"><FaEye size={18}/></span>}
              {show && <span onClick={()=>setShow((prev) => !prev)} className="absolute right-7 z-50 cursor-pointer bottom-3"><FaEyeSlash size={18}/></span>}
             </div>
              <div>
                <div onClick={handleForgetPassword} className="link text-left link-hover">
                  Forgot password?
                </div>
              </div>
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
             
            </fieldset>
            
          
          </div>
        </form>
        
        <span className="text-center">OR</span>

        <button onClick={handleGoogleSignIn} className="btn"><FaGoogle/> Sign in with Google</button>
        <button onClick={handleGithubSignIn} className="btn"><FaGithub/> Sign in with Github</button>

        <div className="text-center">
              Not registered?{" "}
              <Link className="underline" to={"/register"}>
                Register
              </Link>
            </div>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
