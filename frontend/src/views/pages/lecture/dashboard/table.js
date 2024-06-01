import { Fragment, useState, useContext } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip } from 'antd'
import { EditOutlined, CloseCircleOutlined, CheckCircleOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons"
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
const MySwal = withReactContent(Swal)

const { role } = "ROLE_EMPLOYEE"

const roleFlag = role === "ROLE_EMPLOYEE" || role === "ROLE_MANAGER" || role === "ROLE_HR" || role === "ROLE_ADMINISTRATIVE"


// ** Table Header
const CustomHeader = ({ handleAdd, handleFilter, currentStatus, setcurrentStatus }) => {
  const { t } = useTranslation()
  const isDefaultOptions = [
    { value: true, label: t('Active') },
    { value: false, label: t('Inactive') }
  ]
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
        <div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
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
        </div>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button hidden={roleFlag} className='add-new-user  mx-50  my-25' color='primary' onClick={handleAdd}>
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
    handleModalDetail,
    handleLoadTable
  } = useContext(UserContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  // const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: role === "ROLE_MANAGER" || role === "ROLE_EMPLOYEE" ? 1000 : 10

    }
  })

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
    const countPage = Number(Math.ceil(totalItems / rowsPerPage))
    return (
      <div className='d-flex align-items-center w-100 justify-content-between'>
        <div className='ps-2'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>{t('Show')}</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Input>
            <label htmlFor='rows-per-page'>{t('Entries')}</label>
          </div>
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
      text: t("Do you want to change status?"),
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
        api.departmentApi.ChangeStatusApi({ id: item.department_id })
          .then((rs) => {
            if (rs.status.code === "SUCCESS") {
              handleLoadTable()
              notificationSuccess(t('Update success'))
            } else {
              notificationError(t('Update fail'))
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

  const handleDetail = (item) => {
    setDataItem(item)
    handleModalDetail()
    setTypeModal('Detail')
  }

  const statusObjColor = {
    true: 'light-success',
    false: 'light-danger'
  }

  const headerColumns = [
    {
      title: t('Department code'),
      dataIndex: 'code',
      key: 'code',
      width: 100
    },
    {
      title: t('Department name'),
      dataIndex: 'name',
      key: 'name',
      width: 150
    },

    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',

      width: 150
    },
    {
      title: t('Status'),
      key: 'status',
      dataIndex: 'status',
      width: 150,
      render: (status) => (
        <>
          <Badge className='text-capitalize' color={statusObjColor[status]}>
            {t(`${status === true ? "Active" : "Inactive"}`)}
          </Badge>
        </>
      )
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        < Space size="middle" >

          <Tooltip title={t(`Change status`)}>
            {record.status === true ? <CloseCircleOutlined hidden={roleFlag} onClick={() => { handleDelete(record) }}></CloseCircleOutlined> : <CheckCircleOutlined hidden={roleFlag} onClick={() => { handleDelete(record) }}></CheckCircleOutlined>}
          </Tooltip>
          <Tooltip title={t(`Edit`)}>
            <EditOutlined hidden={roleFlag} onClick={() => { handleEdit(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleDetail(record) }} />
          </Tooltip>
        </Space >
      )
    }

  ]
  // 'overflow-hidden'
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Department')}</h2>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              currentStatus={currentStatus}
              setcurrentStatus={setcurrentStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              handleAdd={handleAdd}
            // handleExport={handleExport}
            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
          ></Table>
        </div>
      </Card>
    </Fragment >
  )
}

export default Position
