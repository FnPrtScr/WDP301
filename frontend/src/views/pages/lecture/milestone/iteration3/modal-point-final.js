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
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../../api'
import ModalHeader from '../../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { getSocket } from '../../../../../serviceWorker'
import classnames from 'classnames'

const defaultValues = {
  graded_point: 0,
  student_id: ''
}

const ModalPointFinal = () => {
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
  const [valueF, setValueF] = useState('')

  const handleFormOpened = () => {
    if (typeModal === "EditPoint") {
      if (dataItem) {
        Object.entries(dataItem.record).forEach(
          ([name, value]) => {
            if (name === 'note') {
              setValueF(value)
            }
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
    setValueF('')
  }

  const validate = (data) => {
    let flag = true
    if (typeof data.graded_point === 'string') {
      const graded_pointValue = parseInt(data.graded_point.trim().replace(/\s/g, ''), 10)
      //const productValue = parseInt(data.product, 10)

      if (isNaN(graded_pointValue) || graded_pointValue < 0 || graded_pointValue > 10) {
        setError('graded_point', {
          message: `${t('Please enter a valid')} ${t('graded point from 0 to 10')}`
        })
        flag = false
      } else {
        clearErrors('graded_point') // Xóa lỗi nếu graded_point hợp lệ
      }
    } else {
      // Xử lý khi data.graded_point không phải là chuỗi
    }

    //if (isNaN(productValue) || productValue <= 0) {
    //  setError('product', {
    //    message: `${t('Please enter a valid')} ${t('product')}`
    //  })
    //  flag = false
    //}
    return flag
  }
  const onSubmit = data => {

    if (typeModal === "Point" || typeModal === 'EditPoint') {
      if (validate(data)) {
        if (data.student_id === '') {
          notificationError(t('Please select student'))
        } else {
          if (typeof data.graded_point === 'string') {
            api.pointApi.gradePointManualByStudentApi({ student_id: data.student_id, graded_point: +data.graded_point.trim().replace(/\s/g, ''), note: valueF }, campus, semester, dataItem.iteration_id, dataItem.class_Id, dataItem.team_Id).then((rs) => {
              if (rs.statusCode === 201) {
                handleLoadTable()
                handleModal()
                notificationSuccess(t('Grade for student iteration 3 success'))
                socket.emit('notifications')
              } else {
                notificationError(t('Grade for student iteration 3 fail'))
              }
            }).catch((e) => {
              if (e.response.data.statusCode === 404) {
                notificationError(t('No iteration found'))
              } else {
                notificationError(t('Grade for iteration 3 fail'))
              }
            }
            )
          } else {
            api.pointApi.gradePointManualByStudentApi({ student_id: data.student_id, graded_point: +data.graded_point, note: valueF }, campus, semester, dataItem.iteration_id, dataItem.class_Id, dataItem.team_Id).then((rs) => {
              if (rs.statusCode === 201) {
                handleLoadTable()
                handleModal()
                notificationSuccess(t('Grade for student iteration 3 success'))
                socket.emit('notifications')
              } else {
                notificationError(t('Grade for student iteration 3 fail'))
              }
            }).catch((e) => {
              if (e.response.data.statusCode === 404) {
                notificationError(t('No iteration found'))
              } else {
                notificationError(t('Grade for iteration 3 fail'))
              }
            }
            )
          }
        }
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
        isOpen={openModal && (typeModal === 'Point' || typeModal === 'EditPoint')}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Point' ? 'Grade for student in iteration 3' : 'Edit Grade for student in iteration 3'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Student</Label>
                  <Controller
                    name='student_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='student_id'
                        value={dataItem.dataTeamMember && dataItem.dataTeamMember.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value)
                        }}
                        placeholder={t('Select student')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        options={dataItem.dataTeamMember}
                        isClearable={false}
                        isDisabled={typeModal === 'EditPoint'}
                      />
                    )}
                  />
                  {errors.quality && <FormFeedback>{errors.quality.message}</FormFeedback>}

                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='graded_point'>
                    {t('graded_point')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='graded_point'
                    control={control}
                    defaultValues={0}
                    render={({ field }) => (
                      <Input {...field} id='graded_point' placeholder={t('Enter graded_point')} invalid={errors.graded_point && true} />
                    )}
                  />
                  {errors.graded_point && <FormFeedback>{errors.graded_point.message}</FormFeedback>}
                </Col>
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
export default ModalPointFinal
