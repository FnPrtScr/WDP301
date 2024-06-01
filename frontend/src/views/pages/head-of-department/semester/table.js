/* eslint-disable no-unused-vars */
import { Fragment, useState, useContext, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Switch, DatePicker, Tour } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import { BsFillQuestionCircleFill } from "react-icons/bs"
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
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import { notificationSuccess, notificationError } from '../../../../utility/notification'
import dayjs from 'dayjs'
import '../../../../styles/table.css'
import { getSocket } from '../../../../serviceWorker'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({
  handleAdd,
  handleFilter,
  currentStatus,
  setcurrentStatus,
  refSearch,
  refSelectYear,
  refBtnAdd
}) => {
  const { t } = useTranslation()
  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      <div className='d-flex align-items-center mx-50'>
        <div ref={refSearch}>
          <InputGroup className='my-25'>
            <Input
              id='search-invoice'
              style={{ minWidth: '200px' }}
              placeholder={t('Search')}
              type='search'
              value={searchText}
              onChange={e => {
                if (e.target.value) {
                  setSearchTerm(e.target.value)
                } else {
                  handleFilter('')
                  setSearchTerm(e.target.value)
                }

              }}
            />
            <span style={{ cursor: 'pointer' }} onClick={() => { handleFilter(searchText) }} className='input-group-text '>
              <SearchOutlined></SearchOutlined>
            </span>
          </InputGroup>
        </div>
        <div style={{ minWidth: "220px", maxWidth: "220px", marginLeft: '2rem' }} ref={refSelectYear}>
          <DatePicker
            picker="year"
            className='my-25 w-100'
            onChange={(date, dateString) => {
              setcurrentStatus(dateString)
            }}
          />
        </div>
      </div>
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
  // khai bao ref của những phần tử cần định nghĩa
  const refSearch = useRef(null)
  const refSelectYear = useRef(null)
  const refBtnAdd = useRef(null)
  const refTable = useRef(null)
  const refPagination = useRef(null)
  // khai báo state để mở định nghĩa
  const [openNote, setOpenNote] = useState(false) 
  const {
    setDataItem,
    handleModal,
    // handleModalResetPassword,
    setTypeModal,
    windowSize,
    handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(UserContext)
  const socket = getSocket()
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState({
  })
  const campus = window.localStorage.getItem('campus')

  // Đinh nghĩa 
  const steps = [
    {
      title: "Search",
      description: "You can filter by Semester Name",
      placement: 'rightBottom',
      target: () => refSearch.current
    },
    {
      title: "Select year",
      description: "You can filter by Start date and End date",
      target: () => refSelectYear.current
    },
    {
      title: "Button Add",
      description: "You can open modal to add semesters",
      target: () => refBtnAdd.current
    },
    {
      title: "Table semesters",
      description: "View list semesters",
      target: () => refTable.current
    },
    {
      title: "Pagination",
      description: "You can paginate your seme",
      placement: 'rightBottom',
      target: () => refPagination.current
    }
  ]

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current)
    setRowsPerPage(pagination.pageSize)
    setTableParams({
      pagination,
      filters,
      ...sorter
    })
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([])
    }
  }
  const fetchData = (year) => {
    setLoading(true)
    api.semesterApi.getPaggingSemesterApi({ keyword: searchTerm, year: currentStatus, page: currentPage }, campus)
      .then((rs) => {
        setData(rs && rs.data.rows.map((item, index) => ({
          key: index + 1,
          semester_id: item?.semester_id,
          name: item?.name,
          startDate: dayjs(item?.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(item?.endDate).format('YYYY-MM-DD'),
          status: item?.status
        })))
        setTotalItems(rs.totalPages)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.totalPages
          }
        })
      }).catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(tableParams), loadTable, searchTerm, currentStatus, currentPage])

  const handleAdd = () => {
    setDataItem({})
    setTypeModal('Add')
    handleModal()
  }


  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  const handlePerPage = (e) => {
    setRowsPerPage(e.currentTarget.value)
  }

  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }

  const CustomPagination = () => {
    const countPage = Number(Math.ceil(totalItems))
    return (
      <div className='d-flex align-items-center w-100 justify-content-between'>
        <div ref={refPagination}>
          <ReactPaginate
            previousLabel={''}
            nextLabel={''}
            pageCount={countPage || 1}
            activeClassName='active'
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            onPageChange={page => handlePagination(page)}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
          />
        </div>
      </div >
    )
  }

  const handleDelete = (item) => {
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this semester?"),
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: t("Comfirm"),
      cancelButtonText: t("Cancel"),
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1"
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.value) {
        api.semesterApi.deleteSemesterApi({}, campus, item.semester_id)
          .then((rs) => {
            handleLoadTable()
            notificationSuccess(t('Delete success'))
            socket.emit('notifications')
          }).catch((e) => {
            if (e.response.status === 500) {
              notificationError(t(e.response.data))
            } else {
              notificationError(t('Assign project fail'))
            }
          })
        // handleDelete(contextMenuClick.rowInfo.rowData.id)
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }

  const handleEdit = (item) => {
    setDataItem(item)
    setTypeModal('Edit')
    handleModal()
  }

  const handleStatusChange = (checked, record) => {
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to change status this semester?"),
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1"
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedStatus = checked ? 'active' : 'inactive'
        api.semesterApi.changeStatusApi({ status: updatedStatus }, campus, record.semester_id)
          .then(() => {
            handleLoadTable()
            notificationSuccess(t('Change Status success'))
            socket.emit('notifications')
          })
          .catch((error) => {
            console.error("Error changing status:", error)
            notificationError(t('Failed to change status'))
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        // Do nothing if cancelled
      }
    })
  }

  const headerColumns = [
    {
      title: t('Semester Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: t('Start Date'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 150,
      align: 'center'
    },
    {
      title: t('End Date'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 150,
      align: 'center'
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (status, record) => (
        <Space>
          <Switch style={{
            borderRadius: '15px', background: status ? '#7367f0' : 'rgba(0, 0, 0, 0.45)'
          }}
            checked={status}
            onChange={(checked) => handleStatusChange(checked, record)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Space>
      )
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      )
    }
  ]
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  // 'overflow-hidden'
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex align-items-center'>
          <h2 style={{ fontWeight: '700' }} className='px-2'>{t('Semester')}</h2>
          <Button
            color="secondary"
            icon={<BsFillQuestionCircleFill />}

            onClick={() => setOpenNote(true)} />
        </div>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              currentStatus={currentStatus}
              setcurrentStatus={setcurrentStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              handleAdd={handleAdd}
              refSearch={refSearch}
              refSelectYear={refSelectYear}
              refBtnAdd={refBtnAdd}
              setOpenNote={setOpenNote}
            // handleExport={handleExport}
            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2' ref={refTable}>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            // pagination={tableParams.pagination}
            pagination={false}
            onChange={handleTableChange}
            loading={loading}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
            rowClassName={getRowClassName}
          ></Table>
        </div>
        <div ref={refPagination}>
          <CustomPagination />
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
