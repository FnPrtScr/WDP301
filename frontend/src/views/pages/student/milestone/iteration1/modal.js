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
// import { useLocation } from 'react-router-dom'
import { SubmitContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../../api'
import ModalHeader from '../../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
import { UploadOutlined } from '@ant-design/icons'
import { Upload, Button as ButtonUpload, Select } from 'antd'
import { getSocket } from '../../../../../serviceWorker'
const defaultValues = {
  option: 'link'
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal,
    selectedProjectId } = useContext(SubmitContext)
  const { t } = useTranslation()
  // const location = useLocation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  // const [dataProject, setDataProject] = useState(location.state)
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

  const [selectedOption, setSelectedOption] = useState('link')

  const handleOptionChange = (option) => {
    setSelectedOption(option)
  }

  const [File, setFile] = useState(null)

  const propsPdf = {
    onRemove: () => {
      setFile()
    },
    beforeUpload: (file) => {
      setFile(file)
      return false
    },
    fileList: File ? [File] : [],
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
    if (data.url_doc?.length === 0) {
      setError('url_doc', {
        message: `${t('Link')} ${t('is required')}`
      })
      flag = false
    }
    return flag
  }


  const onSubmit = async data => {
    if (validate(data)) {
      try {
        const formData = new FormData()
        formData.append('file', File)
        formData.append('url_doc', data.url_doc ? data.url_doc : '')
        const rs = await api.iterDocumenttApi.submitDocumentApi(formData, campus, semester, dataItem.iteration_id)
        if (rs.statusCode === 201) {
          handleLoadTable()
          handleModal()
          notificationSuccess(t('Submit Document success'))
          socket.emit('notifications')
        } else {
          notificationError(t('Submit Document fail'))
        }
      } catch (e) {
        if (e.response.data.statusCode === 400) {
          notificationError(e.response.data.error)
        } else if (e.response.status === 500) {
          notificationError(t('Please upload only excel, pdf, or zip files'))
        } else {
          notificationError(t('Submit Document fail'))
        }
        console.error('Submit Document fail', e)
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
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Submit Document for Iteration1'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='option'>
                    Select Option <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='select'
                    name='option'
                    id='option'
                    value={selectedOption}
                    onChange={(e) => handleOptionChange(e.target.value)}
                  >
                    <option value='link'>Link</option>
                    <option value='file'>File</option>
                  </Input>
                </Col>
                {selectedOption === 'link' && (
                  <Col md={12} xs={12}>
                    <Label className='form-label' for='url_doc'>
                      Link <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Controller
                      name='url_doc'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id='url_doc'
                          placeholder={t('Enter Link')}
                          invalid={errors.url_doc && true}
                        />
                      )}
                    />
                    {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                  </Col>
                )}
                {selectedOption === 'file' && (
                  <Col md={12} xs={12}>
                    <Label className='form-label' for='name'>
                      File <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <br />
                    <Upload {...propsPdf}>
                      <ButtonUpload icon={<UploadOutlined />}>Select File</ButtonUpload>
                    </Upload>
                  </Col>
                )}
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
