import  { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
   const [activeTab, setActiveTab] = useState('login');

     const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' }
  ]

  return (
     <div className="w-full max-w-md mx-auto mt-1">
      {/* Tab List */}
                    <div className='flex justify-center bg-Oxfordblue'>   
<div className="flex  flex-col  py-12">
  <div className='text-xl font-medium text-Whitesmoke'>Let's Get Started DevLogger</div>
  <div className=' text-gray-400 text-sm ml-5'>Sign in to continue to DevLogger</div>
</div>
 </div>
      <div className="flex border ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="">
        {activeTab === 'login' &&  <Login />}
        {activeTab === 'register' && <Register />}
        
      </div>
    </div>
  )
}

export default Auth