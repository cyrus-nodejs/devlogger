// GithubRedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../../utils/helpers/axiosconfig'
import { saveAccessToken , saveRefreshToken} from "../../../utils/helpers/storage";

const BASEURL = import.meta.env.VITE_APP_BASE_URL

const GithubRedirectHandler = () => {
const navigate = useNavigate();

   useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    console.log(code)
    if (code) {
      axios.post(`${BASEURL}/api/github/`, { code })
        .then(res => {
          saveAccessToken( res.data.access)
          saveRefreshToken(res.data.refresh)
          navigate('/'); // or wherever
        })
        .catch(err => {
          console.error('Auth failed', err);
        });
    }
  }, [navigate]);
  return <div>Logging in with GitHub...</div>;
};

export default GithubRedirectHandler;
