import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Card,
  Input,
  Button,
  Badge,
  Col,
  Row,
  InputGroup
} from 'reactstrap'
import { ProjectContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleAdd }) => {
  const { t } = useTranslation()
  //const isDefaultOptions = [
  //  { value: true, label: t('Active') },
  //  { value: false, label: t('Inactive') }
  //]
  //const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        {/*<InputGroup className='my-25'>
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
        </InputGroup>*/}
      </div>
      <div className='d-flex justify-content-end mx-2'>
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
    handleLoadTable,
    loadTable,
    typeModal,
    setDataDetail
  } = useContext(ProjectContext)
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [loading, setLoading] = useState(false)
  const [dataProject, setDataProject] = useState(location.state)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()
  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current)
    setRowsPerPage(pagination.pageSize)
    setTableParams({
      pagination,
      filters,
      ...sorter
    })

    useEffect(() => {
      const obj = location.state
      setDataProject({ ...obj })
    }, [])

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([])
    }
  }

  const fetchData = () => {
    setLoading(true)
    api.funcrmApi.getAllFunctionApi({ keyword: searchTerm, page: currentPage }, campus, semester, dataProject?.project_id)
      .then((rs) => {
        setData(rs.data.FunctionRequirements && rs.data.FunctionRequirements.map((item, index) => ({
          key: index + 1,
          id: item?.functionrequirement_id,
          name: item?.name,
          feature: item?.feature,
          LOC: item?.LOC,
          complexity: item?.complexity,
          description: item?.description
        })))
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

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

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
      text: t("Do you want to delete this function?"),
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
        api.funcrmApi.RemoveFunctionApi({}, campus, semester, dataProject?.project_id, item.id)
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
  useEffect(() => {
    if (typeModal === 'Detail') {
      api.funcrmApi.getAllFunctionApi({}, campus, semester)
        .then((rs) => {
          if (rs.success === true) {
            setDataDetail(rs)
          } else {
            notificationError(t('Delete fail'))
          }
        })
    }
  }, [typeModal])

  const headerColumns = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 50
    },
    {
      title: t('Function Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: t('Feature'),
      dataIndex: 'feature',
      key: 'feature',
      width: 75
    },
    {
      title: t('LOC'),
      dataIndex: 'LOC',
      key: 'LOC',
      width: 50,
      align: 'center'
    },
    {
      title: t('Complexity'),
      dataIndex: 'complexity',
      key: 'complexity',
      width: 75,
      align: 'center'
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 200
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        < Space size="middle" >
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
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='mx-2 mt-2'>
          <Space size="middle">
            <Tooltip>
              <span onClick={handleGoBack} style={{ cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center' }}>
                <ArrowLeftOutlined></ArrowLeftOutlined>
                <span style={{ marginLeft: '8px' }}>Go Back</span>
              </span>
            </Tooltip>
          </Space>
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Function Requirement')}</h2>
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
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
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
          {/*<CustomPagination />*/}
        </div>
      </Card>
    </Fragment >

  )
}

export default Position
