// ** React Imports
import { Fragment } from 'react'
import toast from 'react-hot-toast'

export const notificationSuccess = (param) => {
  return (
    toast.success(
      <Fragment>
        <div className="toastify-header">
          <div className="title-wrapper">
            <h6 className="toast-title">{param}</h6>
          </div>
        </div>
        <div className="toastify-body">
          <ul className="list-unstyled mb-0">
            <li></li>
          </ul>
        </div>
      </Fragment>
    )
  )
}

export const notificationError = (param, duration = 7000) => {
  return (
    toast.error(
      <Fragment>
        <div className="toastify-header">
          <div className="title-wrapper">
            <h6 className="toast-title">{param}</h6>
          </div>
        </div>
        <div className="toastify-body">
          <ul className="list-unstyled mb-0">
            <li></li>
          </ul>
        </div>
      </Fragment>,
      {
        duration // Thiết lập thời gian hiển thị
      }
    )
  )
}
