import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../utils/firebaseconfig"; 
import { doc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaExternalLinkAlt } from "react-icons/fa";
import Connect from "../assets/connect.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
  const navigate = useNavigate(); // creating a instance for navigation
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [hide, setHide] = useState(false);

  const handleHide = () => {
    setHide(!hide);
  };

  const handleChange = (e) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      console.log("Successfully Logged In");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Successfully Logged in using Google", result);
      const { uid, displayName, email } = result.user;
      await setDoc(doc(db, "todos", uid), { data: [] });
      console.log("User created and todos document initialized!");

      await setDoc(doc(db, "users", uid), {
        uid,
        username: displayName,
        email,
        password: "",
      });
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error with Google sign-in: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        console.log("User is signed in:", user);
      } else {
        console.log("User is not signed in");
      }
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  return (
   <div className="min-h-screen flex gap-4 items-center justify-center bg-[#121215]">
      <div className="m-2 bg-[#18181C] rounded-xl p-4 w-full max-w-2xl lg:w-l shadow-md flex gap-6 justify-evenly items-center">
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
               <h1 className="py-2 text-4xl text-teal-400 font-semibold text-center">
               Login
               </h1>
               <input
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  className="py-2 px-4 w-full rounded-lg bg-[#302D36] focus:outline-none caret-slate-100 font-medium text-[#F5F8FF]"
               />

               <div className="flex gap-4">
                  <input
                     type={hide ? "text" : "password"}
                     placeholder="Enter password"
                     name="password"
                     onChange={handleChange}
                     className="py-2 px-4 w-full rounded-lg bg-[#302D36] focus:outline-none caret-slate-100 font-medium text-[#F5F8FF]"
                  />
                  {/* <button className="text-zinc-200 bg-[#84849D] hover:bg-[#835FF5] px-4 py-2 rounded-lg" type="button" onClick={handleHide}>
                     {hide ? "Hide" : "Show"}
                  </button> */}
                  <button className="text-zinc-200 bg-[#84849D] hover:bg-teal-400 px-4 py-2 rounded-lg" type="button" onClick={handleHide}>
                     <FontAwesomeIcon icon={hide ? faEyeSlash : faEye} />
                  </button>
               </div>

               <input
                  type="submit"
                  value='Login' 
                  className="text-zinc-200 bg-teal-400 hover:bg-transparent hover: border hover:border-white px-4 py-2 rounded-lg cursor-pointer"/>
               
               <button type='button' onClick={handleGoogleSignin} className='text-white justify-center flex items-center gap-2 bg-teal-400 hover:bg-transparent hover: border hover:border-white  px-4 py-2 rounded-lg'>
                  <FcGoogle size={30} />
                  Sign in with Google
               </button>

               <div onClick={() => navigate('/signup')} className='text-teal-400 flex justify-center gap-2 items-center cursor-pointer'>
                  <FaExternalLinkAlt />
                  Don't have an account?
               </div>
            </div>
         </form>
         <div className='w-fit h-fit flex flex-col justify-between items-center'>
            <div className="text-teal-400">Let's Connect</div>
            <img src={Connect} alt='interactive-img' />
         </div>
      </div>
   </div>
   );
};

export default Login;
