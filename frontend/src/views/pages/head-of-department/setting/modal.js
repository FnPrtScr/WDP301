/* eslint-disable no-unused-vars */
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

const defaultValues = {
  assessment_1: '',
  assessment_2: '',
  assessment_3: '',
  final_project: '',
  total: '',
  status: true
}
const campus = window.localStorage.getItem('campus')
const semester = window.localStorage.getItem('semester')
const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal
  } = useContext(UserContext)
  const { t } = useTranslation()
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })
  // console.log(dataItem)
  const handleFormOpened = () => {
    if (typeModal === 'Edit') {
      if (dataItem) {
        setValue('assessment_1', dataItem.assessment_1)
        setValue('assessment_2', dataItem.assessment_2)
        setValue('assessment_3', dataItem.assessment_3)
        setValue('final_project', dataItem.final_project)
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
    if (isNaN(Number(data.assessment_1)) || Number(data.assessment_1) < 0 || data.assessment_1.length === 0) {
      setError('assessment_1', {
        message: `${t('Please enter a valid')} ${t('assessment_1')}`
      })
      flag = false
    }
    if (isNaN(Number(data.assessment_2)) || Number(data.assessment_2) < 0 || data.assessment_2.length === 0) {
      setError('assessment_2', {
        message: `${t('Please enter a valid')} ${t('assessment_2')}`
      })
      flag = false
    }
    if (isNaN(Number(data.assessment_3)) || Number(data.assessment_3) < 0 || data.assessment_3.length === 0) {
      setError('assessment_3', {
        message: `${t('Please enter a valid')} ${t('assessment_3')}`
      })
      flag = false
    }
    if (isNaN(Number(data.final_project)) || Number(data.final_project) < 30 || Number(data.final_project) > 40) {
      setError('final_project', {
        message: `${t('Please enter a valid')} ${t('final_project')}`
      })
      flag = false
    }
    const total = Number(data.assessment_1) + Number(data.assessment_2) + Number(data.assessment_3) + Number(data.final_project)

    if (total !== 100) {
      setError('assessment_1', {
        message: `${t('Total score must be exactly 100. Please enter assessment_1')}`
      })
      setError('assessment_2', {
        message: `${t('Total score must be exactly 100. Please enter assessment_2')}`
      })
      setError('assessment_3', {
        message: `${t('Total score must be exactly 100. Please enter assessment_3')}`
      })
      setError('final_project', {
        message: `${t('Total score must be exactly 100. Please enter final_project')}`
      })
      flag = false
    }
    return flag
  }

  const onSubmit = data => {
    if (typeModal === 'Edit') {
      if (validate(data)) {
        const body = {
          assessment_1: data.assessment_1,
          assessment_2: data.assessment_2,
          assessment_3: data.assessment_3,
          final_project: data.final_project
        }
        api.settingApi.createOne(body, campus, semester).then((rs) => {
          if (rs.statusCode === 201) {
            handleModal() // Close modal
            handleLoadTable() // Reload table data
            setDataItem({
              assessment_1: parseFloat(body.assessment_1),
              assessment_2: parseFloat(body.assessment_2),
              assessment_3: parseFloat(body.assessment_3),
              final_project: parseFloat(body.final_project)
            })
            notificationSuccess(t('Update success'))
          } else {
            notificationError(t('Update fail'))
          }
        })
      }
    }
  }

  const handleCancel = () => {
    handleModal()
  }

  const renderFooterButtons = () => {
    return (
      <Fragment>
        <Button color='primary' className='me-1' type="submit">{t('Save')}</Button>
        <Button color='secondary' onClick={handleCancel} outline className='me-1'>{t('Close')}</Button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Modal
        isOpen={openModal}
        toggle={handleModal}
        onOpened={handleFormOpened}
        onClosed={handleModalClosed}
        backdrop='static'
        className='modal-dialog-centered modal-lg'
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Setting' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='gy-1 pt-75'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='assessment_1'>
                    {t('Assessment 1')}
                  </Label>
                  <Controller
                    name='assessment_1'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='assessment_1' placeholder={t('Enter assessment_1')} invalid={errors.assessment_1 && true} />
                    )}
                  />
                  {errors.assessment_1 && <FormFeedback>{errors.assessment_1.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='assessment_2'>
                    {t('Assessment 2')}
                  </Label>
                  <Controller
                    name='assessment_2'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='assessment_2' placeholder={t('Enter assessment_2')} invalid={errors.assessment_2 && true} />
                    )}
                  />
                  {errors.assessment_2 && <FormFeedback>{errors.assessment_2.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='assessment_3'>
                    {t('Assessment 3')}
                  </Label>
                  <Controller
                    name='assessment_3'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='assessment_3' placeholder={t('Enter assessment_3')} invalid={errors.assessment_3 && true} />
                    )}
                  />
                  {errors.assessment_3 && <FormFeedback>{errors.assessment_3.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='final_project'>
                    {t('Final Project')}
                  </Label>
                  <Controller
                    name='final_project'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='final_project' placeholder={t('Enter final_project')} invalid={errors.final_project && true} />
                    )}
                  />
                  {errors.final_project && <FormFeedback>{errors.final_project.message}</FormFeedback>}
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
