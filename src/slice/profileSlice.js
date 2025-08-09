import {createSlice} from "@reduxjs/toolkit"

// initial State 
 const initialState = {
    user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading:false
 }

 const profileSlice = createSlice({
   name:"user",
   initialState:initialState,
   reducers:{
    setUser(state,value){
      state.user=value.payload
    },
    setLoading(state,value){
      state.loading=value.payload
    }
   }
 })
 export const {setUser, setLoading} = profileSlice.actions;
 export default profileSlice.reducer;