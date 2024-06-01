// ** React Imports
import { Fragment, useState, useContext } from 'react'

// ** Third Party Components
import { read, utils } from 'xlsx'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { DownloadCloud } from 'react-feather'

// ** Custom Components
import ExtensionsHeader from '@components/extensions-header'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Table, CardHeader, CardTitle, Input, Label, Modal, Button, ModalBody, FormFeedback, Form } from 'reactstrap'

// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'

import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
// import moment from 'moment'
import ModalHeader from '../../../../@core/components/modal-header'
import { Select } from 'antd'
import { getSocket } from '../../../../serviceWorker'
const ModalImportComponent = () => {
  // const [listBoxUser, setListBoxUser] = useState([])
  const [name, setName] = useState('')
  const [valueImport, setValueImport] = useState('')
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [fileImport, setFileImport] = useState(null)
  const socket = getSocket()

  const getTableData = (arr, name) => {
    setTableData(arr)
    setName(name)
  }
  const role = window.localStorage.getItem('role')
  const semester = window.localStorage.getItem('semester')
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: result => {
      const reader = new FileReader()
      reader.onload = function () {
        const fileData = reader.result
        const wb = read(fileData, { type: 'binary' })
        wb.SheetNames.forEach(function (sheetName) {
          const rowObj = utils.sheet_to_row_object_array(wb.Sheets[sheetName])
          getTableData(rowObj, result[0].name)
        })
      }
      if (result.length && result[0].name.endsWith('xlsx')) {
        reader.readAsBinaryString(result[0])
        const file = result[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileType', file.name)
        setFileImport(file)
      } else {
        toast.error(
          () => (
            <p className='mb-0'>
              You can only upload <span className='fw-bolder'>.xlsx</span>, <span className='fw-bolder'>.xls</span> &{' '}
              <span className='fw-bolder'>.csv</span> Files!.
            </p>
          ),
          {
            style: {
              minWidth: '380px'
            }
          }
        )
      }
    }
  })

  const handleFilter = e => {
    const data = tableData
    let filteredData = []
    const value = e.target.value
    setValueImport(value)

    if (value.length) {
      filteredData = data.filter(col => {
        const keys = Object.keys(col)

        const startsWithCondition = keys.filter(key => {
          return col[key].toString().toLowerCase().startsWith(value.toLowerCase())
        })

        const includesCondition = keys.filter(key => col[key].toString().toLowerCase().includes(value.toLowerCase()))

        if (startsWithCondition.length) return col[startsWithCondition]
        else if (!startsWithCondition && includesCondition.length) return col[includesCondition]
        else return null
      })
      setFilteredData(filteredData)
      setValueImport(value)
    } else {
      return null
    }
  }
  /*eslint-disable */
  const headArr = tableData.length
    ? tableData.map((col, index) => {
      if (index === 0) return [...Object.keys(col)]
      else return null
    })
    : []
  /*eslint-enable */
  const dataArr = valueImport?.length ? filteredData : tableData.length && !valueImport?.length ? tableData : null

  const renderTableBody = () => {
    if (dataArr !== null && dataArr.length) {
      return dataArr.map((col, index) => {
        const keys = Object.keys(col)
        const renderTd = keys.map((key, index) => <td key={index}>{col[key]}</td>)
        return <tr key={index}>{renderTd}</tr>
      })
    } else {
      return null
    }
  }

  const renderTableHead = () => {
    if (headArr.length) {
      return headArr[0].map((head, index) => {
        return <th key={index}>{head}</th>
      })
    } else {
      return null
    }
  }
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    //dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()

  const {
    //setError,
    clearErrors,
    handleSubmit,
    //setValue,
    reset,
    formState: { }
  } = useForm({})

  const handleFormOpened = () => {
  }

  const onSubmit = () => {

    if (fileImport) {
      const formData = new FormData()
      formData.append('file', fileImport)
      api.classesApi.importClassesApi(formData, role, semester).then((rs) => {
        if (rs.success === true) {
          handleLoadTable()
          handleModal()
          notificationSuccess(t('Import class success'))
          socket.emit('notifications')
        } else {
          notificationError(t('Import class fail'))
        }
      }).catch((e) => {
        console.error('File upload failed', e)
        //notificationError(t('Add fail'))
      }
      )
    } else {
      console.error('No file selected')
    }
  }


  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
    setValueImport([])
    setTableData([])
  }
  const handleCancel = () => {
    handleModal()
    clearErrors()
    reset()
    setDataItem({})
    setValueImport([])
    setTableData([])
    handleModalClosed()
  }

  const renderFooterButtons = () => {
    return (
      <Fragment>
        <Button color='primary' className='me-1'>{t('Save')}</Button>
        <Button color='secondary' onClick={handleCancel} outline className='me-1'>{t('Close')}</Button>
      </Fragment>
    )
  }

  const downloadTemplate = () => {
    const url = `${process.env.PUBLIC_URL}/template/[HEAD]-SPRING2024-CLASS.xlsx`
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '[HEAD]-SPRING2024-CLASS.xlsx')
    //link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <Fragment >
      <Modal
        isOpen={openModal && typeModal === 'Import'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Import Class' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='import-component'>
                <Col sm='12'>
                  <Card>
                    <CardHeader className='d-flex flex-column justify-content-start flex-wrap'>
                      <CardTitle tag='h4' className='ml-auto'>DownLoad Template</CardTitle>
                      <div className='d-flex justify-content-end'>
                        <a href="#" onClick={downloadTemplate}>Click here to download template</a>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm='12'>
                          <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div className='d-flex align-items-center justify-content-center flex-column'>
                              <DownloadCloud size={64} />
                              <h5>Drop Files here or click to upload</h5>
                              <p className='text-secondary'>
                                Drop files here or click{' '}
                                <a href='/' onClick={e => e.preventDefault()}>
                                  browse
                                </a>{' '}
                                thorough your machine
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                {tableData.length ? (
                  <Col sm='12'>
                    <Card>
                      <CardHeader className='justify-content-between flex-wrap'>
                        <CardTitle tag='h4'>{name}</CardTitle>
                        <div className='d-flex align-items-center justify-content-end'>
                          <Label for='search-input' className='me-1'>
                            Search
                          </Label>
                          <Input id='search-input' type='text' bsSize='sm' value={valueImport} onChange={e => handleFilter(e)} />
                        </div>
                      </CardHeader>
                      <Table className='table-hover-animation' responsive>
                        <thead>
                          <tr>{renderTableHead()}</tr>
                        </thead>
                        <tbody>{renderTableBody()}</tbody>
                      </Table>
                    </Card>
                  </Col>
                ) : null}
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

export default ModalImportComponent
