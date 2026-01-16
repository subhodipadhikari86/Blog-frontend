import React from 'react'
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { deleteBlogById, getUserBlogs } from '../ApiCall'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Spin } from 'antd'
import { toast } from 'sonner'
import BlogComp from './BlogComp'
const MyBlogs = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["userBlogs"],
        queryFn: getUserBlogs
    })
    const navigate = useNavigate()
    const handlePost = () => {
        navigate(`/postBlog`)
    }
    const handleClick = (id) => {
        navigate(`/blog/${id}`)
    }
    const queryclient = useQueryClient();
    const blogMutation = useMutation({
        mutationFn: () => {
            return postBlog(form);
        },
        onSuccess: () => {
            queryclient.invalidateQueries("userBlogs")
        }
    })

    const [id, setid] = useState("")
    const deleteMutation = useMutation({
        mutationFn: () => {

            return deleteBlogById(id)
        },
        onSuccess: () => {
            toast("Blog Deleted Successfully")
            queryclient.invalidateQueries("userBlogs");
            queryclient.invalidateQueries("AllBlogs")
        }
    })
    const [confirmDel, setconfirmDel] = useState(false)
    const handleClickDelete = (id) => {
        setid(id);
        deleteMutation.mutate()
    }
    return (

        <div>
            {
                data ? <div className='animate-in fade-in duration-1000'>

                    <div className='w-[1100px] m-auto mt-32'>
                        {
                            data ?

                                <div className={`grid gap-15 ${"grid-cols-2"}`}>
                                    {
                                        data && data.map((val, idx) => {
                                            let category = val.category
                                            let title = val.title
                                            let content = val.content
                                            let userName = val.createdBy.name
                                            return <div
                                                key={val._id}
                                                className='shadow-lg hover:shadow-2xl transition rounded-2xl overflow-hidden flex flex-col bg-gradient-to-r from-white via-gray-50 to-white'
                                            >
                                                <BlogComp val={val} />
                                                <div className='flex justify-center mb-5 w-full px-5'>
                                                    <button
                                                        className="bg-red-600 text-white p-3 w-full rounded-md hover:bg-red-700 transition cursor-pointer font-medium"
                                                        onClick={() => {
                                                            handleClickDelete(val._id)
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>

                                : <h1>No Blogs Yet</h1>


                        }

                        {
                            data && data.length == 0 &&
                            <h1 className='text-4xl font-bold text-gray-600 text-center'>No Blogs Yet</h1>

                        }

                        <div className='flex justify-center mt-10'>
                            <button
                                type="submit"
                                className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition cursor-pointer font-medium"
                                onClick={handlePost}
                            >
                                Post Blog
                            </button>


                        </div>

                    </div>
                </div>
                    :
                    <div className='mt-20 flex justify-center items-center'>
                        <Spin size='large' />
                    </div>
            }
        </div>
    )
}

export default MyBlogs