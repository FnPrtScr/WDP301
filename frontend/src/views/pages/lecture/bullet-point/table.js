import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip } from 'antd'
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
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleAdd, handleImport, handleFilter }) => {
  const { t } = useTranslation()
  //const isDefaultOptions = [
  //  { value: true, label: t('Active') },
  //  { value: false, label: t('Inactive') }
  //]
  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
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
        {/*<div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
          <Select
            //theme={selectThemeColors}
            isClearable={true}
            className='my-25 react-select w-100'
            classNamePrefix='select'
            menuPosition="fixed"
            placeholder={t('Select status')}
            options={isDefaultOptions}
            value={currentStatus}
            onChange={data => {
              setcurrentStatus(data)
            }}
          />
        </div>*/}
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleImport}>
          {t('Import Class')}
        </Button>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAdd}>
          {t('Add')}
        </Button>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
  const {
    setDataItem,
    handleModal,
    // handleModalResetPassword,
    setTypeModal,
    windowSize,
    //handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(UserContext)
  const socket = getSocket()
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  const role = window.localStorage.getItem('role')
  const semester = window.localStorage.getItem('semester')
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

  const fetchData = () => {
    setLoading(true)
    //api.userRoleSemesterApi.getAllLectureApi({ size: rowsPerPage, page: currentPage, keyword: searchTerm, status: currentStatus?.value }, role, semester)
    api.classesApi.getAllClassesApi({ keyword: searchTerm, page: currentPage }, role, semester)
      .then((rs) => {
        setData(rs.data)
        setTotalItems(rs.total)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.data.totalItems
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

  const handleImport = () => {
    setDataItem({})
    setTypeModal('Import')
    handleModal()
  }
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  //const handlePerPage = (e) => {
  //  setRowsPerPage(e.currentTarget.value)
  //}

  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }

  const CustomPagination = () => {
    const countPage = Number(Math.ceil(totalItems / rowsPerPage))
    return (
      <div className='d-flex align-items-center w-100 justify-content-between'>
        <div className='ps-2'>
        </div>
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
      </div >
    )
  }

  const handleDelete = (item) => {
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this class?"),
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
        api.classesApi.deleteOneClassesApi({}, role, semester, item.classesId)
          .then((rs) => {
            if (rs.success === true) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Delete fail'))
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

  //const handleDetail = (item) => {
  //  setDataItem(item)
  //  handleModalDetail()
  //  setTypeModal('Detail')
  //}

  const headerColumns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: t('% point'),
      dataIndex: '',
      key: '',
      width: 150
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        < Space size="middle" >
          {/*<Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleDetail(record) }} />
          </Tooltip>*/}
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEdit(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDelete(record) }}></DeleteOutlined>
          </Tooltip>


        </Space >
      )
    }

  ]
  // 'overflow-hidden'
  const modifiedData = data && data.rows ? data.rows.map(item => {
    const user = item.User
    const className = item.name
    const classId = item.class_id
    const quantity = item.quantity
    return {
      lectureId: user.user_id,
      lectureEmail: user.email,
      lectureName: `${user.first_name !== null ? user.first_name : ''} ${user.last_name !== null ? user.last_name : ''}`,
      name: className,
      classesId: classId,
      classesQuantity: quantity
    }
  }) : []
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Class In Semester')}</h2>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              currentStatus={currentStatus}
              setcurrentStatus={setcurrentStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              handleAdd={handleAdd}
              handleImport={handleImport}
            // handleExport={handleExport}
            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={modifiedData}
            bordered
            columns={headerColumns}
            pagination={false}
            onChange={handleTableChange}
            loading={loading}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
          ></Table>
          <CustomPagination />
        </div>
      </Card>
    </Fragment >

  )
}

export default Position
