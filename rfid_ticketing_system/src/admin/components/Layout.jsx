import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Image from '../../../src/img/logo2.png'
import { Outlet, useNavigate } from 'react-router'


function Layout() {
    
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="flex h-screen flex-col">
            <div className="flex flex-1">
                <div className="w-74 bg-gray-800 text-white">
                    <Sidebar />
                </div>
                <div className="flex flex-col flex-1">
                    <Header onLogout={handleLogout} />
                    <div className="flex-1 bg-gray-100 p-6 relative">
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-10 pointer-events-none">
                            <img src={Image} alt="Logo" className="w-[800px] h-[800px] object-contain" />
                        </div>
                        <div className="relative z-10">
                            <Outlet />
                        </div>
                    </div>
                    <div>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Layout