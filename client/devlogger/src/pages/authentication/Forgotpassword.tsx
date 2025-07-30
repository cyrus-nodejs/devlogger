import React from "react";
import { useFormik, type FormikHelpers } from "formik";
import * as Yup from "yup";


interface ForgotPasswordFormValues {
  email: string;
}

const initialValues: ForgotPasswordFormValues = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPasswordForm: React.FC = () => {


  const onSubmit = (
    values: ForgotPasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ForgotPasswordFormValues>
  ) => {
    console.log("Reset password request sent for:", values.email);
    // TODO: Trigger backend request here
    setSubmitting(false);
    resetForm();
    alert("If an account exists for that email, a reset link was sent.");
  };

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });
  

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
        <div className="w-full max-w-md mx-auto bg-white">
                <div className='flex justify-center bg-Oxfordblue mb-12'>   
<div className="flex  flex-col  py-12">
  <div className='text-xl font-medium text-Whitesmoke'> <h2 className=" font-bold text-center">Forgot Password</h2></div>
  <div className=' text-gray-400 text-sm ml-5'> Enter your email address and we’ll send you a link to reset your password.</div>
</div>
 </div>
       

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <a
            href="/auth"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
