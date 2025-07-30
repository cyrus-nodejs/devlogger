import React, { useState, useEffect } from "react";
import { useFormik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "../../utils/helpers/axiosconfig";
import { saveAccessToken, saveRefreshToken } from "../../utils/helpers/storage";
import {     useNavigate} from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import { GoogleLogin,  type CredentialResponse } from '@react-oauth/google';
import { connectGitHub} from "../../utils/helpers/functions";


interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const initialValues: LoginFormValues = {
  username: "",
  password: "",
  remember: false,
};

const validationSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  remember: Yup.boolean(),
});

const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)
const LoginForm: React.FC = () => {

  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const {authUser,  isAuthenticated} = useUser()

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
  
       const payload = {
        password: values.password,
        username:values.username
      };  
axios.post(`${BASEURL}/api/login/`,
   payload, 
   {withCredentials: true,}
)
.then((res) => {
  console.log('User authenticated:', res.data);
  console.log(res)
    if (res.data){
   window.location.href = '/';
   }
  
  const { access, refresh} = res.data;
   saveAccessToken(access)
   saveRefreshToken(refresh)
 
})
.catch((err) => {
    console.log(err)
  console.error('Login failed:', err);
  setMessage(err.message || "Login failed.")
  setSubmitting(false);
  setIsError(true)
    //  resetForm();
})
  };






  const handGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const res = await axios.post(`${BASEURL}/api/google-login/`, {
        credential,
      });
            const { access, refresh} = res.data;
            
  
        saveAccessToken(access);
        saveRefreshToken(refresh)
        setMessage("Login successful")
          
  window.location.href = '/';
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed.');
    }
  };


    useEffect(() =>{
        if (isAuthenticated && authUser ){
          navigate('/')
        }

          }, [isAuthenticated, navigate, authUser])


  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });



  return (
    <div className="min-h-screen flex items-center justify-center">
         {/* {!isAuthenticated && !authUser &&(
          <Navigate to="/auth" replace={true} />
        )} 
           */}
          
      <div className="max-w-md w-full bg-white rounded-lg shadow-md border p-6 space-y-6">
        {/* Feedback Message */}
        {message && (
          <div
            className={`text-center text-sm font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <h2 className="font-bold text-center text-xl">Login</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className={`w-full px-3 py-2 border ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full px-3 py-2 pr-10 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 px-2 text-sm text-gray-600 hover:text-black focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.remember}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
              formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm">or continue with</div>

        {/* Social Buttons */}
        <div className="flex justify-between space-x-3">
          <button
            onClick={() => connectGitHub()}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
          >
            GitHub
          </button>
        
            <GoogleLogin    onSuccess={handGoogleLogin} onError={() => alert('Login Failed')} />
      
          <button
         
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded"
          >
            Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
