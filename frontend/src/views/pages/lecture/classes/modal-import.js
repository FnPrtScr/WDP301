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
import { Select, Table as TableAntd } from 'antd'
import dayjs from 'dayjs'
import { getSocket } from '../../../../serviceWorker'
import { PUBLIC_URL_SERVER, PUBLIC_URL_SERVER_API } from "../../../../dataConfig"

const ModalImportComponent = () => {
  // const [listBoxUser, setListBoxUser] = useState([])
  const [name, setName] = useState('')
  const [valueImport, setValueImport] = useState('')
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [fileImport, setFileImport] = useState(null)
  const getTableData = (arr, name) => {
    setTableData(arr)
    setName(name)
  }
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()

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
        return <th key={index} >{head}</th>
      })
    } else {
      return null
    }
  }
  const {
    openModal,
    handleModal,
    handleLoadTable,
    //setDataItem,
    dataItem,
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
  const [dataHis, setDataHis] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFormOpened = () => {
    setLoading(true)
    api.importHistoryApi.getAllImportHisStudentApi({}, campus, semester, dataItem.key)
      .then((rs) => {
        setDataHis(rs.data)
        setLoading(false)

      }).catch(() => {
        setLoading(false)
      })
  }
  const onSubmit = () => {
    if (fileImport) {
      const formData = new FormData()
      formData.append('file', fileImport)
      api.classesApi.ImportStudentIntoClass(formData, campus, semester, dataItem.key).then((rs) => {
        if (rs.success === true) {
          handleLoadTable()
          handleModal()
          notificationSuccess(t(rs.message))
          socket.emit('notifications')
        } else {
          handleLoadTable()
          handleModal()
          notificationError(t(rs.message))
          socket.emit('notifications')
        }
      }).catch((e) => {
        console.error('File upload failed', e)
        notificationError(t('Add fail'))
      }
      )
    } else {
      console.error('No file selected')
    }
  }

  const getAdjustedTime = (createdAt) => {
    return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
  }
  const handleDownload = (text) => {
    fetch(`${PUBLIC_URL_SERVER_API}/download/excel?n=${encodeURIComponent(text)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.ms-excel"
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        // create a temporary URL object from the blob
        const url = window.URL.createObjectURL(new Blob([blob]))

        // create a link element to trigger the download
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", text.split("/").pop())
        document.body.appendChild(link)
        link.click()

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error)
      })
  }
  const splitString = (text) => {
    const newText = text.split("/").pop()
    return newText
  }
  const columns = [

    {
      title: "File Import Original",
      dataIndex: "path_file_original",
      key: "path_file_original",
      width: 100,
      minWidth: 70,
      maxWidth: 200,
      editable: true,
      render: (text) => (
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
          {splitString(text)}
        </a>
      )
    },
    {
      title: "File Import Successed",
      dataIndex: "path_file_successed",
      key: "path_file_successed",
      width: 100,
      minWidth: 70,
      maxWidth: 200,
      render: (text) => (
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
          {splitString(text)}
        </a>
      )
    },
    {
      title: "File Import Failed",
      dataIndex: "path_file_failed",
      key: "path_file_failed",
      width: 100,
      minWidth: 70,
      maxWidth: 200,
      editable: true,
      render: (text) => (
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
          {splitString(text)}
        </a>
      )
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      minWidth: 70,
      maxWidth: 150,
      editable: true,
      render: (text, record) => (
        <span>{getAdjustedTime(record.createdAt)}</span>
      )
    }
  ]

  const handleModalClosed = () => {
    clearErrors()
    reset()
    setValueImport([])
    setTableData([])
  }
  const handleCancel = () => {
    handleModal()
    clearErrors()
    reset()
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
    const url = `${process.env.PUBLIC_URL}/template/[LECTURE]-SPRING2024-STUDENT-FUHL.xlsx`
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '[LECTURE]-SPRING2024-STUDENT-FUHL.xlsx')
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  return (
    <Fragment >
      <Modal
        isOpen={openModal && typeModal === 'ImportStudent'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered' style={{ maxWidth: '70%' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Import Student Into Class' />
          <ModalBody>
            <div className='border p-2 mb-2'>
              <Row className='import-component'>
                <Col sm='12'>
                  <Card>
                    <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Table Import History')}</h2>
                    <div className='react-dataTable mx-2'>
                      <TableAntd
                        //components={components}
                        dataSource={dataHis}
                        rowClassName={getRowClassName}
                        bordered
                        columns={columns}
                        pagination={false}
                        loading={loading}
                        scroll={{
                          x: 'max-content',
                          y: '230px'
                        }}
                      />
                    </div>
                    <CardHeader className='d-flex flex-column justify-content-start flex-wrap'>
                      <CardTitle tag='h4' className='ml-auto'>DownLoad Template</CardTitle>
                      <div className='d-flex justify-content-end'>
                        <a href="" onClick={downloadTemplate}>Click here to download template</a>
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
