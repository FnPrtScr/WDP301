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
  name: ''
}

const ModalCreateGroup = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    //setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()
  const socket = getSocket()
  const semester_id = window.localStorage.getItem('semester')
  const campus = window.localStorage.getItem('campus')
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
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    //setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    if (data.name.length === 0) {
      setError('name', {
        message: `${t('Please enter a valid')} ${t('group name')}`
      })
      flag = false
    }
    return flag
  }
  const onSubmit = data => {
    if (typeModal === "AddTeam") {
      if (validate(data)) {
        api.teamApi.createOneApi(data, campus, semester_id, dataItem.key).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add group success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add group fail'))
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
        isOpen={openModal && typeModal === 'AddTeam'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'AddTeam' ? 'Add Team' : 'Edit Team'} />
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
                      <Input {...field} id='name' placeholder={t('Enter group name')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
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
export default ModalCreateGroup
