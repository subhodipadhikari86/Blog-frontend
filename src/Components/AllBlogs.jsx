import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllBlogs } from '../ApiCall';
import { useNavigate } from 'react-router-dom';
import { Spin, notification } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MessageOutlined,
  RocketOutlined,
  ReadOutlined,
  BookOutlined,
  StarOutlined,
  MenuOutlined,
  CloseOutlined,
  FireOutlined,
} from '@ant-design/icons';
import BlogComp from './BlogComp';

const AllBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['AllBlogs'],
    queryFn: getAllBlogs,
  });
  const navigate = useNavigate();

  const [mainData, setMainData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  const handlePost = () => navigate('/postBlog');
  const doChat = () => navigate('/chat');

  const filterByCategory = (category) => {
    if (!data) return;
    if (category === 'All') {
      setMainData(data.blogs);
      setActiveCategory('All');
      setSearchText('');
    } else {
      setMainData(
        data.blogs.filter(
          (blog) => blog.category.toLowerCase() === category.toLowerCase()
        )
      );
      setActiveCategory(category);
      setSearchText('');
    }
    setIsSidebarOpen(false);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchText(val);
    if (!val && data) {
      setMainData(data.blogs);
      setActiveCategory('All');
    } else if (data) {
      const filtered = data.blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(val.toLowerCase()) ||
          blog.category.toLowerCase().includes(val.toLowerCase())
      );
      setMainData(filtered.length ? filtered : []);
      setActiveCategory('Search Results');
    }
  };

  useEffect(() => {
    if (data) {
      setMainData(data.blogs);
      setTrendingBlogs([...data.blogs].sort(() => 0.5 - Math.random()).slice(0, 3));
    }
    if (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load blogs. Please try again later.',
      });
    }
  }, [data, error]);

  const categories = data ? ['All', ...new Set(data.blogs.map((b) => b.category))] : ['All'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex pt-16">
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed md:relative top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col border-r border-slate-200`}
      >
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <ReadOutlined className="mr-3 text-yellow-300" />
            Blog Categories
          </h2>
          <p className="text-blue-100 text-sm mt-1">Explore content by category</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3 pl-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => filterByCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOutlined className="text-slate-400" />
                    {cat}
                  </div>
                  {activeCategory === cat && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {cat === 'All' ? data?.blogs.length : mainData?.length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* <h3 className="text-sm font-semibold text-slate-500 uppercase mt-6 mb-3 pl-2">Trending Now</h3> */}
          {/* <div className="space-y-4">
            {trendingBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                <div className="flex items-start gap-2">
                  <FireOutlined className="text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{blog.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{blog.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white flex flex-col gap-3">
            <button
              onClick={handlePost}
              className="w-full bg-white text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md"
            >
              <PlusOutlined /> Write a Blog
            </button>
            <button
              onClick={() => navigate('/recom')}
              className="w-full bg-blue-800 text-white py-2.5 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 font-semibold shadow-md"
            >
              <StarOutlined /> Recommendations
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Discover Blogs</h1>
                <p className="text-slate-600">Explore insights and stories from our community of writers</p>
              </div>
              <button
                onClick={handlePost}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-md whitespace-nowrap"
              >
                <PlusOutlined /> Write Blog
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchOutlined className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white shadow-sm"
                  placeholder="Search by category or title..."
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center gap-2 justify-center font-semibold">
                <SearchOutlined /> Search
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm">
              <Spin size="large" />
            </div>
          ) : mainData && mainData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainData.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-200"
                >
                  <BlogComp val={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4 text-slate-300">🔍</div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">No blogs found</h2>
              <p className="text-slate-500 mb-6">Try a different search term or browse all blogs</p>
              <button
                onClick={() => {
                  setSearchText('');
                  setMainData(data?.blogs);
                  setActiveCategory('All');
                }}
                className="px-6 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold shadow-sm"
              >
                View All Blogs
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllBlogs;
