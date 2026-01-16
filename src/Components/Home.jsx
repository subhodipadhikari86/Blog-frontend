import React from 'react'
import Navbar from './Navbar'
import { useDispatch, useSelector } from 'react-redux'
import AllBlogs from './AllBlogs';
import { useEffect } from 'react';
import { StoreUserRedux } from '../StoreUserRedux';
import { storeUser } from '../Features/UserSlice';
import { getUserDetails } from '../ApiCall';

const Home = () => {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.userInfo);
  // console.log(user);

  // useEffect(() => {

  //   const storeUserr = async () => {
  //     try {
  //       const userDet = await getUserDetails()
  //       if (userDet) {
  //         dispatch(storeUser(userDet));
  //       }
  //     }
  //     catch (e) {
  //       console.log(e);

  //     }
  //   }
  //   storeUserr()

  // }, [])

  return (
    <div>
      {/* <Navbar /> */}
      <AllBlogs />
    </div>
  )
}

export default Home