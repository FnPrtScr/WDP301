import { Fragment, useState, useEffect } from 'react'
import Avatar from '@components/avatar'
/*eslint-disable */
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import io from 'socket.io-client'
import api from '../../../../api'
import { PUBLIC_URL_SERVER } from '../../../../dataConfig'
import { getSocket } from '../../../../serviceWorker'
import dayjs from 'dayjs'
const NotificationDropdown = () => {
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [notifications, setNotifications] = useState([]);
  const fetchDataNoti = () => {
    api.notificationApi.getAllNoti({}, campus, semester)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }
  useEffect(() => {
    fetchDataNoti();
    const socket = getSocket();
    socket.on('notifications', () => {
      fetchDataNoti();
      setNotifications((prevNotifications) => [...prevNotifications]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const calculateTimeDifference = (createdAt) => {
    const notificationTime = dayjs(createdAt);
    const now = dayjs();
    const diffMinutes = now.diff(notificationTime, 'minute');
    let result;

    if (Math.abs(diffMinutes) >= 1440) {
      result = Math.floor(Math.abs(diffMinutes) / 1440) + ' ngày trước';
    } else if (Math.abs(diffMinutes) >= 60) {
      result = Math.floor(Math.abs(diffMinutes) / 60) + ' giờ trước';
    } else {
      result = Math.abs(diffMinutes) + ' phút trước';
    }

    return result;
  }
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notifications.map((item, index) => {
          return (
            <a
              key={index}
              className='d-flex'
              onClick={e => {
                if (!item.content) {
                  e.preventDefault()
                }
              }}
            >
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.content,
                  'align-items-center': item.content
                })}
              >
                {!item.content ? (
                  <Fragment>
                    <div className='me-1'>
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                            ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                            : item.avatarIcon
                              ? {
                                icon: item.avatarIcon,
                                color: item.color
                              }
                              : null)}
                      />
                    </div>
                    <div className='list-item-body flex-grow-1'>
                      {item.content}
                      <small className='notification-text'>{calculateTimeDifference(item.createdAt)}</small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.content}
                    <small className='notification-text'>{calculateTimeDifference(item.createdAt)}</small>
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        <Badge pill color='danger' className='badge-up'>
          {notifications.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Notifications</h4>
            <Badge tag='div' color='light-primary' pill>
              {notifications.length} New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
          <Button color='primary' block>
            Read all notifications
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
