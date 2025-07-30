// src/components/Navbar.jsx

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {  useState } from 'react';
import { logOut } from '../api/auth';
import { connectGitHub } from '../utils/helpers/functions';

import {  removeRefreshToken, removeAccessToken } from '../utils/helpers/storage';

import { Link } from 'react-router-dom';

import { useUser } from '../context/UserContext';

import DarkModeToggle from './Darkmode/Darkmode';
const BASEURL = import.meta.env.VITE_APP_BASE_URL



const Navbar  = () => {
   

  const [error, setError] = useState<string | null>(null);
  const {authUser, setAuthUser}  = useUser()
      const handleLogout = async () => {
         try {
           const res = await logOut();
           console.log("Response from API:", res.data);
            // ← adjust based on API
        removeAccessToken()
        removeRefreshToken()
        setAuthUser(null)
         } catch (err) {
           console.error(err);
           console.log(error)
           setError('Failed to load sessions.');
         }

        removeAccessToken()
        removeRefreshToken()
       };




  return (
    
    <nav className="w-full sticky top-0 left-0  bg-white  dark:bg-Oxfordblue  shadow-md px-4 mb-2  py-2 flex items-center sm:justify-between">
      {/* Left: Brand */}
      <div className="text-xl font-bold text-gray-800">
        <div className="flex me-6 border-b border-gray-300">
    
        <Link to='/add-task'>
        <button
          className={`flex-1 py-2 px-4 text-sm text-center dark:bg-Delta-blue dark:text-White . `}
          
        >
          New Task
        </button>
        </Link>

     
      </div>
       </div>

      {/* Right: Search, Profile Name, Profile Image */}
      <div   className="flex items-center   space-x-4">
        {authUser?.github_token ? (
  <p className="text-green-600   ">✅ GitHub Connected</p>
) : (
  <button
  onClick={connectGitHub}
  className="bg-Whitesmoke text-gray-500 dark:text-Whitesmoke   px-4 py-2 rounded hover:bg-gray-800"
>
  Connect GitHub
</button>
)}
        {/* Search Icon */}
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-600  dark:text-white cursor-pointer" />

        {/* Profile Name */}
        <span className="dark:text-White  hidden  sm:inline">{authUser?.display_name ? authUser?.display_name   : authUser?.email }</span>

        {/* Profile Image */}
        <img
          src="https://i.pravatar.cc/40?img=1"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <DarkModeToggle />

             <span className="text-gray-800 dark:text-Whitesmoke font-medium  sm:inline">{!authUser ? <a href={`${BASEURL}/auth`}>login </a>   : <a onClick={()=>{handleLogout()}}>logout </a> }</span>
      </div>
    </nav> 
  );
};

export default Navbar;
