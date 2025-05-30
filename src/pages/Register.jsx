import { use, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa6";

const Register = () => {
  const { createUser, updateUserProfile } = use(AuthContext);
  const [show, setShow] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.name.value;
    const photoURL = e.target.photoURL.value;

           fetch('http://localhost:8000/users', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({displayName, email, photoURL})
        })
        .then((res)=>res.json())
        .then(data=> {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    // createUser(email, password)
    //   .then((result) => {
    //     console.log(result);

 
    //     updateUserProfile(displayName, photoURL);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div className="bg-base-200 p-10 rounded-xl shadow-2xl">
      <div className="flex-col justify-center items-center ">
        <div className="text-center my-5">
          <h1 className="text-2xl font-bold">Register</h1>
        </div>
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div>
                <fieldset className="fieldset">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Name"
                    required
                  />
                  <label className="label">PhotoURL</label>
                  <input
                    type="text"
                    name="photoURL"
                    className="input"
                    placeholder="Photo URL"
                    required
                  />
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="Email"
                  />
          
                  <div className="relative">
                    <label className="label">Password</label>
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      className="input"
                      placeholder="Password"
                    />
                    {!show && (
                      <span
                        onClick={() => setShow((prev) => !prev)}
                        className="absolute right-7 z-50 cursor-pointer bottom-3"
                      >
                        <FaEye size={18} />
                      </span>
                    )}
                    {show && (
                      <span
                        onClick={() => setShow((prev) => !prev)}
                        className="absolute right-7 z-50 cursor-pointer bottom-3"
                      >
                        <FaEyeSlash size={18} />
                      </span>
                    )}
                  </div>
                  <button type="submit" className="btn btn-neutral mt-4">
                    Register
                  </button>
                </fieldset>
              </div>
            </form>

            <span className="text-center">OR</span>

            <button className="btn">
              <FaGoogle /> Sign in with Google
            </button>
            <button className="btn">
              <FaGithub /> Sign in with Github
            </button>

            <div className="text-center">
              Already registered?{" "}
              <Link className="underline" to={"/login"}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
