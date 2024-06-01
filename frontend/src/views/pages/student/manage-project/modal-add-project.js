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
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  technical: '',
  link_gitlab: '',
  link_jira: ''
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal
  } = useContext(ProjectContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()

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
    if (typeModal === "AddProject") {
      if (dataItem[0]) {
        Object.entries(dataItem[0]).forEach(
          ([name, value]) => {
            setValue(name, value)
            if (name === 'name') {
              setValue('name', value)
            }
          }
        )
      }
    }
  }

  const TokenInput = ({ field, placeholder, invalid, errorMessage }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
      setPasswordVisible(!isPasswordVisible)
    }

    return (
      <div style={{ position: 'relative' }}>
        <Input
          {...field}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={placeholder}
          invalid={invalid}
          style={{ paddingRight: '40px' }}
        />
        <Button
          className="toggle-password-btn"
          onClick={togglePasswordVisibility}
          aria-label={isPasswordVisible ? 'Hide Password' : 'Show Password'}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            color: '#555'
          }}
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </Button>
        {invalid && <FormFeedback>{errorMessage}</FormFeedback>}
      </div>
    )
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

    if (data.technical?.length === 0) {
      setError('technical', {
        message: `${t('Technical is')} ${t('required')}`
      })
      flag = false
    }
    if (data.link_gitlab?.length === 0) {
      setError('link_gitlab', {
        message: `${t('Link GitLab is')} ${t('required')}`
      })
      flag = false
    } else if (!urlRegex.test(data.link_gitlab)) {
      setError('link_gitlab', {
        message: `${t('Link Gitlab is')} ${t('not a valid link')}`
      })
      flag = false
    }
    //if (!urlRegex.test(data.link_jira) && data.link_jira === '') {
    //  setError('link_jira', {
    //    message: `${t('Link Jira is')} ${t('not a valid link')}`
    //  })
    //  flag = false
    //}
    //if (!urlRegex.test(data.project_tracking) && data.project_tracking === '') {
    //  setError('project_tracking', {
    //    message: `${t('Link Project Tracking is')} ${t('not a valid link')}`
    //  })
    //  flag = false
    //}

    return flag
  }

  const onSubmit = data => {
    if (typeModal === "AddProject") {
      const teamProjectIds = dataItem.map(item => item.teamproject_id)
      if (validate(data)) {
        api.teamProjectApi.AddLinkAndTechApi(data, campus, semester, teamProjectIds).then(() => {
          handleLoadTable()
          handleModal()
          notificationSuccess(t('Setting project success'))
          socket.emit('notifications')
        }).catch((e) => {
          if (e.response.data.statusCode === 500) {
            notificationError(t('You are not team leader'))
          } else if (e.response.data.statusCode === 500) {
            notificationError(t('TeamProject not found'))
          } else {
            notificationError(t('Setting project fail'))
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
        isOpen={openModal && typeModal === 'AddProject'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Edit Link and Technical'} />
          <ModalBody>
            <div className='border p-1 mb-2' style={{ borderRadius: '10px' }}>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Technical')}
                  </Label>
                  <Controller
                    name='technical'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='technical' placeholder={t('Enter Technical')} invalid={errors.technical && true} />
                    )}
                  />
                  {errors.technical && <FormFeedback>{errors.technical.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <div className='border p-1' style={{ borderRadius: '10px' }}>
                    <Col md={12} xs={12}>
                      <Label className='form-label' for='link_gitlab'>
                        {t('Link Gitlab')} <span style={{ color: 'red' }}>*</span>
                      </Label>
                      <Controller
                        name='link_gitlab'
                        control={control}
                        render={({ field }) => (
                          <Input {...field}
                            id='link_gitlab'
                            placeholder={t('Enter Link Gitlab')}
                            invalid={errors.link_gitlab && true}
                          />
                        )}
                      />
                      {errors.link_gitlab && <FormFeedback>{errors.link_gitlab.message}</FormFeedback>}
                    </Col>
                    <Col md={12} xs={12}>
                      <Label className="form-label" for="tokenGit">
                        {t('Token Git')}
                      </Label>
                      <Controller
                        name="tokenGit"
                        control={control}
                        render={({ field }) => (
                          <TokenInput
                            field={field}
                            placeholder={t('Enter Token Git')}
                            invalid={!!errors.project_tracking}
                          />
                        )}
                      />
                    </Col>
                  </div>
                </Col>
                <Col md={12} xs={12}>
                  <div className='border p-1' style={{ borderRadius: '10px' }}>
                    <Col md={12} xs={12}>
                      <Label className='form-label' for='name'>
                        {t('Link Jira')}
                      </Label>
                      <Controller
                        name='link_jira'
                        control={control}
                        render={({ field }) => (
                          <Input {...field}
                            id='link_jira'
                            placeholder={t('Enter Link Jira')}
                            invalid={errors.link_jira && true}
                          />
                        )}
                      />
                      {errors.link_jira && <FormFeedback>{errors.link_jira.message}</FormFeedback>}
                    </Col>
                    <Col md={12} xs={12}>
                      <Label className='form-label' for='email_owner'>
                        {t('Email Owner Jira')}
                      </Label>
                      <Controller
                        name='email_owner'
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id='email_owner' placeholder={t('Enter Email Owner Jira')} invalid={errors.email_owner && true} />
                        )}
                      />
                      {errors.link_jira && <FormFeedback>{errors.link_jira.message}</FormFeedback>}
                    </Col>
                    <Col md={12} xs={12}>
                      <Label className='form-label' for='name'>
                        {t('API Token Jira')}
                      </Label>
                      <Controller
                        name='apiToken'
                        control={control}
                        render={({ field }) => (
                          <TokenInput
                            field={field}
                            placeholder={t('Enter Api Token')}
                            invalid={!!errors.apiToken}
                            errorMessage={errors.apiToken ? errors.apiToken.message : ''}
                          />
                        )}
                      />
                      {errors.apiToken && <FormFeedback>{errors.apiToken.message}</FormFeedback>}
                    </Col>
                  </div>
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='project_tracking'>
                    {t('Link Project Tracking')}
                  </Label>
                  <Controller
                    name='project_tracking'
                    control={control}
                    render={({ field }) => (
                      <Input {...field}
                        id='project_tracking'
                        placeholder={t('Enter Link Project Tracking')}
                        invalid={errors.project_tracking && true}
                      />
                    )}
                  />
                  {errors.project_tracking && <FormFeedback>{errors.project_tracking.message}</FormFeedback>}
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
