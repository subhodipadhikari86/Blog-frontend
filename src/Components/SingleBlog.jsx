import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, getSingleBlog, postComment, Summarize } from '../ApiCall'
import Navbar from './Navbar'
import { useState, useEffect } from 'react'
import { Spin, Skeleton, notification } from 'antd'
import { toast } from 'sonner'
import {
  MessageOutlined,
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  RobotOutlined,
  SendOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'

const SingleBlog = () => {
    const [api, contextHolder] = notification.useNotification()
    const openNotificationWithIcon = type => {
        api[type]({
            message: 'Comment Posted',
            description: 'Your Comment Posted Successfully.',
        })
    }
    const [allCmnts, setallCmnts] = useState([])

    const { id } = useParams()
    const { data, isLoading1 } = useQuery({
        queryKey: ["sBlog", id],
        queryFn: () => getSingleBlog(id)
    })

    const [summ, setsumm] = useState("")
    const [isSum, setisSum] = useState(false)
    const [ren, setren] = useState(true)
    const [show, setshow] = useState(false)
    const [showCmnt, setshowCmnt] = useState(false)
    const [addCmnt, setaddCmnt] = useState(false)
    const [text, settext] = useState("")

    const callGemini = async () => {
        setisSum(true)
        setren(false)
        setshow(true)
        const dataa = await Summarize(data.content)
        setshow(false)
        setren(true)
        setsumm(dataa)
    }

    const { data: cmnt, isLoading2 } = useQuery({
        queryKey: ["cmntt", id],
        queryFn: () => getComments(id)
    })

    const [checkCmnt, setcheckCmnt] = useState(false)
    const [errorCmnt, seterrorCmnt] = useState("")
    const queryClient = useQueryClient()
    const cmntMutation = useMutation({
        mutationFn: () => {
            let curCmnt = text
            let blogId = id
            setcheckCmnt(true)
            return postComment({ cmnt: curCmnt, blogId })
        },
        onSuccess: () => {
            settext("")
            setcheckCmnt(false)
            seterrorCmnt("")
            toast.success("Comment Posted Successfully")
            queryClient.invalidateQueries("cmntt")
        },
        onError: (e) => {
            console.log(e)
            setcheckCmnt(false)
            seterrorCmnt(e.msg)
        }
    })

    const handleChange = (e) => {
        seterrorCmnt("")
        settext(e.target.value)
    }
    
    const handlePost = () => {
        if (text.trim() === "") {
            seterrorCmnt("Comment cannot be empty")
            return
        }
        cmntMutation.mutate()
    }

    useEffect(() => {
        setsumm("AI is Summarizing...")
    }, [isSum])

    useEffect(() => {
        const arr = []
        if (cmnt) cmnt.forEach((val, ind) => {
            if (val.sentiment === "positive") {
                arr.unshift(val)
            } else {
                arr.push(val)
            }
        })
        setallCmnts(arr)
    }, [cmnt])

    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-blue-50'>
            <Navbar />
            {contextHolder}
            
            <div className='pt-24 max-w-4xl mx-auto px-4 pb-12'>
                {isLoading1 ? (
                    <div className='flex justify-center items-center py-20'>
                        <Spin size='large' />
                    </div>
                ) : data ? (
                    <div className='animate-in fade-in duration-700'>
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                        >
                            <ArrowLeftOutlined className="mr-2" />
                            Back to Blogs
                        </button>
                        <div className='bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200'>
                            <div className='text-center mb-8'>
                                <span className='inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4'>
                                    {data.category}
                                </span>
                                <h1 className='text-4xl font-bold text-slate-800 mb-6'>{data.title}</h1>
                                
                                <div className='prose prose-lg max-w-none text-slate-600 text-left'>
                                    <p className='whitespace-pre-line leading-relaxed'>{data.content}</p>
                                </div>
                            </div>

                            <div className='flex justify-between items-center border-t border-slate-100 pt-6'>
                                <div className='flex items-center'>
                                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3'>
                                        {data.createdBy.name ? data.createdBy.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-slate-800'>{data.createdBy.name}</h3>
                                        <p className='text-sm text-slate-500'>Author</p>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setshowCmnt(!showCmnt)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <MessageOutlined />
                                    {showCmnt ? 'Hide Comments' : 'Show Comments'} 
                                    {cmnt && <span className="bg-white text-blue-600 rounded-full text-xs px-2 py-1">{cmnt.length}</span>}
                                </button>
                            </div>
                        </div>
                        {showCmnt && (
                            <div className='bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200 animate-in fade-in duration-700 overflow-y-auto h-[500px]'>
                                <h2 className='text-2xl font-bold text-slate-800 mb-6 flex items-center'>
                                    <MessageOutlined className="mr-3 text-blue-500" />
                                    Comments ({cmnt ? cmnt.length : 0})
                                </h2>

                                {isLoading2 ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <Skeleton key={i} active avatar paragraph={{ rows: 2 }} />
                                        ))}
                                    </div>
                                ) : cmnt && allCmnts.length > 0 ? (
                                    <div className='space-y-6'>
                                        {allCmnts.map((val) => (
                                            <div 
                                                key={val._id} 
                                                className={`p-5 rounded-xl border-l-4 ${val.sentiment === "positive" ? 'border-green-500 bg-green-50' : 'border-amber-500 bg-amber-50'} animate-in fade-in duration-700`}
                                            >
                                                <div className='flex justify-between'>
                                                    <div className='flex-1'>
                                                        <p className='text-slate-700'>{val.text}</p>
                                                    </div>
                                                    <div className='ml-4'>
                                                        {val.sentiment === "positive" ? 
                                                            <LikeOutlined className="text-green-500 text-xl" /> : 
                                                            <DislikeOutlined className="text-amber-500 text-xl" />
                                                        }
                                                    </div>
                                                </div>

                                                <div className='flex justify-end mt-3'>
                                                    <div className='flex items-center'>
                                                        <UserOutlined className="text-blue-500 mr-2" />
                                                        <span className='text-sm text-blue-600 font-medium'>
                                                            {val.author.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <MessageOutlined className="text-4xl mb-3 opacity-50" />
                                        <p>No comments yet. Be the first to comment!</p>
                                    </div>
                                )}

                                <div className='mt-10'>
                                    {!addCmnt ? (
                                        <div className="text-center">
                                            <button
                                                onClick={() => setaddCmnt(true)}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <MessageOutlined />
                                                Add a Comment
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-5 rounded-xl">
                                            <h3 className="font-medium text-slate-800 mb-4">Add your comment</h3>
                                            
                                            {checkCmnt ? (
                                                <div className='p-4 bg-white rounded-lg mb-4'>
                                                    <div className="flex items-center gap-3 text-blue-600">
                                                        <Spin size="small" />
                                                        <span>AI is reviewing your comment...</span>
                                                    </div>
                                                </div>
                                            ) : errorCmnt && (
                                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                                                    {errorCmnt}
                                                </div>
                                            )}
                                            
                                            <div className='flex gap-3'>
                                                <input 
                                                    type="text" 
                                                    placeholder='Share your thoughts...' 
                                                    className='flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                                                    value={text} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                                <button
                                                    onClick={handlePost}
                                                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                    disabled={checkCmnt}
                                                >
                                                    <SendOutlined />
                                                </button>
                                            </div>
                                            
                                            <button
                                                onClick={() => setaddCmnt(false)}
                                                className="text-slate-500 hover:text-slate-700 mt-3 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='bg-white rounded-2xl shadow-lg p-8 border border-slate-200'>
                            <div className='text-center mb-6'>
                                <h2 className='text-2xl font-bold text-slate-800 flex items-center justify-center'>
                                    <RobotOutlined className="mr-3 text-purple-500" />
                                    AI-Powered Summary
                                </h2>
                                <p className='text-slate-600'>Get a quick summary of this blog post generated by our AI</p>
                            </div>
                            
                            <div className='flex justify-center mb-6'>
                                <button
                                    onClick={callGemini}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                    disabled={show}
                                >
                                    <RobotOutlined />
                                    {isSum ? 'Regenerate Summary' : 'Generate Summary'}
                                </button>
                            </div>
                            
                            {isSum && (
                                <div className='bg-slate-50 rounded-xl p-1'>
                                    {show ? (
                                        <div className="p-6">
                                            <Skeleton active paragraph={{ rows: 4 }} />
                                        </div>
                                    ) : (
                                        <div className="p-6 animate-in fade-in duration-700">
                                            <h3 className="font-semibold text-slate-800 mb-3">AI Summary:</h3>
                                            <div className="prose prose-slate max-w-none text-slate-700 bg-white p-5 rounded-lg border border-slate-200">
                                                <p className="whitespace-pre-line">{summ}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-slate-700 mb-3">Blog not found</h2>
                        <p className="text-slate-500 mb-6">The blog you're looking for doesn't exist or may have been removed.</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                        >
                            Back to Blogs
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SingleBlog