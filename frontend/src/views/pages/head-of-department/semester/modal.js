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
import { DatePicker, Space, Switch } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import dayjs from 'dayjs'
import { notificationError, notificationSuccess } from '../../../../utility/notification'

const { RangePicker } = DatePicker

const defaultValues = {
  name_semester: '',
  startDate: '',
  endDate: '',
  status: true
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
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    // watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const [dateRange, setDateRange] = useState([])
  const handleFormOpened = () => {
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
            if (name === 'name') {
              setValue('name_semester', value)
              setValue('startDate', value)
              setValue('endDate', value)
            }
          }
        )
      }
      const date0 = dayjs(dataItem.startDate, 'YYYY-MM-DD')
      const date1 = dayjs(dataItem.endDate, 'YYYY-MM-DD')
      if (date0 !== null && date1 !== null) {
        setDateRange([date0, date1])
      } else {
        setValue('startDate', undefined)
        setValue('endDate', undefined)
        setDateRange([])
      }
    }
  }

  const handleChangeDate = (dateStrings) => {
    if (dateStrings && dateStrings.length >= 2) {
      const date0 = dayjs(dateStrings[0], 'YYYY-MM-DD')
      const date1 = dayjs(dateStrings[1], 'YYYY-MM-DD')
      if (date0.isValid() && date1.isValid()) {
        setValue("startDate", date0.format('YYYY-MM-DD'))
        setValue("endDate", date1.format('YYYY-MM-DD'))
        setDateRange([date0, date1])
        clearErrors('date')
      }
    } else {
      setValue("startDate", undefined)
      setValue("endDate", undefined)
      setDateRange([])
    }
  }
  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
    setDateRange([])
  }

  const validate = (data) => {
    let flag = true
    if (data.name_semester.length === 0) {
      setError('name_semester', {
        message: `${t('Please enter a valid')} ${t('semester')}`
      })
      flag = false
    }
    if (!data.startDate || !data.endDate) {
      setError('date', {
        message: `${t('Please enter a valid')} ${t('date')}`
      })
      flag = false
    } else {
      const date0 = dayjs(data.startDate, 'YYYY-MM-DD')
      const date1 = dayjs(data.endDate, 'YYYY-MM-DD')

      const diffMonths = date1.diff(date0, 'months', true)
      if (diffMonths < 1) {
        setError('date', {
          message: 'The period must be at least 1 month'
        })
        flag = false
      } else {
        clearErrors('date')
      }
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
        api.semesterApi.updateSemesterApi(data, campus, dataItem.semester_id).then((rs) => {
          if (rs === "Semester updated successfully!") {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit success'))
          } else {
            notificationError(t('Edit fail'))
          }
        }).catch((e) => {
          if (e.response.status === 400) {
            notificationError(t(e.response.data))
          } else {
            notificationError(t('Add fail'))
          }
        })
      }
    } else {
      if (validate(data)) {
        api.semesterApi.createSemesterApi(data, campus).then((rs) => {
          if (rs === "Create Semester Successfull!") {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add success'))
          } else {
            notificationError(t('Add fail'))
          }
        }).catch((e) => {
          if (e.response.status === 400) {
            notificationError(t(e.response.data))
          } else {
            notificationError(t('Add fail'))
          }
        }
        )
      }
    }
  }
  const disabledDate = (current) => {
    // Hàm kiểm tra ngày có thể chọn
    return current && current < dayjs().startOf('day')
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
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Semester' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='gy-1 pt-75'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name_semester'>
                    {t('Semester name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='name_semester'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='name_semester' placeholder={t('Enter semester name')} invalid={errors.name_semester && true} />
                    )}
                  />
                  {errors.name_semester && <FormFeedback>{errors.name_semester.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label me-1' for='date'>
                    {t('Date')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <br />
                  <RangePicker
                    name='date'
                    style={{
                      width: '100%'
                    }}
                    onChange={handleChangeDate}
                    format="DD-MM-YYYY"
                    value={dateRange}
                    className={errors.date ? 'is-invalid' : ''}
                    disabledDate={disabledDate}
                  />
                  {errors.date && <FormFeedback>{errors.date.message}</FormFeedback>}
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
                      //<Input {...field} id='emailLecture' placeholder={t('Enter Email Lecture')} invalid={errors.emailLecture && true} />
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
