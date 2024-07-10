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
import { RequestContext } from './useContext'
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
    selectedProjectId } = useContext(RequestContext)
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

  const onSubmit = data => {
    if (typeModal === "Add") {
      const formData = new FormData()
      formData.append('excelFile', excelFile)
      formData.append('pdfFile', pdfFile)
      formData.append('name', data.name)
      formData.append('description', data.description)
      if (validate(data)) {
        api.requestApi.createRequestApi(formData, campus, semester).then(() => {
          notificationSuccess(t('Add request topic success'))
          handleLoadTable()
          handleModal()
          socket.emit('notifications')
        }).catch((e) => {
          if (e.response.data.statusCode === 400) {
            notificationError(e.response.data.error)
          } else if (e.response.data.statusCode === 404) {
            notificationError(t('You are not the leader of the team'))
          } else if (e.response.data.statusCode === 500) {
            notificationError(t('Time to create request topic has passed'))
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
        isOpen={openModal}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add Request Topic' : 'Edit Request Topic'} />
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
                          File Function Requirement <span style={{ color: 'red' }}>*</span>
                        </Label>
                        <br />
                        <Upload {...propsExcel} maxcount={1}>
                          <ButtonUpload className='file-excel' icon={<UploadOutlined />}>
                            Select File
                          </ButtonUpload>
                        </Upload>
                      </Col>
                      <Col md={12} xs={12} maxcount={1}>
                        <Label className='form-label' for='name'>
                          File Requirement <span style={{ color: 'red' }}>*</span>
                        </Label>
                        <br />
                        <Upload {...propsPdf}>
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
