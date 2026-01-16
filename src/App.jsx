import './App.css'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import { Router, Route, Routes, createBrowserRouter } from 'react-router-dom'
import LogIn from './Components/LogIn'
import SignUp from './Components/SignUp'
import SingleBlog from './Components/SingleBlog'
import PostBlog from './Components/PostBlog'
import MyBlogs from './Components/MyBlogs'
import ProtectedRoute from "./ProtectedRoute"
import { getUserDetails } from './ApiCall'
import { useDispatch } from 'react-redux'
import { storeUser } from './Features/UserSlice'
import { useEffect } from 'react'
import Chat from './Components/Chat'
import ChatWithUser from './Components/ChatWithUser'
import io from "socket.io-client"
import Formikk from './Components/Formik'
import { Toaster } from "./Components/ui/sonner"
import UpdateDp from './Components/UpdateDp'
import Recom from './Components/Recom'
import AppLayout from './Components/AppLayout'
export const router = createBrowserRouter([
  {
    // path:"/prac",
    // element:
    // <div className='w-[600px] m-auto'>
    //   <button className='p-2 bg-red-500 text-white rounded-lg shadow-2xl mt-10 cursor-pointer'>Click Me</button>
    // </div>

    path: "/",
    element: <AppLayout />,
    children: [

      {
        path: "/",
        element: <Home />
      },

      {
        path: "/blog/:id",
        element:
          <ProtectedRoute>
            <SingleBlog />
          </ProtectedRoute>
      },

      {
        path: "/postBlog",
        element:
          <ProtectedRoute>
            <PostBlog />
          </ProtectedRoute>
      },

      {
        path: "/MyBlogs",
        element:
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
      },

      {
        path: "/updateDp",
        element:
          <ProtectedRoute>
            <UpdateDp />
          </ProtectedRoute>
      },

      {
        path: "recom",
        element:
          <ProtectedRoute>
            <Recom />
          </ProtectedRoute>
      },

      {
        path: "/chat",
        element:
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
      },

      {
        path: "/chatWith/:id",
        element:
          <ProtectedRoute>
            <ChatWithUser />
          </ProtectedRoute>
      },
      {
        path:"/form",
        element:<Formikk/>
      }
    ]
  },
  {
    path:"/login",
    element:<LogIn/>
  },

  {
    path:"/signup",
    element:<SignUp/>
  }
])

function App() {
  const socket = io("http://localhost:8000", {
    withCredentials: true
  });
  // console.log("App is rendering");
  // const dispatch = useDispatch()
  // useEffect(() => {

  //     const callApi = async()=>{
  //       const userDet = await getUserDetails()
  //       if(userDet){
  //           // user2 = userDet
  //           dispatch(storeUser(userDet));
  //       }
  //     }
  //     callApi()
  //   },[])
  const dispatch = useDispatch()
  useEffect(() => {

    const storeUserr = async () => {
      try {
        const userDet = await getUserDetails()
        if (userDet) {
          dispatch(storeUser(userDet));
        }
      }
      catch (e) {
        console.log(e);

      }
    }
    storeUserr()

  }, [])
  return (
    <div className='w-[1400px] m-auto '>
      <Toaster
        position="top-center"
        toastOptions={{
          
        }}
      />
      {/* <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/blog/:id' element={
          <ProtectedRoute>
            <SingleBlog />
          </ProtectedRoute>
        } />
        <Route path='/postBlog' element={
          <ProtectedRoute>
            <PostBlog />
          </ProtectedRoute>
        } />

        <Route path='/MyBlogs' element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        } />

        <Route path='/chat' element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />

        <Route path='/chatWith/:id' element={
          <ProtectedRoute>
            <ChatWithUser />
          </ProtectedRoute>
        } />

        <Route path='/form' element={<Formikk />} />
        <Route path='/updateDp' element={
          <ProtectedRoute>
            <UpdateDp />
          </ProtectedRoute>
        } />

        <Route path='/recom' element={
          <ProtectedRoute>
            <Recom />
          </ProtectedRoute>
        } />
      </Routes> */}
    </div>
  )
}

export default App
