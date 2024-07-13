// ** React Imports
import { useState, useEffect } from 'react'
/* eslint-disable no-unused-vars */
// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { selectChat } from './store'
import { useDispatch } from 'react-redux'
import { getSocket } from '../../../serviceWorker'
// ** Utils
import { formatDateToMonthShort, isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Search, CheckSquare, Bell, User, Trash } from 'react-feather'
import api from '../../../api'
// ** Reactstrap Imports
import { CardText, InputGroup, InputGroupText, Badge, Input, Button, Label } from 'reactstrap'

const SidebarLeft = props => {
  // ** Props & Store
  const { store, sidebar, handleSidebar, userSidebarLeft } = props
  // const { chats, contacts, userProfile } = store
  const [chats, setChats] = useState([])
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  // ** Dispatch
  const dispatch = useDispatch()
  const socket = getSocket()
  // ** State
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [filteredChat, setFilteredChat] = useState([])

  const handleUserClick = id => {
    socket.emit('joinRoom', id)
    dispatch(selectChat(id))
    setActive(id)
    if (sidebar === true) {
      handleSidebar()
    }
  }

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store.selectedUser.chat.id)
      } else {
        setActive(store.selectedUser.contact.id)
      }
    }
  }, [])
  const fetchDataChats = () => {
    api.chatGroupApi.getAllChatGroup({}, campus, semester)
      .then((rs) => {
        setChats(rs.data)
      })
      .catch(() => {
      })
  }
  useEffect(() => {
    fetchDataChats()
  }, [campus, semester])
  // ** Renders Chat
  const renderChats = () => {
    if (chats && chats.length) {
      if (query.length && !filteredChat.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Chats Found</h6>
          </li>
        )
      } else {
        const arrToMap = query.length && filteredChat.length ? filteredChat : chats

        return arrToMap.map(item => {

          return (
            <li
              key={item.chat_group_id}
              onClick={() => handleUserClick(item.chat_group_id)}
              className={classnames({
                active: active === item.chat_group_id
              })}
            >
              <Avatar img={item.avatar} imgHeight='42' imgWidth='42' status={item.status ? 'online' : 'offline'} />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.Class.name}</h5>
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }
  return store ? (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <InputGroup className='input-group-merge ms-1 w-100'>
                <InputGroupText className='round'>
                  <Search className='text-muted' size={14} />
                </InputGroupText>
                <Input
                  value={query}
                  className='round'
                  placeholder='Search or start a new chat'
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            <h4 className='chat-list-title'>Chats</h4>
            <ul className='chat-users-list chat-list media-list'>{renderChats()}</ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  ) : null
}

export default SidebarLeft
