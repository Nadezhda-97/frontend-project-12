import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    extraReducers: (builder) => {
      builder.addCase(channelActions.removeChannel, (state, { payload }) => {
        const removingMessagesIds = Object.values(state.entities)
          .filter((message) => message.channelId === payload)
          .map((message) => message.id);
        messagesAdapter.removeMany(state, removingMessagesIds);
      });
    },
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
