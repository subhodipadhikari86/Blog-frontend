import React from 'react'
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { getAllUsers } from '../ApiCall'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
const Chat = () => {
    const navigate = useNavigate()
    const { data, isLoading } = useQuery({
        queryKey: ["allUsers"],
        queryFn: getAllUsers
    })
    const handleClick = (id) => {
        navigate(`/chatWith/${id}`)
    }
    return (
        <div className='animate-in fade-in duration-1000'>
            <Navbar />
            <div className='flex flex-col items-center mt-5'>
                <h1 className='text-6xl text-gray-600 font-bold'>Chat With</h1>
                {
                    data && data.map((val, ind) => {
                        return <div key={ind} className='p-5 mt-5   '>
                            <button className='text-xl font-bold text-white text-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 px-5 py-2 rounded-2xl shadow-2xl cursor-pointer'
                                onClick={() => {
                                    handleClick(val._id);
                                }}
                            >
                                {val.name}</button>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Chat