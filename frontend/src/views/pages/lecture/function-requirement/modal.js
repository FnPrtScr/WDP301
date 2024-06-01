import { Fragment, useContext, useEffect, useState } from 'react'
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
import { useLocation } from 'react-router-dom'
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import Select from 'react-select'
//import { Select } from 'antd'
import { getSocket } from '../../../../serviceWorker'
import { selectThemeColors } from '@utils'


const defaultValues = {
  name: '',
  description: '',
  complexity: ''
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal,
    selectedProjectId } = useContext(ProjectContext)
  const { t } = useTranslation()
  const location = useLocation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataProject, setDataProject] = useState(location.state)
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

  const fetchData = async (projectId) => {
    try {
      // Fetch data based on projectId
      const rs = await api.fetchData(projectId)
      if (rs.success === true) {
        setData(rs.data) // Update data state with fetched data
      } else {
        setData([]) // Clear data if fetching fails
      }
    } catch (e) {
      console.error('Fetching data failed', e)
      setData([]) // Clear data if fetching fails
    }
  }
  const option = [
    { value: 0, label: 'Simple' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Complex' }
  ]
  useEffect(() => {
    const obj = location.state
    setDataProject({ ...obj })
  }, [])

  useEffect(() => {
    if (openModal && selectedProjectId) {
      // Fetch data based on the selected project
      fetchData(selectedProjectId)
    }
  }, [openModal, selectedProjectId])
  const handleFormOpened = () => {
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
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

  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
  }

  const validate = (data) => {
    let flag = true
    if (data.name.length === 0) {
      setError('name', {
        message: `${t('Please enter a valid')} ${t('Project Name')}`
      })
      flag = false
    }
    if (typeof +data.LOC === 'string' || +data.LOC < 0 || data.LOC === undefined) {
      setError('LOC', {
        message: `${t('Please enter a')} ${t('positive number')}`
      })
      flag = false
    }
    if (data.complexity === '') {
      notificationError(t('Please Select Complexity'))
      flag = false
    }
    return flag
  }

  const onSubmit = async data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        api.funcrmApi.UpdateOneFunctionApi({ name: data.name, LOC: data.LOC, complexity: data.complexity === 0 ? 'simple' : data.complexity === 1 ? 'medium' : 'complex', description: data.description, feature: data.feature }, campus, semester, dataProject?.project_id, dataItem?.id).then(() => {
          handleLoadTable()
          handleModal()
          notificationSuccess(t('Edit Function Success'))
          socket.emit('notifications')
        }).catch(() => {
          notificationError(t('Edit Function Fail'))
        }
        )
      }
    } else {
      if (validate(data)) {
        api.funcrmApi.CreateOneFunctionApi({ name: data.name, LOC: data.LOC, complexity: data.complexity === 0 ? 'simple' : data.complexity === 1 ? 'medium' : 'complex', description: data.description, feature: data.feature }, campus, semester, dataProject?.project_id).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Add Function Success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Add Function Fail'))
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
        isOpen={openModal}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add Function Requirement' : 'Edit Function Requirement'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Function Name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='name' placeholder={t('Enter Function Name')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='feature'>
                    {t('Feature')}
                  </Label>
                  <Controller
                    name='feature'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='feature' placeholder={t('Enter Feature')} invalid={errors.feature && true} />
                    )}
                  />
                  {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='feature'>
                    {t('LOC')}
                  </Label>
                  <Controller
                    name='LOC'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='LOC' placeholder={t('Enter LOC')} invalid={errors.LOC && true} />
                    )}
                  />
                  {errors.LOC && <FormFeedback>{errors.LOC.message}</FormFeedback>}
                </Col>
                <Col className='mb-1' md='12' xs='12'>
                  <Label className='form-label'>Selected Complexity<span style={{ color: 'red' }}>*</span></Label>
                  <Controller
                    name='complexity'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='complexity'
                        value={option && option.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value)
                        }}
                        placeholder={t('Select Complexity')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        options={option}
                        isClearable={false}
                      />
                    )}
                  />
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Description')}
                  </Label>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='description' placeholder={t('Enter Description')} invalid={errors.description && true} />
                    )}
                  />
                  {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
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
