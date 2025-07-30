import {  FaCalculator, FaCalendar, FaTasks, FaSatellite,  FaWallet, FaArrowRight, FaArrowLeft, FaTimes, FaDashcube, FaScrewdriver} from 'react-icons/fa';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
interface leftSideProps {
  isOpen: boolean;
  onClose: () => void
  isCollapsed: boolean;
  toggleCollapse: () => void
}


const LeftSidebar: React.FC<leftSideProps> = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  
  return (
      <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          'fixed inset-0 z-30 border bg-White dark:bg-Oxfordblue bg-opacity-50 lg:hidden transition-opacity duration-300',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          'fixed z-40 border top-0 left-0 h-full bg-  transition-all duration-300',
          {
            'w-64': !isCollapsed,
            'w-16': isCollapsed,
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
            'lg:translate-x-0': true,
            'lg:static': true,
          }
        )}
      >
        <div className="flex items-center  justify-between px-4 py-3  border-Oxfordblue  dark:border-White">
          {!isCollapsed && <h1 className="text-xl dark:text-White font-bold">DevLogger</h1>}
          <div className="flex items-center space-x-2">
            {/* Collapse toggle only on lg+ */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block focus:outline-none dark:text-white"
            >
              {!isCollapsed ?  <FaArrowLeft />:<FaArrowRight/> }
              
            </button>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <nav className="mt-4">
           {!isCollapsed ? (<ul className="space-y-2">

            <li className="px-4 py-2  dark:text-white hover:text-Oxfordblue dark:hover:text-Brandeisblue  cursor-pointer">Main</li>
            <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer"> 
              <div className="flex flex-row ">
             <div className='me-1 dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><FaCalculator /></div>
             <div className='text-sm dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><Link to='activity-chart'>Analytic</Link></div>
            </div>
              </li>
            <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer">
               <div className="flex flex-row ">
         <div className='me-1 dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><FaCalendar /></div>
        <div className='text-sm dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><Link to='session-list'>Sessions</Link> </div>
            </div>
             
              </li>
              <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer"> 
              <div className="flex flex-row ">
             <div className='me-1 dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><FaSatellite /></div>
             <div className='text-sm dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><Link to='#'>Apps</Link></div>
            </div>
              </li>
                  <li className="px-4 py-2 dark:text-white hover:text-Oxfordblue cursor-pointer">Components & Extra</li>
              <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer"> 
              <div className="flex flex-row ">
             <div className='me-1  hover:text-Oxfordblue dark:hover:text-Brandeisblue  dark:text-white'><FaTasks/></div>
             <div className='text-sm dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><Link to='#'>Tasks</Link></div>
            </div>
              </li>
              <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer"> 
              <div className="flex flex-row ">
             <div className='me-1  hover:text-Oxfordblue dark:hover:text-Brandeisblue dark:text-white'><FaScrewdriver /></div>
             <div className='text-sm  hover:text-Oxfordblue dark:hover:text-Brandeisblue dark:text-white'><Link to='#'>Setting</Link></div>
            </div>
              </li>
              <li className="px-4 py-2 hover:text-Oxfordblue cursor-pointer"> 
              <div className="flex flex-row ">
             <div className='me-1  hover:text-Oxfordblue dark:hover:text-Brandeisblue dark:text-white'><FaWallet /></div>
             <div className='text-sm  hover:text-Oxfordblue dark:hover:text-Brandeisblue dark:text-white'><Link to='#'>Profile</Link></div>
            </div>
              </li>
            <li className="px-4 py-2 hover:text-blue-900 cursor-pointer">
               <div className="flex flex-row ">
         <div className='me-1  hover:text-Oxfordblue dark:hover:text-Brandeisblue dark:text-white'><FaDashcube  /></div>
        <div className='text-sm dark:text-white  hover:text-Oxfordblue dark:hover:text-Brandeisblue'><a>Widget</a> </div>
            </div>
              </li>
          </ul>) : (<ul className="space-y-2">

           
            <li   title="Analysis" className="px-4 py-2 hover:text-Oxfordblue  dark:hover:text-Brandeisblue cursor-pointer"><Link to='activitiy-chart  ' className='dark:text-white'><FaCalculator /></Link></li>
            <li title="Sessions" className="px-4 py-2  hover:text-Oxfordblue dark:hover:text-Brandeisblue cursor-pointer"><Link to='session-list ' className='dark:text-white'><FaCalendar /></Link></li>
            <li title="Apps" className="px-4 py-2  hover:text-Oxfordblue dark:hover:text-Brandeisblue cursor-pointer"><Link to='#' className='dark:text-white'><FaSatellite /></Link></li>
          </ul>)}
          
        </nav>
      </div>
    </>
  )
}

export default LeftSidebar;