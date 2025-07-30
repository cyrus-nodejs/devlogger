import React, { useState } from "react";
import { useFormik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from  '../../utils/helpers/axiosconfig';

interface RegisterFormValues {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFormValues = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter your first and last name")
    .min(3, "Name is too short"),

  email: Yup.string().email("Invalid email address").required("Required"),

  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile must be 10 digits")
    .required("Required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const BASEURL = import.meta.env.VITE_APP_BASE_URL || "http://127.0.0.1:8000";
console.log(BASEURL)
const RegisterForm: React.FC = () => {
  const [message, setMessage] = useState(null);

  const onSubmit = async (
    values: RegisterFormValues,
    { //resetForm,
         setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    
      setSubmitting(true);

      const [first_name, ...rest] = values.fullName.trim().split(" ");
      const last_name = rest.join(" ") || "_";

      const payload = {
        password: values.password,
        username:values.email,
        display_name: `${first_name}_${last_name}`,
        email: values.email,
        first_name,
        last_name,
        mobile_number: values.mobile,
      };

   
axios.post(`${BASEURL}/api/register/`,
   payload, 
   {withCredentials: true,}
)
.then((res) => {
  console.log('User registered:', res.data);
  console.log(res)
  setMessage(res.data.message || "Registration successful! Login to proceed")
})
.catch((err) => {
    console.log(err)
  console.error('Registration failed:', err);
  setMessage(err.message || "Registration failed.")
  setSubmitting(false);
    //  resetForm();
});
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="font-bold text-center text-xl">Register</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
              className={`w-full px-3 py-2 border ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-3 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
              className={`w-full px-3 py-2 border ${
                formik.touched.mobile && formik.errors.mobile
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full px-3 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`w-full px-3 py-2 border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
              formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <div className="flex items-center justify-center mt-2 text-sm">
            <span>Already have an account?</span>
            <a
              href="/auth"
              onClick={(e) => {
                e.preventDefault();
                console.log("Navigate to login page");
                // TODO: Add navigation logic if using React Router
              }}
              className="ml-1 text-blue-600 hover:underline"
            >
              Login
            </a>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`text-sm mt-2 text-center ${
                message
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
