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
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Switch, Space } from 'antd'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  name: '',
  status: true
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    //setDataItem,
    dataItem,
    typeModal
  } = useContext(UserContext)
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
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleFormOpened = () => {
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
            setValue('status', dataItem.status)
          }
        )
      }
    }
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
  }

  const validate = (data) => {
    let flag = true
    //if (data.emailLecture.length === 0) {
    //  setError('emailLecture', {
    //    message: `${t('Please enter a valid')} ${t('Email Lecture')}`
    //  })
    //  flag = false
    //}
    if (data.name.length === 0) {
      setError('name', {
        message: `${t('Please enter a valid')} ${t('Class Name')}`
      })
      flag = false
    }
    return flag
  }
  const onSubmit = data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        api.classesApi.updateOneClassApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit class success'))
            socket.emit('notifications')
          }
        }).catch((e) => {
          if (e.response.data.statusCode === 400) {
            notificationError(t('Class already exists'))
          } else {
            notificationError(t('Edit class fail'))
          }
          console.error('Edit class fail', e)
          //notificationError(t('Edit fail'))
        })
      }
    } else {
      if (validate(data)) {
        api.classesApi.createOneClassApi(data, campus, semester).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add class success'))
            socket.emit('notifications')
          }
        }).catch((e) => {
          if (e.response.data.statusCode === 400) {
            notificationError(t('Class already exists'))
          } else {
            notificationError(t('Add class fail'))
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
        isOpen={openModal}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add My Class' : 'Edit My Class'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Class Name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='name' placeholder={t('Enter Class Name')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='status'>
                    {t('Status')}
                  </Label>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Space id='status' direction="vertical">
                          <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            checked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                            style={{ borderRadius: '20px', background: field.value ? '#7367f0' : 'rgba(0, 0, 0, 0.45)' }}
                            defaultChecked={field.value}
                          />
                        </Space>
                      </div>
                    )}
                  />
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
