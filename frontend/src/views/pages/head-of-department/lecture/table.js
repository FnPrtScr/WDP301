import { Fragment, useState, useContext, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Tour } from 'antd'
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
import '.././table.css'
import api from '../../../../api'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleAdd, handleImport, handleFilter, refSearch, refBtnImportLerturer, refBtnAddLerturer }) => {
  const { t } = useTranslation()
  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
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

        <div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
        </div>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <div ref={refBtnImportLerturer}>
          <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleImport}>
            {t('Import Lecturer')}
          </Button>
        </div>
        <div ref={refBtnAddLerturer}>
          <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAdd}>
            {t('Add Lecturer')}
          </Button>
        </div>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
  //
  const refSearch = useRef(null)
  const refBtnImportLerturer = useRef(null)
  const refBtnAddLerturer = useRef(null)
  const refTable = useRef(null)
  const refPagination = useRef(null)
  // khai báo state để mở định nghĩa
  const [openNote, setOpenNote] = useState(false)
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    handleLoadTable,
    windowSize,
    loadTable
  } = useContext(UserContext)
  const socket = getSocket()
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  //const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  const steps = [
    {
      title: "Search",
      description: "You can filter by List Lecturer",
      placement: 'rightBottom',
      target: () => refSearch.current
    },
    {
      title: "Button Import Lecturer",
      description: "You can open modal to Import Lecturer",
      target: () => refBtnImportLerturer.current
    },
    {
      title: "Button Add Lecturer ",
      description: "You can open modal to add lecturer",
      target: () => refBtnAddLerturer.current
    },
    {
      title: "Table semesters",
      description: "View list lecturer",
      target: () => refTable.current
    },
    {
      title: "Pagination",
      description: "You can paginate your seme",
      placement: 'Bottom',
      target: () => refPagination.current
    }
  ]
  const roles = [
    { roleId: 1, roleName: 'HeadOfDepartment' },
    { roleId: 2, roleName: 'Lecturer' },
    { roleId: 3, roleName: 'Reviewer' },
    { roleId: 4, roleName: 'Student' }
  ]
  //const tagColors = ['red', 'blue', 'green', 'orange']
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.roleId === roleId)
    return role ? role.roleName : 'Unknown Role'
  }
  const semester = window.localStorage.getItem('semester')
  const campus = window.localStorage.getItem('campus')
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
    api.userRoleSemesterApi.getAllLectureApi({ keyword: searchTerm, page: currentPage }, campus, semester)
      .then((rs) => {
        const offset = (currentPage - 1) * 10
        setData(rs && rs.data ? rs.data.map((item, index) => {
          const user = item[Object.keys(item)][0].User
          const roleNames = item[Object.keys(item)[0]].map((userRole) => getRoleName(userRole.role_id)).sort().join(', ')
          const classesNames = user.Classes.map(cls => cls.name)
          const colectureClassesNames = user.ColectureClasses.map(colecture => colecture.Class.name)
          const reviewerClassesNames = user.ReviewerClasses.map(reviewer => reviewer.Class.name)

          return {
            idx: index + 1 + offset,
            key: user.user_id,
            email: user.email,
            name: roleNames,
            classesNames,
            colectureClassesNames,
            reviewerClassesNames
          }
        }).flat() : [])
        setTotalItems(rs.totalPages)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.data.totala
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

  const handleEdit = (item) => {
    setDataItem(item)
    setTypeModal('Edit')
    handleModal()
  }

  const handleDelete = (item) => {
    //const class_ids = [item.key]

    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this Lecturer?"),
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
        api.userRoleSemesterApi.deleteLectureApi({}, campus, semester, item.key)
          .then((rs) => {
            if (rs.statusCode === 201) {
              notificationSuccess(t('Delete success'))
              handleLoadTable()
              socket.emit('notifications')
            }
          })
          .catch((e) => {
            if (e.response.status === 500) {
              const errorMessage = e.response.data.error.message
              notificationError(t(errorMessage))
            } else {
              notificationError(t('Delete fail')) // Hoặc thông báo lỗi mặc định nếu không tìm thấy thông điệp lỗi
            }
          })
        // handleDelete(contextMenuClick.rowInfo.rowData.id)
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
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

  const headerColumns = [
    {
      title: <div style={{ textAlign: 'center' }}>{t('Index')}</div>,
      dataIndex: 'idx',
      key: 'idx',
      width: 70,
      minWidth: 50,
      maxWidth: 100,
      align: 'center'
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Email')}</div>,
      dataIndex: 'email',
      key: 'email',
      width: 100,
      minWidth: 80,
      maxWidth: 150
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Lecturer class')}</div>,
      dataIndex: 'classesNames',
      key: 'classesNames',
      width: 100,
      minWidth: 80,
      maxWidth: 150,
      ellipsis: true,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {record.classesNames.map((className, classIndex) => (
            <Fragment key={classIndex}>
              <Tag style={{ fontSize: '14px' }} key={classIndex}>{className}</Tag>
              <br /> {/* Để mỗi tag nằm trên một dòng */}
            </Fragment>
          ))}
        </div >
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Co-Lecturer class')}</div>,
      dataIndex: 'colectureClassesNames',
      key: 'colectureClassesNames',
      width: 100,
      minWidth: 80,
      maxWidth: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
            record.colectureClassesNames.map((colectureClassName, colectureClassIndex) => (
              <Fragment key={colectureClassIndex}>
                <Tag style={{ fontSize: '14px' }} key={colectureClassIndex}>{colectureClassName}</Tag>
                <br /> {/* Để mỗi tag nằm trên một dòng */}
              </Fragment>

            ))
          }
        </div >
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Reviewer class')}</div>,
      dataIndex: 'reviewerClassesNames',
      key: 'reviewerClassesNames',
      width: 100,
      minWidth: 80,
      maxWidth: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {record.reviewerClassesNames.map((reviewerClassName, reviewerClassIndex) => (
            <Fragment key={reviewerClassIndex}>
              <Tag style={{ fontSize: '14px' }} key={reviewerClassIndex}>{reviewerClassName}</Tag>
              <br /> {/* Để mỗi tag nằm trên một dòng */}
            </Fragment>
          ))}
        </div>
      )
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      render: (_, record) => (
        < Space size="middle" >
          <Tooltip title={t('Edit')}>
            <EditOutlined onClick={() => { handleEdit(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDelete(record) }}></DeleteOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }

  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex align-items-center'>
          <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('List Lecturer')}</h2>
          <div style={{
            width: "30px",
            height: "30px",
            border: "gray 1px solid",
            display: "flex",
            cursor: "pointer",
            justifyContent: "center",
            marginTop: "12px",
            alignItems: "center"
          }}>
            <BsFillQuestionCircleFill onClick={() => setOpenNote(true)} />
          </div>
        </div>

        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              currentStatus={currentStatus}
              setcurrentStatus={setcurrentStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
              handleAdd={handleAdd}
              handleImport={handleImport}
              refSearch={refSearch}
              refBtnImportLerturer={refBtnImportLerturer}
              refBtnAddLerturer={refBtnAddLerturer}

            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2' ref={refTable}>
          <Table
            dataSource={data}
            bordered
            columns={headerColumns}
            pagination={false}
            onChange={handleTableChange}
            loading={loading}
            scroll={{
              x: 'max-content',
              y: windowSize.innerHeight - 280
            }}
            rowClassName={getRowClassName}
          ></Table>
          <div ref={refPagination}>
            <CustomPagination />
          </div>

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
