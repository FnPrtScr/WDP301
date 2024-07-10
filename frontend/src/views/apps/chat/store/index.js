// ** Redux Imports
/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AUTH } from '../../../../api/constants'
import api from '../../../../api'
const { CHAT_GROUP_API } = AUTH
// ** Axios Imports
import axios from 'axios'
const campus = window.localStorage.getItem('campus')
const semester = window.localStorage.getItem('semester')
export const getUserProfile = createAsyncThunk('appChat/getTasks', async () => {
  const response = await axios.get('/apps/chat/users/profile-user')
  return response.data
})

export const getChatContacts = createAsyncThunk('appChat/getChatContacts', async () => {
  const response = await api.chatGroupApi.getAllChatGroup({}, campus, semester)
  return response.data
})

export const selectChat = createAsyncThunk('appChat/selectChat', async (id, { dispatch }) => {
  const response = await api.chatGroupApi.getChat({}, campus, semester, id)
  await dispatch(getChatContacts())
  return response.data
})

export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj, { dispatch }) => {
  const response = await api.chatGroupApi.createMessage(obj, campus, semester, obj.contact.id)
  await dispatch(selectChat(obj.contact.id))
  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: [],
    contacts: [],
    userProfile: {},
    selectedUser: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
      })
      .addCase(getChatContacts.fulfilled, (state, action) => {
        state.chats = action.payload.chatsContacts
        state.contacts = action.payload.contacts
      })
      .addCase(selectChat.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
  }
})

export default appChatSlice.reducer
