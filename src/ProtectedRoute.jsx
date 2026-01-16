import react, { Children } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeUser } from "./Features/UserSlice";
import { getUserDetails } from "./ApiCall";
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()


  const dispatch = useDispatch()
  useEffect(() => {

    const callApi = async () => {
      const userDet = await getUserDetails()
      if (userDet) {
        // user2 = userDet
        dispatch(storeUser(userDet));
      } else {
        navigate("/login")
      }
    }
    callApi()
  }, [])

  return (
    children
  )
}
export default ProtectedRoute