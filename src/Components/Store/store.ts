import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import Permission from './permissionsSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    permission:Permission
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
