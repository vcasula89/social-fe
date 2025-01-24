import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: {
        email: null,
        displayName: null,
        id: null,
        avatarUrl: null,
        accessToken: null,
        refreshToken: null,
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        clearUser: () => initialState
    }
})

export const {setUser, clearUser} = userSlice.actions;

export const UserSelector = (state) => state.user.user;

export default userSlice.reducer;