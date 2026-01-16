import React from 'react'
import io from "socket.io-client"
import { useState, useEffect } from 'react'
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { getMsg, sendMsg } from '../ApiCall'
import { useMemo } from 'react'
const ChatComp = ({ id }) => {
    const userid = id
    // console.log(userid);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getChats"],
        queryFn: () => {
            console.log("called");

            return getMsg(id);
        },

    })
    const queryclient = useQueryClient();
    const chatMutation = useMutation({
        mutationFn: () => {
            return sendMsg({ text, userid });
        },
        onSuccess: () => {
            settext("")
            queryclient.invalidateQueries("getChats");
            

        }
    })
    // const socket = io("http://localhost:8000", {
    //     withCredentials: true
    // });

    let socket = useMemo(() => io("http://localhost:8000", {
        withCredentials: true
    }), [])

    socket.on("recieve", (msg) => {
        console.log("recieved", msg);
        refetch()
        // setreplyMsg(msg)
    })

    const [text, settext] = useState("")
    const [replyMsg, setreplyMsg] = useState("")
    const [mainArr, setmainArr] = useState([])
    const handleChange = (e) => {
        settext(e.target.value)
    }

    const handleClick = async () => {
        // setreplyMsg("")
        await socket.emit("chat-msg", { text, userid })
        await chatMutation.mutate();
    }
    // console.log("rendering");

    useEffect(() => {
        if (replyMsg.length > 0) {
            settext("")
        }
    }, [replyMsg])
    if (data) {
        // console.log(data);
    }
    useEffect(() => {
        if (data) {
            setmainArr(data);
        }
    }, [data])
    return (
        <div className=''>
            <div className='max-w-[1200px] m-auto w-full'>
                <div className='flex justify-center mt-20 gap-5'>
                    <div>
                        <div>
                            <input type="text" className='w-full border rounded-lg px-4 py-2' placeholder='Send Msz' value={text} onChange={handleChange} />
                        </div>
                    </div>
                    <div className=''>
                        <button className='bg-red-500 p-2 px-4 rounded-xl text-white cursor-pointer' onClick={handleClick}>Send Msg</button>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 bg-fixed mt-5 w-[1000px] m-auto mb-30 rounded-2xl">
                    <div className="max-w-[600px] w-full overflow-y-auto rounded-2xl shadow-2xl backdrop-blur-md bg-white/30 p-6  m-20">
                        {
                            mainArr.map((val, ind) => (
                                <div key={ind} className={`flex ${val.flag === 1 ? "justify-start" : "justify-end"}`}>
                                    <div className="rounded-lg shadow-md bg-white/80 backdrop-blur-sm w-fit max-w-[70%] p-3 px-5 mb-5">
                                        <h1 className="text-lg text-gray-800">{val.text}</h1>
                                        <h2 className="text-right text-sm text-gray-500 mt-1">{val.date}</h2>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatComp