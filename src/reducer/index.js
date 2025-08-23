import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slice/authSlice';
import profileSlice from '../slice/profileSlice';
import cartSlice from '../slice/cartSlice';
import courseReducer from '../slice/courseSlice';

const rootReducer = combineReducers({
  auth:authReducer,
  profile:profileSlice,
  cart:cartSlice,
  course:courseReducer,
})

export default rootReducer;