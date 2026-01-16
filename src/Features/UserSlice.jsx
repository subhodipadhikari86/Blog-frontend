import { createSlice } from "@reduxjs/toolkit";
export const Userslice = createSlice({
    name:'user',
    initialState:{
        userInfo:null
    },
    reducers:{
        storeUser:(state,action)=>{
            state.userInfo = action.payload
            // console.log(state.userInfo);
            
        }
    }
})


export const {storeUser} = Userslice.actions

export default Userslice.reducer
