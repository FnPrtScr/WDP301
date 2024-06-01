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
import { DatePicker } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../../api'
import ModalHeader from '../../../../../@core/components/modal-header'
import dayjs from 'dayjs'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
import { getSocket } from '../../../../../serviceWorker'

const { RangePicker } = DatePicker

const defaultValues = {
  startDate: '',
  endDate: ''
}

const ModalDeadlineComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)

  const { t } = useTranslation()
  const socket = getSocket()
  const {
    //control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    // watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')

  const [startSemester, setStartSemester] = useState(null)
  const [endSemester, setEndSemester] = useState(null)
  const [dateRange, setDateRange] = useState([])
  const handleFormOpened = () => {
    api.semesterApi.getDeadlineSemesterApi({}, campus, semester).then((rs) => {
      setStartSemester(dayjs(rs.data.startDate).format('YYYY-MM-DD HH:mm:ss'))
      setEndSemester(dayjs(rs.data.endDate).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'))
    }).catch(() => {
    })
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
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
    if (!data.startDate || !data.endDate) {
      setError('date', {
        message: `${t('Please enter a valid')} ${t('date')}`
      })
      flag = false
    } else {
      const date0 = dayjs(data.startDate, 'YYYY-MM-DD')
      const date1 = dayjs(data.endDate, 'YYYY-MM-DD')

      const diffWeeks = date1.diff(date0, 'weeks', true)
      if (diffWeeks < 2) {
        setError('date', {
          message: 'The period must be at least 2 weeks'
        })
        flag = false
      } else {
        clearErrors('date')
      }
    }
    return flag
  }

  const onSubmit = data => {
    const milestoneId = +dataItem.milestoneId
    if (validate(data)) {
      api.iterationApi.setDeadlineForIterationApi(data, campus, semester, milestoneId, dataItem.classId).then((rs) => {
        if (rs.statusCode === 201) {
          handleLoadTable()
          setDataItem({ ...dataItem, ...data })
          handleModal()
          notificationSuccess(t('Set deadline success'))
          socket.emit('notifications')
        } else {
          notificationError(t('Set deadline fail'))
        }
      }).catch((e) => {

        if (e.response.data.statusCode === 404) {
          notificationError(t('Milestone not found'))
        } else {
          notificationError(t('Edit class fail'))
        }
      }
      )
    }
  }
  const disabledDate = (current) => {
    // Hàm kiểm tra ngày có thể chọn
    return current && (current.isBefore(startSemester) || current.isAfter(endSemester))
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
        isOpen={openModal && typeModal === 'Deadline'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Add deadline for iteration' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='gy-1 pt-75'>
                <Col md={12} xs={12}>
                  <Label className='form-label me-1' for='date'>
                    {t('Input deadline')} <span style={{ color: 'red' }}>*</span>
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

export default ModalDeadlineComponent
