import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Features/UserSlice"
import BlogReducer from "../Features/BlogSlice"
export const store = configureStore({
    reducer:{
        user:UserReducer,
        blog:BlogReducer
    }
})