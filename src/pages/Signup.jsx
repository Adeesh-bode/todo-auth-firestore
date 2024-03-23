import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaExternalLinkAlt } from "react-icons/fa";
import Connect from '../assets/connect.gif';
import { auth, db, provider } from '../utils/firebaseconfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'


const Signup = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '', username: '' });
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [hide, setHide] = useState(false);

  const handleHide = () => {
    setHide(!hide);
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setPasswordStrength(credentials.password.length >= 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, username } = credentials;
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.uid), { uid: user.uid, username, email, password });
      console.log("Successfully Signed Up");
      await setDoc(doc(db, "todos", user.uid), { data: [] });
      console.log("User created and todos document initialized!");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, displayName, email } = result.user;
      await setDoc(doc(db, "users", uid), { uid, username: displayName, email, password: "" });
      console.log("Successfully Logged in using Google");
      await setDoc(doc(db, "todos", uid), { data: [] });
      console.log("User created and todos document initialized!");
    } catch (error) {
      console.error("Error with Google Sign In:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
      else console.log("User is not signed in");
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex gap-4 items-center justify-center bg-[#121215]">
      <div className='m-2 bg-[#18181C] rounded-xl p-4 w-full max-w-2xl lg:w-l shadow-md flex gap-6 justify-evenly items-center'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <h1 className="py-2 text-4xl text-teal-400 font-semibold text-center">
              Sign up
            </h1>
            <input
              type="text"
              placeholder="Enter username"
              name="username"
              onChange={handleChange}
              className="py-2 px-4 w-full rounded-lg bg-[#302D36] focus:outline-none caret-slate-100 font-medium text-[#F5F8FF]"
            />

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
              <button className="text-zinc-200 bg-[#84849D] hover:bg-teal-400 px-4 py-2 rounded-lg" type="button" onClick={handleHide}>
                  <FontAwesomeIcon icon={hide ? faEyeSlash : faEye} />
              </button>
            </div>
            
            {!passwordStrength && <div className='text-[10px] text-zinc-200'>Password should be at least 6 characters</div>}
            
            <input
                  type="submit"
                  value='Sign Up' 
                  className="text-zinc-200 bg-teal-400 hover:bg-transparent hover: border hover:border-white px-4 py-2 rounded-lg cursor-pointer"/>

            <button type='button' onClick={handleGoogleSignin} className='text-white justify-center flex items-center gap-2 bg-teal-400 hover:bg-transparent hover: border hover:border-white px-4 py-2 rounded-lg'>
              <FcGoogle size={30} />
              Sign up with Google
            </button>

            <div onClick={() => navigate('/login')} className='text-teal-400 flex justify-center gap-2 items-center cursor-pointer'>
              <FaExternalLinkAlt />
              Already have an account?
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

export default Signup;