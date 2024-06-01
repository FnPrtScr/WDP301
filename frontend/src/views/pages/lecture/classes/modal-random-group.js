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
  not: ''
}

const ModalRandomGroup = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    //setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()
  const socket = getSocket()
  const semester = window.localStorage.getItem('semester')
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
    const notValue = parseInt(data.not, 10)
    if (isNaN(notValue) || notValue <= 0) {
      setError('not', {
        message: `${t('Please enter a valid')} ${t('number of team')}`
      })
      flag = false
    }
    return flag
  }

  const onSubmit = data => {
    if (typeModal === "Random") {
      if (validate(data)) {
        api.teamApi.randomTeamApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add random group success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add random group fail'))
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
        isOpen={openModal && typeModal === 'Random'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Random' ? 'Add Random Group' : 'Edit Random Group'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='not'>
                    {t('Number Of Team')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='not'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='not' placeholder={t('Enter Number Of Team')} invalid={errors.not && true} />
                    )}
                  />
                  {errors.not && <FormFeedback>{errors.not.message}</FormFeedback>}
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
export default ModalRandomGroup
