import { Fragment, useContext, useState } from 'react'
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
import { RequestContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  feedback: ''
}
import classnames from 'classnames'
const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal
  } = useContext(RequestContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [valueF, setValueF] = useState('')

  const socket = getSocket()
  const {
    control,
    clearErrors,
    handleSubmit,
    setValue,
    //watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })


  const handleFormOpened = () => {
    if (typeModal === "Approve" || typeModal === 'Reject') {
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
    setDataItem({})
    setValueF('')
  }

  const onSubmit = () => {
    if (typeModal === 'Approve') {
      api.requestApi.acceptOrRejectApi({ key: dataItem.key, status: true, note: valueF }, campus, semester)
        .then(() => {
          notificationSuccess(t('Approve success'))
          socket.emit('notifications')
          handleLoadTable()
          handleModal()
        }).catch((e) => {
          if (e.response.status === 400) {
            notificationError(e.response.data.error)
          } else {
            notificationError(t('Approve fail'))
          }
        })
    } else {
      api.requestApi.acceptOrRejectApi({ key: dataItem.key, status: false, note: valueF }, campus, semester)
        .then(() => {
          notificationSuccess(t('Rejected success'))
          socket.emit('notifications')
          handleLoadTable()
          handleModal()
        }).catch(() => {
          notificationError(t('Rejected fail'))
        })
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
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Approve' ? 'Are you sure to Approve this request?' : 'Are you sure to Reject this request?'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='feedback'>
                    {t('Feedback')}
                  </Label>
                  <Controller
                    name='feedback'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field} id='feedback' placeholder={t('Enter Feedback')} invalid={errors.feedback && true}
                        name='text'
                        value={valueF}
                        type='textarea'
                        style={{ minHeight: '100px' }}
                        onChange={e => setValueF(e.target.value)}
                        className={classnames({ 'text-danger': valueF?.length > 1000 })}
                      />)}
                  />
                  <span
                    className={classnames('textarea-counter-value float-end', {
                      'bg-danger': valueF?.length > 1000
                    })}
                  >
                    {`${valueF?.length ?? '0'}/1000`}
                  </span>
                  {errors.feedback && <FormFeedback>{errors.feedback.message}</FormFeedback>}
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
