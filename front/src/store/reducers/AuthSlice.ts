import {jwtDecode} from "jwt-decode";
import type IUser from "../../models/IUser.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const getUserFromToken = (token: string) : IUser | null=>{
    try{
        const decode =  jwtDecode<IUser>(token)
        return decode ?? null;
    }
    catch(err){
        console.error(err);
        return null;
    }
}
const token : string = localStorage.token;
const user = getUserFromToken(token);
const initialState  = {
    user : user
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);
            if (user) {
                state.user = user;
                localStorage.token = action.payload;
            }
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
        },
    }

});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;