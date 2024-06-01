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
  Form,
  Card
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import { notificationError, notificationSuccess } from '../../../utility/notification'
// import moment from 'moment'
import ModalHeader from '../../../@core/components/modal-header'
import { Select } from 'antd'

const defaultValues = {
  departmentName: '',
  code: '',
  description: ''
}

const ModalComponent = () => {
  // const [listBoxUser, setListBoxUser] = useState([])

  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()

  // const optionStatus = [
  //   { value: 0, label: t('Inactive') },
  //   { value: 1, label: t('Active') }
  // ]

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
            if (name === 'name') {
              setValue('departmentName', value)
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
  }

  const validate = (data) => {
    let flag = true
    if (data.code.length === 0) {
      setError('code', {
        message: `${t('Please enter a valid')} ${t('code')}`
      })
      flag = false
    }
    if (data.departmentName.length === 0) {
      setError('departmentName', {
        message: `${t('Please enter a valid')} ${t('departmentName')}`
      })
      flag = false
    }
    return flag
  }
  // const getLocalDate = (date) => {
  //   date = new Date(date)
  //   return new Date(Date.UTC(date?.getFullYear(), date?.getMonth(), date?.getDate(), date?.getHours(), date.getMinutes(), date?.getSeconds()))
  // }

  const onSubmit = data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        api.departmentApi.EditApi({ ...data, departmentId: data?.department_id }).then((rs) => {
          if (rs.status.code === "SUCCESS") {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit success'))
          } else {
            notificationError(t('Edit fail'))
          }
        }).catch((e) => {
          if (e.response.data.status.message === 'Department code is existing') {
            setError('code', {
              message: t('Department code is existing')
            })
          }
          notificationError(t('Edit fail'))
        })
      }
    } else {
      if (validate(data)) {
        api.departmentApi.AddApi(data).then((rs) => {
          if (rs.status.code === "SUCCESS") {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add success'))
          } else {
            notificationError(t('Add fail'))
          }
        }).catch((e) => {
          if (e.response.data.status.message === 'Department code is existing') {
            setError('code', {
              message: t('Department code is existing')
            })
          }
          if (e.response.data.status.message === 'The department name exist!') {
            setError('departmentName', {
              message: t('Department name is existing')
            })
          }
          notificationError(t('Add fail'))
        }
        )
      }
    }


  }

  const handleCancel = () => {
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
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Department' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='gy-1 pt-75'>

                <Col md={12} xs={12}>
                  <Label className='form-label' for='code'>
                    {t('Department code')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='code'
                    control={control}
                    render={({ field }) => (
                      <Input disabled={typeModal === 'Edit' ?? false} {...field} id='code' placeholder={t('Enter department code')} invalid={errors.code && true} />
                    )}
                  />
                  {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                </Col>

                <Col md={12} xs={12}>
                  <Label className='form-label' for='departmentName'>
                    {t('Department name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='departmentName'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='departmentName' placeholder={t('Enter department name')} invalid={errors.departmentName && true} />
                    )}
                  />
                  {errors.departmentName && <FormFeedback>{errors.departmentName.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='description'>
                    {t('Description')}
                  </Label>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="textarea" id='phone' placeholder={t('Enter description')} invalid={errors.description && true} />
                    )}
                  />
                  {errors.description && <FormFeedback>{`${t('Please enter a valid')} ${t('description')}`}</FormFeedback>}
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
