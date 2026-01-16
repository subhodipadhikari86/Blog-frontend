import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar';
import { changePhoto } from '../ApiCall';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
const UpdateDp = () => {
    const handleFile = (e) => {
        setphoto(e.target.files[0]);
    }
    const [loading, setloading] = useState(false)
    const [photo, setphoto] = useState(null)
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        if (photo) {
            newFormData.append("photo", photo);
        }
        setloading(true)
        const nowUser = await changePhoto(newFormData);
        setloading(false)
        if(nowUser.success){
            navigate("/")
        }
        
        console.log(nowUser);
    }
    return (
        <div className='animate-in fade-in duration-1000 pt-20'>
            {/* <Navbar /> */}
            <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl'>
                <input
                    type="file"
                    name="imageFile"
                    className="w-full p-3 border rounded-md"
                    onChange={handleFile}
                />

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 cursor-pointer mt-8"
                        onClick={handleSubmit}
                    >
                        Change Photo
                    </button>
                </div>
            </div>
            <div className='mt-5 flex justify-center'>
                {
                    loading && <Spin size='large' />
                }
            </div>
        </div>
    )
}

export default UpdateDp