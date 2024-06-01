/* eslint-disable no-unused-vars */
import { Fragment, useState, useContext, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Table, Tag, Modal, Space, Tooltip, Switch, DatePicker, Tour } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import Select from 'react-select'
import {
  Card,
  Input,
  Button,
  Badge,
  Col,
  Row,
  InputGroup
} from 'reactstrap'
import { RequestContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import { notificationSuccess, notificationError } from '../../../../utility/notification'
import dayjs from 'dayjs'
import { PUBLIC_URL_SERVER, PUBLIC_URL_SERVER_API } from "../../../../dataConfig"
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleAdd, optionStatus, status, setStatus, refOption, refBtnAdd }) => {
  const { t } = useTranslation()
  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <div style={{ minWidth: "200px", maxWidth: "200px" }}>
          <div ref={refOption}><Select
            className='my-25 react-select w-100'
            classNamePrefix='select'
            menuPosition="fixed"
            placeholder={t('Select status')}
            options={optionStatus}
            value={optionStatus.find((val) => val.value === status)}
            onChange={e => {
              setStatus(e.value)
            }}
          />
        </div>
      </div></div>
          
      <div className='d-flex justify-content-end mx-2' ref={refBtnAdd}>
        <Button className='add-new-semester  mx-50  my-25' color='primary' onClick={handleAdd}>
          {t('Add')}
        </Button>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
  // 
  const refOption = useRef(null)
   const refBtnAdd = useRef(null)
   const refTable = useRef(null)
   //
   const [openNote, setOpenNote] = useState(false)
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    windowSize,
    handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(RequestContext)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [status, setStatus] = useState(0)
  const steps = [
    {
      title: "Opyion",
      description: "You can choose option",
      placement: 'rightBottom',
      target: () => refOption.current
    },
    {
      title: "Button Add",
      description: "You can open modal to add classes",
      target: () => refBtnAdd.current
    },
    {
      title: "Table request",
      description: "View list request",
      target: () => refTable.current
    }
  ]
  const optionStatus = [
    { value: 0, label: 'Processing' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' }
  ]
  const fetchData = async () => {
    api.requestApi.getRequestByStudentApi({ status: status === 0 ? 'processing' : status === 1 ? 'approved' : status === 2 ? 'rejected' : '' }, campus, semester)
      .then((rs) => {
        setData(rs.data)
      }).catch(() => {
      })
  }

  useEffect(() => {
    fetchData()
  }, [loadTable, status])

  const handleAdd = () => {
    setDataItem({})
    setTypeModal('Add')
    handleModal()
  }


  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }

  const handleEdit = (item) => {
    setDataItem(item)
    setTypeModal('Edit')
    handleModal()
  }

  const handleTitleClick = (item) => {
    // Xử lý logic khi title được click
    navigate(`/student/manage-function/${item.name}`, { state: item })
    setDataItem(item)
  }


  const handleDownload = (text) => {
    fetch(`${PUBLIC_URL_SERVER_API}/download/pdf?n=${text}`, {
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

  const headerColumns = [
    {
      title: t('Project Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: t('File Requirement'),
      dataIndex: 'file_path_requirement',
      key: 'file_path_requirement',
      width: 150,
      render: (text) => {
        if (text) {
          return (
            <a href='#' target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
              {splitString(text)}
            </a>
          )
        } else {
          return null
        }
      }
    },
    {
      title: t('CreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 100
    },
    {
      title: t('Feedback'),
      dataIndex: 'note',
      key: 'note',
      width: 100,
      render: (text) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
      )
    },
    {
      title: t('Respone Time'),
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 100
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleTitleClick(record) }} />
          </Tooltip>
          {status === 0 && <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => handleEdit(record)} />
          </Tooltip>}
        </Space>
      )
    }
  ]
  // 'overflow-hidden'
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex align-items-center'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Request')}</h2>
        <Button
            color="secondary"
            icon={<BsFillQuestionCircleFill />}

            onClick={() => setOpenNote(true)} />
        </div>
        
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              handleAdd={handleAdd}
              optionStatus={optionStatus}
              status={status}
              setStatus={setStatus}
            // handleExport={handleExport}
            refBtnAdd={refBtnAdd}
              refOption={refOption}
            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2 mb-2' ref={refTable}>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
            pagination={false}

          ></Table>
        </div>
      </Card>
      <Tour
        open={openNote}
        onClose={() => setOpenNote(false)}
        steps={steps}
      />
    </Fragment >
  )
}

export default Position
