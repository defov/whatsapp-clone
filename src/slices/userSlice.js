import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  messageReceiver: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setMessageReceiver: (state, action) => {
        state.messageReceiver = action.payload
    }
  },
});

export const { setCurrentUser, setMessageReceiver } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;

export const selectMessageReceiver = (state) => state.user.messageReceiver;

export default userSlice.reducer;
