import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import { getNewUser, getUserDetails } from '../ApiCall';
import ChatComp from './ChatComp';
import Navbar from './Navbar';

const ChatWithUser = () => {
    const { id } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ["singleUser"],
        queryFn: ()=>{
            return getNewUser(id);
        }
    })

    return (
        <div>   
            <Navbar/>
            <div className='flex flex-col items-center mt-10 animate-in fade-in duration-1000'>
                {
                    data && 
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl font-bold text-gray-600'>Chat With <span className='text-red-500 text-5xl'>{data.name}</span></h1>
                        <ChatComp id={id}/>
                    </div>
                }
            </div>

        </div>
    )
}

export default ChatWithUser