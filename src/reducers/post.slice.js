import { createSlice } from '@reduxjs/toolkit';

// Definizione del reducer per i post
const postsSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
        addPost: (state, action) => {
            state.push(action.payload); // Aggiunge il nuovo post alla lista
        }
    }
});

// Esporta le azioni e il reducer
export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
