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
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  email_student: ''
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    //setDataItem,
    dataItem,
    typeModal } = useContext(ProjectContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()

  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    //setValue,
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
            if (name === 'name') {
              setValue('name', value)
            }
          }
        )
      }
    }
  }
  const handleModalClosed = () => {
    clearErrors()
    reset()
    //setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    //if (data.emailLecture.length === 0) {
    //  setError('emailLecture', {
    //    message: `${t('Please enter a valid')} ${t('Email Lecture')}`
    //  })
    //  flag = false
    //}
    if (data.email_student.length === 0) {
      setError('email_student', {
        message: `${t('Please enter a valid')} ${t('Email Student')}`
      })
      flag = false
    }
    return flag
  }
  const onSubmit = data => {
    if (typeModal === "AddStudent") {
      //  if (validate(data)) {
      //    api.classesApi.updateOneClassesApi(data, campus, semester, dataItem.key).then((rs) => {
      //      if (rs.success === true) {
      //        handleLoadTable()
      //        handleModal()
      //        notificationSuccess(t('Edit class success'))
      //      } else {
      //        notificationError(t('Edit class fail'))
      //      }
      //    }).catch((e) => {
      //      notificationError(t('Edit class fail'))
      //      console.error('Edit class fail', e)
      //      //notificationError(t('Edit fail'))
      //    })
      //  }
      //} else {
      if (validate(data)) {
        api.classesApi.CreateOneStudentIntoClassApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add student success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add student fail'))
          }
        }).catch(() => {
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
        isOpen={openModal && typeModal === 'AddStudent'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add Student Into Class' : 'Edit Class'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='email_student'>
                    {t('Class Name')} <span style={{ color: 'red' }}>*</span>
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
                {/*<Col md={12} xs={12}>
                  <Label className='form-label' for='emailLecture'>
                    {t('email Lecture')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='emailLecture'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='emailLecture' placeholder={t('Enter Email Lecture')} invalid={errors.emailLecture && true} />
                    )}
                  />
                  {errors.emailLecture && <FormFeedback>{errors.emailLecture.message}</FormFeedback>}
                </Col>*/}
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
