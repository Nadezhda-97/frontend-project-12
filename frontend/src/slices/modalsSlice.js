import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalsAdapter = createEntityAdapter();
const initialState = modalsAdapter.getInitialState({ modalType: null, channel: null });

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload: { modalType, channel = null } }) => {
      const currentState = state;
      currentState.modalType = modalType;
      currentState.channel = channel;
    },
    hideModal: (state) => {
      const currentState = state;
      currentState.modalType = null;
      currentState.channel = null;
    },
  },
});

export const { actions } = modalsSlice;
export const selectors = modalsAdapter.getSelectors((state) => state.modals);
export default modalsSlice.reducer;
