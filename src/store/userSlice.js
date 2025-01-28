// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    name: '',
    email: '',
    // Aggiungi altri campi utente se necessario
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            // Aggiorna altri campi utente se necessario
        },
        clearUser(state) {
            state.id = null;
            state.name = '';
            state.email = '';
            // Resetta altri campi utente se necessario
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const UserSelector = (state) => state.user; // Selettore per ottenere lo stato utente

export default userSlice.reducer;
