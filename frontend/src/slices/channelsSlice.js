import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

export const channelsAdapter = createEntityAdapter();

const defaultChannelId = 1;

const initialState = channelsAdapter.getInitialState({ currentChannelId: defaultChannelId });

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    setCurrentChannel: (state, { payload }) => {
      const currentState = state;
      currentState.currentChannelId = payload;
    },
    renameChannel: channelsAdapter.setOne,
    removeChannel: (state, { payload }) => {
      const currentState = state;
      channelsAdapter.removeOne(currentState, payload);
      if (currentState.currentChannelId === payload) {
        currentState.currentChannelId = defaultChannelId;
      }
    },
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
