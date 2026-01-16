import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { storeUser } from '../Features/UserSlice';
import { logOutt } from '../ApiCall';
import { toast } from 'sonner';
import { 
  LogOut, 
  User, 
  Settings,
  PenSquare,
  MessageCircle,
  Sparkles,
  Home
} from 'lucide-react';

const Navbar = () => {
    const user = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const logOutRes = await logOutt();
        dispatch(storeUser(null));
        toast("Logged Out Successfully");
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white text-gray-800 shadow-md z-1000 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-2">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">
                            <span className="text-indigo-600">Blog</span>
                            <span className="text-blue-500">Vista</span>
                        </h1>
                    </div>

                    {user && (
                        <div className="hidden md:flex space-x-6">
                            <button 
                                onClick={() => navigate('/')}
                                className="hover:text-indigo-600 transition-colors flex items-center text-gray-600"
                            >
                                <Home className="h-4 w-4 mr-1" />
                                Home
                            </button>
                            <button 
                                onClick={() => navigate('/postBlog')}
                                className="hover:text-indigo-600 transition-colors flex items-center text-gray-600"
                            >
                                <PenSquare className="h-4 w-4 mr-1" />
                                Create
                            </button>
                            <button 
                                onClick={() => navigate('/MyBlogs')}
                                className="hover:text-indigo-600 transition-colors flex items-center text-gray-600"
                            >
                                <User className="h-4 w-4 mr-1" />
                                My Blogs
                            </button>
                            <button 
                                onClick={() => navigate('/chat')}
                                className="hover:text-indigo-600 transition-colors flex items-center text-gray-600"
                            >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                            </button>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <div className="flex space-x-3">
                                <Link to="/login">
                                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium transition-colors border border-indigo-200 shadow-sm">
                                        Log In
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <div className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <img 
                                            src={user.photo} 
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full border-2 border-gray-200"
                                        />
                                        <span className="ml-2 font-medium hidden md:block text-gray-700">
                                            {user.name}
                                        </span>
                                        <svg 
                                            className="h-4 w-4 ml-1 hidden md:block text-gray-500" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    
                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-10">
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <img 
                                                    src={user.photo} 
                                                    alt={user.name}
                                                    className="h-12 w-12 rounded-full border-2 border-indigo-100"
                                                />
                                                <div className="ml-3">
                                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <button 
                                                onClick={() => navigate("/updateDp")}
                                                className="flex items-center w-full px-4 py-2 text-sm rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Update Profile Photo
                                            </button>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-1"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;