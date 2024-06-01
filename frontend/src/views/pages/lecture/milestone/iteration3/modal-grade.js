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
  graded_LOC: 0,
  student_id: ''
}

const ModalRandomGroup = () => {
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
  const qualityOptions = [
    { label: 'High Quality', value: "100" },
    { label: 'Medium Quality', value: "75" },
    { label: 'Low Quality', value: "50" }
  ]
  const handleFormOpened = () => {
    if (typeModal === "EditGrade") {
      if (dataItem) {
        Object.entries(dataItem.record).forEach(
          ([name, value]) => {
            setValue(name, value)
            if (name === 'note') {
              setValueF(value)
            }
            if (name === 'quality') {
              if (value === '100%') {
                setValue('quality', '100')
              } else if (value === '75%') {
                setValue('quality', '75')
              } else {
                setValue('quality', '50')
              }
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

  const validate = (data) => {
    let flag = true
    const graded_LOCValue = parseInt(data.graded_LOC, 10)
    //const productValue = parseInt(data.product, 10)

    if (isNaN(graded_LOCValue) || graded_LOCValue <= 0) {
      setError('graded_LOC', {
        message: `${t('Please enter a valid')} ${t('graded_LOC')}`
      })
      flag = false
    } else {
      clearErrors('graded_LOC') // Xóa lỗi nếu graded_LOC hợp lệ
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
    if (typeModal === "Grade") {
      if (validate(data)) {
        if (data.student_id === '') {
          notificationError(t('Please selected student'))
        } else if (data.quality === undefined) {
          notificationError(t('Please selected quality'))
        } else {
          api.LocEvaluationApi.gradeForStudentApi({ ...data, fcrqm_id: dataItem.item.fcrqm_id, note: valueF }, campus, semester, dataItem.iteration_id, dataItem.item.class_id, dataItem.item.team_id).then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              handleModal()
              notificationSuccess(t('Grade for iteration 1 success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Grade for iteration 1 fail'))
            }
          }).catch((e) => {
            if (e.response.data.statusCode === 404) {
              notificationError(t('No iteration found'))
            } else {
              notificationError(t('Grade for iteration 1 fail'))
            }
          }
          )
        }
      }
    } else {
      if (validate(data)) {
        if (data.student_id === '') {
          notificationError(t('Please selected student'))
        } else if (data.quality === undefined) {
          notificationError(t('Please selected quality'))
        } else {
          api.LocEvaluationApi.gradeForStudentApi({ ...data, fcrqm_id: dataItem.record.fcrqm_id, note: valueF }, campus, semester, dataItem.iteration_id, dataItem.class_Id, dataItem.team_Id).then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              handleModal()
              notificationSuccess(t('Grade for iteration 1 success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Grade for iteration 1 fail'))
            }
          }).catch((e) => {
            if (e.response.data.statusCode === 404) {
              notificationError(t('No iteration found'))
            } else {
              notificationError(t('Grade for iteration 1 fail'))
            }
          }
          )
        }
      }
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModal()
    setValueF('')
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
        isOpen={openModal && (typeModal === 'Grade' || typeModal === 'EditGrade')}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Grade' ? 'Grade for iteration 1' : 'Edit Grade for iteration 1'} />
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
                      />
                    )}
                  />
                  {errors.quality && <FormFeedback>{errors.quality.message}</FormFeedback>}

                </Col>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Quality</Label>
                  <Controller
                    name='quality'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='quality'
                        value={qualityOptions.find((val) => val.value === value) ?? ''}
                        onChange={(e) => {
                          onChange(e?.value)
                          setValue('graded_LOC', (+(e?.value / 100).toFixed(2) * (typeModal === 'Grade' ? +dataItem.item.LOC : +dataItem.record.LOC)))
                        }}
                        placeholder={t('Select quality')}
                        defaultValue={''}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        options={qualityOptions}
                        isClearable={false}
                      />
                    )}
                  />
                  {errors.quality && <FormFeedback>{errors.quality.message}</FormFeedback>}

                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='graded_LOC'>
                    {t('graded_LOC')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='graded_LOC'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='graded_LOC' placeholder={t('Enter graded_LOC')} invalid={errors.graded_LOC && true} />
                    )}
                  />
                  {errors.graded_LOC && <FormFeedback>{errors.graded_LOC.message}</FormFeedback>}
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
export default ModalRandomGroup
