// ** React Imports
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
/* eslint-disable no-unused-vars */
// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { sendMsg, selectChat } from './store'
import { useDispatch } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MessageSquare, Menu, PhoneCall, Video, Search, MoreVertical, Mic, Image, Send } from 'react-feather'
import { getUserData } from '@utils'
// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText
} from 'reactstrap'
import { getSocket } from '../../../serviceWorker'
const ChatLog = props => {
  // ** Props & Store
  const { handleUser, handleUserSidebarRight, handleSidebar, store, userSidebarLeft } = props
  const { userProfile, selectedUser } = store

  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const dispatch = useDispatch()
  const socket = getSocket()
  // ** State
  const [msg, setMsg] = useState('')
  const user = getUserData()
  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length
    if (selectedUserLen) {
      scrollToBottom()
    }
  }, [selectedUser])

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      dispatch(selectChat(+data.roomId))
    })
    return () => {
      socket.off('receiveMessage')
    }
  }, [socket])
  const formattedChatData = () => {
    let chatLog = []
    if (selectedUser.chats) {
      chatLog = selectedUser.chats
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].sender_id : undefined
    const chatMessageSenderName = chatLog[0] ? chatLog[0].User.email : undefined
    const chatMessageSenderAvatar = chatLog[0] ? chatLog[0].User.avatar : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      senderName: chatMessageSenderName,
      senderAvatar: chatMessageSenderAvatar,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.sender_id) {
        msgGroup.messages.push({
          msg: msg.content,
          time: msg.createdAt
        })
      } else {
        chatMessageSenderId = msg.sender_id
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.sender_id,
          senderName: `${msg.User.last_name} ${msg.User.first_name}(${msg.User.email})`,
          senderAvatar: msg.User.avatar,
          messages: [
            {
              msg: msg.content,
              time: msg.createdAt
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.senderId !== user.user_id
          })}
        >
          <div className='chat-avatar'>
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className='box-shadow-1 cursor-pointer'
              img={item.senderId === user.user_id ? item.senderAvatar : item.senderAvatar}
            />
          </div>

          <div className='chat-body'>
            {item.senderId !== user.user_id && (
              <div className='chat-email'>
                <span>{item.senderName}</span>
              </div>
            )}
            {item.messages.map((chat, index) => (
              <div key={index} className='chat-content'>
                <p>{chat.msg}</p>
              </div>
            ))}
          </div>
        </div>
      )
    })
  }

  const handleAvatarClick = obj => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  const handleStartConversation = () => {
    if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth < 992) {
      handleSidebar()
    }
  }

  const handleSendMsg = e => {
    e.preventDefault()
    if (msg.trim().length) {
      dispatch(sendMsg({ ...selectedUser, content: msg }))
      socket.emit('sendMessage', {
        roomId: selectedUser.contact.id,
        message: {
          senderId: user.user_id,
          senderName: user.email,
          senderAvatar: user.avatar,
          messages: [
            {
              msg,
              time: new Date().toISOString()
            }
          ]
        }
      })
      setMsg('')
    }
  }

  const ChatWrapper = Object.keys(selectedUser).length && selectedUser.chats ? PerfectScrollbar : 'div'

  return (
    <div className='chat-app-window'>
      <div className={classnames('start-chat-area', { 'd-none': Object.keys(selectedUser).length })}>
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
          Start Conversation
        </h4>
      </div>
      {Object.keys(selectedUser).length ? (
        <div className={classnames('active-chat', { 'd-none': selectedUser === null })}>
          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div className='sidebar-toggle d-block d-lg-none me-1' onClick={handleSidebar}>
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight='36'
                  imgWidth='36'
                  // img={selectedUser.contact.avatar}
                  className='avatar-border user-profile-toggle m-0 me-1'
                // onClick={() => handleAvatarClick(selectedUser.contact)}
                />
                <h6 className='mb-0'>{selectedUser.contact.name}</h6>
              </div>
            </header>
          </div>

          <ChatWrapper ref={chatArea} className='user-chats' options={{ wheelPropagation: false }}>
            {selectedUser.chats ? <div className='chats'>{renderChats()}</div> : null}
          </ChatWrapper>

          <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
            <InputGroup className='input-group-merge me-1 form-send-message'>
              <InputGroupText>
                <Mic className='cursor-pointer' size={14} />
              </InputGroupText>
              <Input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder='Type your message or use speech to text'
              />
              <InputGroupText>
                <Label className='attachment-icon mb-0' for='attach-doc'>
                  <Image className='cursor-pointer text-secondary' size={14} />
                  <input type='file' id='attach-doc' hidden />
                </Label>
              </InputGroupText>
            </InputGroup>
            <Button className='send' color='primary'>
              <Send size={14} className='d-lg-none' />
              <span className='d-none d-lg-block'>Send</span>
            </Button>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default ChatLog
