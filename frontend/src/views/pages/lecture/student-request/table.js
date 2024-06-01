/* eslint-disable no-unused-vars */
import { Fragment, useState, useContext, useEffect, useRef } from 'react'
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
import { PUBLIC_URL_SERVER_API } from "../../../../dataConfig"
import { BsFillQuestionCircleFill } from 'react-icons/bs'
const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ status, setStatus, refOpition }) => {
  const { t } = useTranslation()
  const optionStatus = [
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <div ref={refOpition}>
        <Select
          className='my-25 react-select w-100'
          classNamePrefix='select'
          menuPosition="fixed"
          placeholder={t('Select status')}
          options={optionStatus}
          value={status}
          onChange={data => {
            setStatus(data)
          }}
        />
        </div>
        
        <div style={{ minWidth: "220px", maxWidth: "220px", marginLeft: '2rem' }}>
        </div>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
  //
  const refOpition = useRef()
  const refTableOne = useRef(null)
  const refTableTwo = useRef(null)
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

  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [dataCo, setDataCo] = useState([])
  const [status, setStatus] = useState({ value: 'processing', label: 'Processing' })
  const [isApproveVisible, setIsApproveVisible] = useState(true)
  const [isRejectVisible, setIsRejectVisible] = useState(true)

  const steps = [
    {
      title: "Option",
      description: "You can choose the option ",
      placement: 'rightBottom',
      target: () => refOpition.current
    },
    {
      title: "Table semesters",
      description: "View list semesters",
      target: () => refTableOne.current
    },
    {
      title: "Table semesters",
      description: "View list semesters",
      target: () => refTableTwo.current
    }
  ]
  useEffect(() => {
    if (status.value === 'approved' || status.value === 'rejected') {
      setIsApproveVisible(false)
      setIsRejectVisible(false)
    } else {
      setIsApproveVisible(true)
      setIsRejectVisible(true)
    }
  }, [status])


  const fetchData = async () => {
    api.requestApi.getRequestApi({ status: status.value }, campus, semester)
      .then((rs) => {
        const sortedData = rs && rs.data.parsedData.sort((a, b) => {
          if (a.team_name < b.team_name) {
            return -1
          }
          if (a.team_name > b.team_name) {
            return 1
          }
          return 0
        })

        // Sorting arrCo by team_name
        const sortedDataCo = rs && rs.data.arrCo.sort((a, b) => {
          if (a.team_name < b.team_name) {
            return -1
          }
          if (a.team_name > b.team_name) {
            return 1
          }
          return 0
        })
        setData(sortedData.map((item) => ({ ...item, class_name: item.classes.class_name, team_name: item.team_name })))
        setDataCo(sortedDataCo.map((item) => ({ ...item, class_name: item.classes.class_name, team_name: item.team_name })))
      }).catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    fetchData()
  }, [status, loadTable])


  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }

  const handleApprove = (item) => {
    setDataItem(item)
    setTypeModal('Approve')
    handleModal()
  }

  const handleReject = (item) => {
    setDataItem(item)
    setTypeModal('Reject')
    handleModal()
  }

  const handleDetail = (item) => {
    setDataItem(item)
    setTypeModal('Detail')
    handleModalDetail()
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
      title: t('Class Name'),
      dataIndex: 'class_name',
      key: 'class_name',
      width: 100
    }, {
      title: t('Team Name'),
      dataIndex: 'team_name',
      key: 'team_name',
      width: 100
    },
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
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleDetail(record) }} />
          </Tooltip>
          {isApproveVisible && (
            <Tooltip title={t(`Approve`)}>
              <Button
                color='primary'
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
            </Tooltip>
          )}
          {isRejectVisible && (
            <Tooltip title={t(`Reject`)}>
              <Button
                color='primary'
                onClick={() => handleReject(record)}
              >
                Reject
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ]
  // 'overflow-hidden'
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex align-items-center'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Student Request')}</h2>
        <Button
            color="secondary"
            icon={<BsFillQuestionCircleFill />}

            onClick={() => setOpenNote(true)} />
        </div>
        
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              status={status}
              setStatus={setStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              refOpition={refOpition}
            />
          </Col>
        </Row>
        <h3 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My Lecturer Request')}</h3>
        <div className='react-dataTable mx-2 mb-2' ref={refTableOne}>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            scroll={{
              x: 'max-content',
              y: windowSize.innerHeight - 280
            }}
            pagination={false}
          ></Table>
        </div>
        <h3 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My Co-Lecturer Request')}</h3>
        <div className='react-dataTable mx-2 mb-2' ref={refTableTwo}>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={dataCo}
            bordered
            columns={headerColumns}
            scroll={{
              x: 'max-content',
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
