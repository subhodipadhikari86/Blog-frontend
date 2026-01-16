import React, { useState } from 'react';
import { regUser } from '../ApiCall';
import { Navigate, useNavigate } from 'react-router-dom';
import { storeUser } from '../Features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterSchema } from '../../../Backend/Zod/Auth';
import { Spin } from 'antd';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [photo, setphoto] = useState(null)
  const navigate = useNavigate();
  const handleChange = async (e) => {

    const updated = { ...formData, [e.target.name]: e.target.value }
    // console.log(updated);

    const { data, error } = RegisterSchema.safeParse(updated);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    let arr = [];
    if (error) {
      arr = JSON.parse(error.message)
    }
    checkError(arr, updated);
  };

  const handleFile = (e) => {
    setphoto(e.target.files[0]);
  }
  const checkError = (arr, newData) => {
    let obj = {
      email: 0,
      password: 0,
      name: 0
    }
    arr.forEach((val, ind) => {
      // console.log(val);

      if (val.path[0] === "email") {
        setemailError(val.message);
        obj.email = 1;
      }
      else if (val.path[0] === "password") {

        obj.password = 1;
        setPassError(val.message)
      }
      else if (val.path[0] === "name") {
        setnameError(val.message)
        obj.name = 1;
      }
    })

    if (!obj.email || newData.email.length == 0) setemailError("");
    if (!obj.password || newData.password.length == 0) setPassError("");
    if (!obj.name || newData.name.length == 0) setnameError("")
  }
  const [emailError, setemailError] = useState("")
  const [PassError, setPassError] = useState("")
  const [nameError, setnameError] = useState("")
  const [Error, setError] = useState("")
  const [loading, setloading] = useState(false)
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("name", formData.name);
    newFormData.append("email", formData.email);
    newFormData.append("password", formData.password);
    if (photo) {
      newFormData.append("photo", photo);
    }
    setloading(true);
    const nowUser = await regUser(newFormData);
    console.log(nowUser.newuser);
    setloading(false)
    if (nowUser.success == true) {
      navigate("/login")
    }
    else {
      const arr = nowUser.allErrors;
      if (arr) arr.forEach((val, ind) => {
        // console.log(val);

        if (val.path[0] === "email") {
          setemailError(val.message);
        }
        else if (val.path[0] === "password") {
          setPassError(val.message)
        }
        else if (val.path[0] === "name") {
          setnameError(val.message)
        }
      })
    }
    const erMsg = nowUser.msg;
    if (erMsg) {
      setemailError("");
      setPassError("");
      setnameError("")
      setError(erMsg)
    }
    // console.log("Signup Data:", formData);
  };
  // const curuser = useSelector((state) => state.user.userInfo)
  //     console.log("From Redux", curuser);



  return (
    <div className='mt-20 animate-in fade-in duration-1000'>
      <div className="max-w-md mx-auto mt-10 p-6 shadow-xl bg-white rounded-2xl ">
        <h2 className="text-3xl font-bold mb-4 text-center text-red-600">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border rounded-md"
            onChange={handleChange}
            required
          />
          {
            nameError.length > 0 && <h1 className='text-red-600 text-[15px] mb-3 font-[500] text-center'>
              {nameError}
            </h1>
          }
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            onChange={handleChange}
            required
          />
          {
            emailError.length > 0 && <h1 className='text-red-600 text-[15px] mb-3 font-[500] text-center'>
              {emailError}
            </h1>
          }
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md "
            onChange={handleChange}
            required
          />
          {
            PassError.length > 0 && <h1 className='text-red-600 text-[15px] mb-3 font-[500] text-center'>
              {PassError}
            </h1>
          }

          {
            Error.length > 0 && <h1 className='text-red-600 text-[15px] mb-3 font-[500] text-center'>
              {Error}
            </h1>
          }

          <input
            type="file"
            name="imageFile"
            className="w-full p-3 border rounded-md"
            onChange={handleFile}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Sign Up
          </button>
        </form>


      </div>

      <div className='mt-5 flex justify-center'>
        {
          loading && <Spin size='large' />
        }
      </div>
    </div>

  );
};

export default Signup;
