import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons'

const BlogComp = ({ val }) => {
    const navigate = useNavigate()
    
    const handleClick = (id) => {
        navigate(`/blog/${id}`)
    }
    
    let { category, title, content, createdBy, createdAt, views } = val
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    return (
        <div className="flex flex-col h-full">
            <div className='p-5 pb-0'>
                <span className='inline-block text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full'>
                    {category}
                </span>
            </div>

            <div className="flex flex-col p-5">
                <h1 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2'>{title}</h1>
                <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3'>
                    {content.slice(0, Math.min(120, content.length)) + (content.length > 120 ? "..." : "")}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                            {createdBy.name ? createdBy.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-2">
                            <h3 className="text-sm font-medium text-gray-900">{createdBy.name}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                                <ClockCircleOutlined className="mr-1" />
                                {formatDate(createdAt)}
                            </div>
                        </div>
                    </div>
                    
                    {views !== undefined && (
                        <div className="text-xs text-gray-500 flex items-center">
                            <EyeOutlined className="mr-1" />
                            {views} views
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-5 pt-0">
                <button
                    onClick={() => handleClick(val._id)}
                    className='w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 font-medium flex items-center justify-center gap-2 group'
                >
                    Read More 
                    <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}

export default BlogComp