import { createSlice } from "@reduxjs/toolkit";
const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      return null;
    },
  },
});

export default feedSlice.reducer;
export const { addFeed } = feedSlice.actions;
