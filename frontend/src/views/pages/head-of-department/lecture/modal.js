import { Fragment, useContext } from 'react'
import {
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalBody,
  FormFeedback,
  Form
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'

const defaultValues = {
  email: ''
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    //watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleFormOpened = () => {
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
          }
        )
      }
    }
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})

  }

  const validate = (data) => {
    let flag = true
    if (data.email.length === 0) {
      setError('email', {
        message: `${t('Please enter a valid')} ${t('email')}`
      })
      flag = false
    } else {
      // Sử dụng regular expression để kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        setError('email', {
          message: `${t('Please enter a valid email address')}`
        })
        flag = false
      } else {
        // Kiểm tra xem đuôi email có phải là @fpt.edu.vn hoặc @fe.edu.vn không
        const validDomains = ['fpt.edu.vn', 'fe.edu.vn']
        const domain = data.email.split('@')[1]
        if (!validDomains.includes(domain)) {
          setError('email', {
            message: `${t('Email domain must be @fpt.edu.vn or @fe.edu.vn')}`
          })
          flag = false
        }
      }
    }
    return flag
  }

  const onSubmit = data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        api.userRoleSemesterApi.updateOneApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Edit fail'))
          }
        }).catch((e) => {
          console.error('File upload failed', e)
          if (e.response.status === 400) {
            notificationError(e.response.data)
          } else {
            notificationError(t('Edit Lecturer fail'))
          }
        })
      }
    } else {
      if (validate(data)) {
        api.userRoleSemesterApi.createOneApi(data, campus, semester).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add lecturer success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add fail'))
          }
        }).catch((e) => {
          console.error(e)
          if (e.response.status === 400) {
            notificationError(t('The user already has this role this semester!'))
          } else {
            notificationError(t('Add lecturer fail'))
          }
        }
        )
      }
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModal()
  }

  const renderFooterButtons = () => {
    return (
      <Fragment>
        <Button color='primary' className='me-1'>{t('Save')}</Button>
        <Button color='secondary' onClick={handleCancel} outline className='me-1'>{t('Close')}</Button>
      </Fragment>
    )
  }
  return (

    <Fragment >

      <Modal
        isOpen={openModal && typeModal !== 'Import'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add Lecturer' : 'Edit Lecturer'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='email'>
                    {t('email')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='email' placeholder={t('Enter Email')} invalid={errors.email && true} />
                    )}
                  />
                  {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                </Col>
              </Row>
            </div>
          </ModalBody>
          <div
            className='d-flex justify-content-end p-1'
            style={{ boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)' }}
          >
            {renderFooterButtons()}
          </div>
        </Form>
      </Modal>
    </Fragment>

  )
}

export default ModalComponent
