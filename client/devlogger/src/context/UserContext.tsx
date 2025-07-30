// src/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';

import axios from 'axios'
// import { useNavigate } from 'react-router-dom';
import { removeRefreshToken, getAccessToken,  removeAccessToken} from '../utils/helpers/storage';





 interface USER {
    _id: string,
    email: string,
    username: string,
    firstname: string,
    lastname: string,
    register_date: string,
    last_seen:string,
    mobile_number:string,
      display_name:string
      github_token:string
    role:string,
    __v: number
  }
  
  


interface userType {
authUser:USER | null
isAuthenticated :boolean
setAuthUser:React.Dispatch<React.SetStateAction<null>>
}

  








const UserContext = createContext<userType>(null!);

const BASEURL = import.meta.env. VITE_APP_BASE_URL
export const UserProvider = ({ children}:{ children: React.ReactNode }) => {
  
  // const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [message, setMessage] = useState("")



console.log(message)

  

  const logout = () => {
    setAuthUser(null);
   removeAccessToken()
   removeRefreshToken()
  
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = getAccessToken()
      if (token) {
        try {
          const res = await axios.get(`${BASEURL}/api/user/`, {withCredentials:true});
          console.log('User authenticated:', res.data);
          console.log(res.data)
          setMessage(res.data.message || "User authenticated")
          setAuthUser(res.data.user)
          setIsAuthenticated(true)
        } catch {
          logout();
        }
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ authUser,  setAuthUser, isAuthenticated  }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
