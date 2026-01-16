import React from 'react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Spin } from 'antd';
import { getrecom } from '../ApiCall';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { storeBlog, storetext } from '../Features/BlogSlice';
import BlogComp from './BlogComp';
import { 
  RobotOutlined, 
  SearchOutlined, 
  ArrowRightOutlined,
} from '@ant-design/icons';

const Recom = () => {
    const navigate = useNavigate();
    const [mainData, setmainData] = useState([]);
    const [txt, settxt] = useState("");
    const [showSpin, setshowSpin] = useState(false);
    const dispatch = useDispatch();

    const handleClick = (id) => {
        navigate(`/blog/${id}`);
    };

    const callAi = async () => {
        if (!txt.trim()) {
            return;
        }
        
        setshowSpin(true);
        const res = await getrecom(txt);
        console.log(res);

        setshowSpin(false);
        dispatch(storetext(txt));
        dispatch(storeBlog(res));
        setmainData(res);
    };

    const handleChange = (e) => {
        settxt(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            callAi();
        }
    };

    const txtVal = useSelector((state) => state.blog.text);
    const blogArr = useSelector((state) => state.blog.mainBlogArr);
    
    useEffect(() => {
        settxt(txtVal);
        setmainData(blogArr);
    }, [txtVal, blogArr]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
            <div className="pt-24 max-w-6xl mx-auto px-4 pb-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full text-white mb-4">
                        <RobotOutlined className="text-2xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        AI <span className="text-blue-600">Recommendation</span> System
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Tell me what kind of blogs you're interested in, and I'll find the perfect recommendations for you.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
                    <div className="flex items-center mb-4">
                        {/* <SparklesOutlined className="text-blue-500 text-xl mr-2" /> */}
                        <h2 className="text-xl font-semibold text-slate-800">What are you looking for?</h2>
                    </div>
                    
                    <div className="relative mb-6">
                        <textarea 
                            placeholder="Example: I want to read about technology trends, AI advancements, and programming tutorials..."
                            className="w-full px-6 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                            rows={5}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            value={txt}
                        />
                        <div className="absolute bottom-3 right-3 text-sm text-slate-400">
                            {txt.length}/500
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={callAi}
                            disabled={showSpin || !txt.trim()}
                        >
                            {showSpin ? (
                                <>
                                    <Spin size="small" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <SearchOutlined />
                                    Get Recommendations
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="animate-in fade-in duration-1000">
                    {showSpin ? (
                        <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm">
                            <div className="text-center">
                                <Spin size="large" />
                                <p className="mt-4 text-slate-600">AI is finding the perfect blogs for you...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {mainData.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                            <SearchOutlined />
                                        </span>
                                        Recommended Blogs
                                        <span className="ml-3 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                                            {mainData.length} results
                                        </span>
                                    </h2>
                                </div>
                            )}
                            
                            <div className={`grid gap-6 ${mainData.length < 2 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                                {mainData.length === 0 ? (
                                    <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm">
                                        <div className="text-5xl mb-4 text-slate-300">🤖</div>
                                        <h3 className="text-2xl font-semibold text-slate-700 mb-2">No recommendations yet</h3>
                                        <p className="text-slate-500 mb-6">Describe what you're looking for above and let our AI find the perfect blogs for you.</p>
                                        <div className="inline-flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-sm font-medium text-blue-700 mb-2">Try these examples:</span>
                                            <ul className="text-left text-sm text-slate-600 list-disc pl-5">
                                                <li>Technology trends and programming tutorials</li>
                                                <li>Travel blogs about Southeast Asia</li>
                                                <li>Healthy recipes and nutrition advice</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    mainData.map((val) => (
                                        <div
                                            key={val._id}
                                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 group"
                                        >
                                            <BlogComp val={val} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Additional Info Section */}
                {mainData.length > 0 && (
                    <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-xl font-semibold mb-4">Not finding what you need?</h3>
                        <p className="mb-6 opacity-90">Try being more specific in your request or explore different topics</p>
                        <button
                            onClick={() => {
                                settxt("");
                                setmainData([]);
                            }}
                            className="bg-white text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            {/* <SparklesOutlined /> */}
                            New Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recom;