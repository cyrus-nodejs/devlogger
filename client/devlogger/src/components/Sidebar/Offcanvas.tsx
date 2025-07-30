import { FaBars } from 'react-icons/fa';
interface leftSideProps {
  
  onMenuClick: () => void
}


const Offcanvas: React.FC<leftSideProps> = ({onMenuClick}) => {
  return (
   <div className="bg-white dark:bg-Oxfordblue shadow-md p-4 flex items-center justify-between lg:hidden">
      <button onClick={onMenuClick} className="text-gray-800 text-xl dark:text-white">
        <FaBars />
      </button>
      <h1 className="text-xl dark:text-white font-bold">DevLogger</h1>
    </div>
  )
}

export default Offcanvas