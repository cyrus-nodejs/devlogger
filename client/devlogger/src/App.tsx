


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




import PrivateRoute from "./pages/Protected/PrivateRoutes";
import Auth from './pages/authentication/Auth';
import ForgotPassword from './pages/authentication/Forgotpassword';
import ResetPassword from './pages/authentication/ResetPassword'
import GithubRedirectHandler from "./pages/authentication/SocailLogin/GithubCallbackView";
import ErrorPage from './pages/Errorpages/Index';
import GitHubActivityCharts from "./pages/Dashboard/GithubActivity.tsx/GithubActivity";
import CodingSessionsList from "./pages/Dashboard/CodingSession/CodingSessionnList";
import Layout from "./pages/Dashboard/Layout/Index";
import AddSessionForm from "./pages/Dashboard/CodingSession/AddSessionForm";

function App() {





  


  const router = createBrowserRouter([
  {
    path: '/',
    element: (<PrivateRoute><Layout /></PrivateRoute>),
    children: [
      { index: true, element: <GitHubActivityCharts /> },
      { path: 'activity-chart', element: (<PrivateRoute><GitHubActivityCharts /> </PrivateRoute>)},
      { path: 'session-list', element:(<PrivateRoute><CodingSessionsList /></PrivateRoute> )},
      { path: 'add-task', element:(<PrivateRoute><AddSessionForm /></PrivateRoute> )},
    ],
  },

  {
    path: `/auth`,
    element: <Auth   />,
    errorElement: <ErrorPage />
  },
  
    {
    path: `/oauth/callback`,
    element: <GithubRedirectHandler   />,
    errorElement: <ErrorPage />
  },

  {
    path: `/forgot-password`,
    element: <ForgotPassword   />,
    errorElement: <ErrorPage />
  },

  {  //reset-password/:uid/:token
    path: `/reset-password`,
    element: <ResetPassword   />,
    errorElement: <ErrorPage />
  },










  

  
 
  
])


  return (
  <div className='bg-White dark:bg-Oxfordblue' >
 
      <RouterProvider router={router}  />
	
   </div>
  )
}

export default App
