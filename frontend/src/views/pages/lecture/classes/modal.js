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
  email_student: '',
  code: ''
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
    if (typeModal === "UpdateStudent") {
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
    if (data.email_student.length === 0) {
      setError('email_student', {
        message: `${t('Please enter a valid')} ${t('email')}`
      })
      flag = false
    } else {
      // Sử dụng regular expression để kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email_student)) {
        setError('email_student', {
          message: `${t('Please enter a valid email address')}`
        })
        flag = false
      } else {
        // Kiểm tra xem đuôi email có phải là @fpt.edu.vn hoặc @fe.edu.vn không
        const validDomains = ['fpt.edu.vn', 'fe.edu.vn']
        const domain = data.email_student.split('@')[1]
        if (!validDomains.includes(domain)) {
          setError('email_student', {
            message: `${t('Email domain must be @fpt.edu.vn or @fe.edu.vn')}`
          })
          flag = false
        }
      }
    }
    if (data.code.length === 0) {
      setError('code', {
        message: `${t('Please enter a valid')} ${t('code')}`
      })
      flag = false
    }
    return flag
  }
  const onSubmit = data => {
    if (typeModal === "UpdateStudent") {
      if (validate(data)) {
        api.classesApi.updateStudentInMyClassApi({ email_student: data.email_student, code: data.code }, campus, semester, dataItem.class_id, dataItem.key).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit student success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Edit student fail'))
          }
        }).catch((e) => {
          notificationError(t('Edit student fail'))
          console.error('Edit student fail', e)
          //notificationError(t('Edit fail'))
        })
      }
    } else {
      if (validate(data)) {
        api.classesApi.CreateOneStudentIntoClassApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add student success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Student already exists in Class!'))
          }
        }).catch((e) => {
          if (e.response.status === 500) {
            notificationError(e.response.data.message)
          } else {
            notificationError(t('Student already exists in Class!'))
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
        isOpen={openModal && (typeModal === 'AddStudent' || typeModal === 'UpdateStudent')}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'AddStudent' ? 'Add Student Into Class' : 'Edit Student'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='email_student'>
                    {t('Student email')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='email_student'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='email_student' placeholder={t('Enter Email Student')} invalid={errors.email_student && true} />
                    )}
                  />
                  {errors.email_student && <FormFeedback>{errors.email_student.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='code'>
                    {t('Student code')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='code'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='code' placeholder={t('Enter Email Student')} invalid={errors.code && true} />
                    )}
                  />
                  {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
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
