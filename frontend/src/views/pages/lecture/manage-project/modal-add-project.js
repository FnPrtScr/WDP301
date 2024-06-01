import { Fragment, useContext, useState, useEffect } from 'react'
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
import { UploadOutlined } from '@ant-design/icons'
import { Upload, Button as ButtonUpload } from 'antd'
import { getSocket } from '../../../../serviceWorker'
import classnames from 'classnames'
const defaultValues = {
  name: '',
  description: ''
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
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()
  const [valueF, setValueF] = useState('')
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

  const [excelFile, setExcelFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  const propsExcel = {
    onRemove: () => {
      setExcelFile()
    },
    beforeUpload: (file) => {
      setExcelFile(file)
      return false
    },
    fileListExcel: excelFile ? [excelFile] : [],
    accept: '.xlsx',
    maxSize: 10
  }

  const propsPdf = {
    onRemove: () => {
      setPdfFile()
    },
    beforeUpload: (file) => {
      setPdfFile(file)
      return false
    },
    fileListPdf: pdfFile ? [pdfFile] : [],
    accept: '.pdf', // Chỉ chấp nhận tệp PDF
    maxSize: 10 // Kích thước tối đa là 10 MB
  }
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

  useEffect(() => {
    if (openModal && selectedProjectId) {
      // Fetch data based on the selected project
      fetchData(selectedProjectId)
    }
  }, [openModal, selectedProjectId])

  const handleFormOpened = () => {
    if (typeModal === "EditProject") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
            if (name === 'description') {
              setValueF(value)
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
    if (data.name.length === 0) {
      setError('name', {
        message: `${t('Please enter a valid')} ${t('Project Name')}`
      })
      flag = false
    }
    return flag
  }
  // const getLocalDate = (date) => {
  //   date = new Date(date)
  //   return new Date(Date.UTC(date?.getFullYear(), date?.getMonth(), date?.getDate(), date?.getHours(), date.getMinutes(), date?.getSeconds()))
  // }
  const onSubmit = async data => {
    if (typeModal === "EditProject") {
      if (validate(data)) {
        api.projectApi.updateOneProjectApi({ name: data.name.trim().toUpperCase().replace(/\s/g, ''), description: valueF }, campus, semester, dataItem.project_id).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit Project success'))
            socket.emit('notifications')
          }
        }).catch((e) => {
          console.log(e)
          if (e.response.data.statusCode === 400) {
            notificationError(t(e.response.data.error))
          } else if (e.response.data.statusCode === 404) {
            notificationError(t(e.response.data.error))
          } else if (e.response.status === 500) {
            notificationError(t(e.response.data.error))
          } else {
            notificationError(t('Edit fail'))
          }
        }
        )
      }
    } else {
      if (validate(data)) {
        try {
          if (excelFile !== null && pdfFile) {
            const formData = new FormData()
            formData.append('excelFile', excelFile)
            formData.append('pdfFile', pdfFile)
            formData.append('name', data.name)
            formData.append('description', valueF)

            const rs = await api.projectApi.createOneProjectApi(formData, campus, semester)

            if (rs.success === true) {
              handleLoadTable()
              handleModal()
              notificationSuccess(t('Add Project success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Add Project fail'))
            }
          } else {
            notificationError(t('File Function Details and File Requirement is required'))
          }
        } catch (e) {
          console.log(e)
          if (e.response.status === 400) {
            notificationError(t(e.response.data.message))
          } else if (e.response.status === 500) {
            notificationError(t(e.response.data.message))
          } else {
            notificationError(t('Add fail'))
          }
          console.error('Add Project fail', e)
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
        isOpen={openModal}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'AddProject' ? 'Add Project' : 'Edit Project'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Project Name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='name' placeholder={t('Enter Project Name')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='description'>
                    {t('Description')}
                  </Label>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      //<Input {...field} id='feedback' placeholder={t('Enter Feedback')} invalid={errors.feedback && true} />
                      <Input
                        {...field} id='description' placeholder={t('Enter Description')} invalid={errors.description && true}
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
                  {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                </Col>
                <>
                  {typeModal !== 'EditProject' ? (
                    <>
                      <Col md={12} xs={12}>
                        <Label className='form-label' for='name'>
                          File Function Details <span style={{ color: 'red' }}>*</span>
                        </Label>
                        <br />
                        <Upload {...propsExcel} multiple={false} limit={1} maxCount={1}>
                          <ButtonUpload className='file-excel' icon={<UploadOutlined />}>
                            Select File
                          </ButtonUpload>
                        </Upload>
                      </Col>
                      <Col md={12} xs={12}>
                        <Label className='form-label' for='name'>
                          File Requirement <span style={{ color: 'red' }}>*</span>
                        </Label>
                        <br />
                        <Upload {...propsPdf} multiple={false} limit={1} maxCount={1}>
                          <ButtonUpload icon={<UploadOutlined />}>Select File</ButtonUpload>
                        </Upload>
                      </Col>
                    </>
                  ) : null}
                </>
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
