import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaCog, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarOptions = [
        { text: "Home", link: "/", icon: <FaHome /> },
        { text: "Dashboard", link: "/dashboard", icon: <FaTachometerAlt /> },
        { text: "Settings", link: "/settings", icon: <FaCog /> },
        { text: "About", link: "/about", icon: <FaInfoCircle /> },
        { text: "Contact", link: "/contact", icon: <FaEnvelope /> }
    ];

    const handleNavigation = (link) => {
        navigate(link);
    };

    return (
        <aside className="bg-gray-200 text-black w-64 flex-grow overflow-y-auto p-4 flex flex-col shadow-xl">
            <div className="flex-1 space-y-2 mt-8">
                {sidebarOptions.map((option) => (
                    <div
                        key={option.text}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200
                            ${location.pathname === option.link ? 'bg-gray-300 text-blue-600' : 'text-gray-700 hover:bg-gray-300 hover:text-black'}`}
                        onClick={() => handleNavigation(option.link)}
                    >
                        <div className="text-xl">
                            {option.icon}
                        </div>
                        <span className="font-semibold text-sm">{option.text}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;