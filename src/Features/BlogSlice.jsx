import { createSlice } from "@reduxjs/toolkit";
export const blogSlice = createSlice({
    name:"recomBlog",
    initialState:{
        text:"",
        mainBlogArr:[]
    },
    reducers:{
        storetext:(state,action)=>{
            state.text = action.payload
        },
        storeBlog:(state,action)=>{
            state.mainBlogArr = action.payload;
        }
    }
})
export const {storeBlog,storetext} = blogSlice.actions
export default blogSlice.reducer