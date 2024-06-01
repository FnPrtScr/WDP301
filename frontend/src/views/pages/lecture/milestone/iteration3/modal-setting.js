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
import api from '../../../../../api'
import ModalHeader from '../../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
import { getSocket } from '../../../../../serviceWorker'
const defaultValues = {
  sourceanddemo: undefined,
  document: undefined,
  product: undefined
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
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()
  const handleFormOpened = () => {
    api.iterationApi.getSettingApi({}, campus, semester, dataItem.iteration_id, dataItem.classId).then((rs) => {
      if (rs.statusCode === 200) {
        setValue('sourceanddemo', rs.data.sourceanddemo)
        setValue('document', rs.data.document)
        setValue('product', rs.data.product)
      } else {
        notificationError(t('Get defautl setting for iteration1 fail'))
      }
    }).catch((e) => {
      if (e.response.data.statusCode === 404) {
        notificationError(t('No iteration found'))
      } else if (e.response.data.statusCode === 400) {
        notificationError(t('The sum of the top 3 percentages must equal 100%.'))
      } else {
        notificationError(t('Get defautl setting for iteration1 fail'))
      }
    }
    )
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    //setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    const sourceanddemoValue = parseInt(data.sourceanddemo, 10)
    const documentValue = parseInt(data.document, 10)
    const productValue = parseInt(data.product, 10)
    if (isNaN(sourceanddemoValue) || sourceanddemoValue <= 0) {
      setError('sourceanddemo', {
        message: `${t('Please enter a valid')} ${t('sourceanddemo')}`
      })
      flag = false
    }
    if (isNaN(documentValue) || documentValue <= 0) {
      setError('document', {
        message: `${t('Please enter a valid')} ${t('document')}`
      })
      flag = false
    }
    if (isNaN(productValue) || productValue <= 0) {
      setError('product', {
        message: `${t('Please enter a valid')} ${t('product')}`
      })
      flag = false
    }
    return flag
  }

  const onSubmit = data => {
    if (typeModal === "Setting") {
      if (validate(data)) {
        api.iterationApi.settingIterationApi(data, campus, semester, dataItem.iteration_id, dataItem.classId).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add setting for iteration1 success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add setting for iteration1 fail'))
          }
        }).catch((e) => {
          if (e.response.data.statusCode === 404) {
            notificationError(t('No iteration found'))
          } else if (e.response.data.statusCode === 400) {
            notificationError(t('The sum of the top 3 percentages must equal 100%.'))
          } else {
            notificationError(t('Add setting for iteration1 fail'))
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
        isOpen={openModal && typeModal === 'Setting'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Setting' ? 'Add Setting for iteration1' : 'Edit Setting for iteration1'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='sourceanddemo'>
                    {t('Source and Demo')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='sourceanddemo'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='sourceanddemo' placeholder={t('Enter source and demo')} invalid={errors.sourceanddemo && true} />
                    )}
                  />
                  {errors.sourceanddemo && <FormFeedback>{errors.sourceanddemo.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='document'>
                    {t('Document')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='document'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='document' placeholder={t('Enter Document')} invalid={errors.document && true} />
                    )}
                  />
                  {errors.document && <FormFeedback>{errors.document.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='product'>
                    {t('Product')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='product'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='product' placeholder={t('Enter product')} invalid={errors.product && true} />
                    )}
                  />
                  {errors.product && <FormFeedback>{errors.product.message}</FormFeedback>}
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
