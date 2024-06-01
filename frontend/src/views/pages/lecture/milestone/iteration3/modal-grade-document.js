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
import { getSocket } from '../../../../../serviceWorker'
import classnames from 'classnames'
const defaultValues = {
  grade_SCandDB: 0,
  grade_SRS: 0,
  grade_SDS: 0,
  feedback: ''
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
  const [valueF, setValueF] = useState('')
  const socket = getSocket()
  const getGradeDoc = () => {
    api.teamEvaluationApi.getGradeTeamApi({}, campus, semester, dataItem.iteration_id, dataItem.class_Id, dataItem.team_Id).then((rs) => {
      if (rs.statusCode === 200) {
        const data = rs.data
        setValue('grade_SCandDB', data.grade_SCandDB)
        setValue('grade_SRS', data.grade_SDS)
        setValue('grade_SDS', data.grade_SRS)
        setValue('feedback', data.feedback)

      }
    }).catch((e) => {
      if (e.response.data.statusCode === 404) {
        notificationError(t('Grade fail'))
      } else {
        notificationError(t('Get grade fail'))
      }
    }
    )
  }
  const handleFormOpened = () => {
    getGradeDoc()
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    //setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    const grade_SCandDBValue = parseInt(data.grade_SCandDB, 10)
    const grade_SRSValue = parseInt(data.grade_SRS, 10)
    const grade_SDSValue = parseInt(data.grade_SDS, 10)
    if (isNaN(grade_SCandDBValue) || grade_SCandDBValue < 0 || grade_SCandDBValue > 10) {
      setError('grade_SCandDB', {
        message: `${t('Please enter a valid')} ${t('Grade Screen Flow and Database from 0 to 10')}`
      })
      flag = false
    }
    if (isNaN(grade_SRSValue) || grade_SRSValue < 0 || grade_SRSValue > 10) {
      setError('grade_SRS', {
        message: `${t('Please enter a valid')} ${t('Grade Requirement & Design Specification from 0 to 10')}`
      })
      flag = false
    }
    if (isNaN(grade_SDSValue) || grade_SDSValue < 0 || grade_SDSValue > 10) {
      setError('grade_SDS', {
        message: `${t('Please enter a valid')} ${t('Grade Software Design Specification from 0 to 10')}`
      })
      flag = false
    }
    //if (data.feedback.length === 0) {
    //  setError('feedback', {
    //    message: `${t('Please enter a valid')} ${t('feedback')}`
    //  })
    //  flag = false
    //}
    return flag
  }

  const onSubmit = data => {
    if (typeModal === "GradeDocument") {
      if (dataItem.class_Id === null) {
        notificationError(t('No class found'))
      } else if (dataItem.team_Id === null) {
        notificationError(t('No team found'))
      } else {
        if (validate(data)) {

          api.teamEvaluationApi.gradeTeamApi({ grade_SCandDB: parseInt(data.grade_SCandDB, 10), grade_SRS: parseInt(data.grade_SRS, 10), grade_SDS: parseInt(data.grade_SDS, 10), note: valueF }, campus, semester, dataItem.iteration_id, dataItem.class_Id, dataItem.team_Id).then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              handleModal()
              notificationSuccess(t('Grade success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Grade fail'))
            }
          }).catch((e) => {
            if (e.response.data.statusCode === 404) {
              notificationError(t('Grade fail'))
            } else {
              notificationError(t('Grade fail'))
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
        isOpen={openModal && typeModal === 'GradeDocument'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'GradeDocument' ? 'Grade Document for iteration 3' : 'Edit Setting for iteration 3'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='grade_SCandDB'>
                    {t('Grade Screen Flow and Database')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='grade_SCandDB'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='grade_SCandDB' placeholder={t('Enter grade')} invalid={errors.grade_SCandDB && true} />
                    )}
                  />
                  {errors.grade_SCandDB && <FormFeedback>{errors.grade_SCandDB.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='grade_SRS'>
                    {t('Grade Requirement & Design Specification')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='grade_SRS'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='grade_SRS' placeholder={t('Enter grade')} invalid={errors.grade_SRS && true} />
                    )}
                  />
                  {errors.grade_SRS && <FormFeedback>{errors.grade_SRS.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='grade_SDS'>
                    {t('Grade Software Design Specification')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='grade_SDS'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='grade_SDS' placeholder={t('Enter grade')} invalid={errors.grade_SDS && true} />
                    )}
                  />
                  {errors.grade_SDS && <FormFeedback>{errors.grade_SDS.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='feedback'>
                    {t('Feedback')}
                  </Label>
                  <Controller
                    name='feedback'
                    control={control}
                    render={({ field }) => (
                      //<Input {...field} id='feedback' placeholder={t('Enter Feedback')} invalid={errors.feedback && true} />
                      <Input
                        {...field} id='feedback' placeholder={t('Enter Feedback')} invalid={errors.feedback && true}
                        name='text'
                        value={valueF}
                        type='textarea'
                        style={{ minHeight: '100px' }}
                        onChange={e => setValueF(e.target.value)}
                        className={classnames({ 'text-danger': valueF?.length > 1000 })}
                      />
                    )}
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
