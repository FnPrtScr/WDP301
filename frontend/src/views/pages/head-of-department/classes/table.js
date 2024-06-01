import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Checkbox } from 'antd'
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
import '.././table.css'
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
    handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(UserContext)
  const [showCheckbox, setShowCheckbox] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const socket = getSocket()
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [dataResit, setDataResit] = useState([])
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
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  //const userData = getUserData()
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
    api.classesApi.getAllClassesApi({ keyword: searchTerm, page: currentPage }, campus, semester)
      .then((rs) => {
        const offset = (currentPage - 1) * 10
        setData(rs.data && rs.data.rows ? rs.data.rows.map((item, index) => ({
          key: item.class_id,
          idx: index + 1 + offset,
          name: item.name,
          quantity: item.quantity,
          lecturer_id: item.Lecture ? item.Lecture.user_id : null,
          label: item.Lecture ? item.Lecture.email : null,
          ownerId: item.Owner ? item.Owner.user_id : null,
          //lectureName: item.User ? `${item.User.first_name !== null ? item.User.first_name : ''} ${item.User.last_name !== null ? item.User.last_name : ''}` : '',
          colectureEmail: item.ColectureClasses && item.ColectureClasses.length ? item.ColectureClasses.map(colecture => colecture.User.email) : [],
          reviewerEmail: item.ReviewerClasses && item.ReviewerClasses.length ? item.ReviewerClasses.map(reviewer => reviewer.User.email) : [],
          colectures: item.ColectureClasses && item.ColectureClasses.length ? item.ColectureClasses.map(colecture => (colecture.colecture_id)) : [],
          reviewers: item.ReviewerClasses && item.ReviewerClasses.length ? item.ReviewerClasses?.map(reviewer => (reviewer.reviewer_id)) : []
        })) : [])
        setTotalItems(rs.totalPages)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.data.counta
          }
        })
      }).catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchData()
  }, [JSON.stringify(tableParams), loadTable, searchTerm, currentStatus, currentPage])

  const getchDataResit = () => {
    setLoading(true)
    api.classesApi.getClassResitApi({}, campus, semester)
      .then((rs) => {
        setDataResit(rs && rs.data.map(item => {
          const getClass = item.getClass
          const lecture = getClass.Lecture
          const colectureClasses = getClass.ColectureClasses
          const reviewerClasses = getClass.ReviewerClasses
          const team = item.arrTeam[0].te
          const reviewerResit = item.arrTeam[0].getReviewers.map(revre => ({ value: revre.reviewer_id, label: revre.User.email }))
          const coLectures = colectureClasses.map(co => ({ coLecture_id: co.colecture_id, coLecture_email: co.User.email }))
          const reviewers = reviewerClasses.map(rev => ({ reviewer_id: rev.reviewer_id, reviewer_name: rev.User.email }))

          return {
            class_name: getClass.name,
            class_id: getClass.class_id,
            lecture_email: lecture.email,
            key: lecture.user_id,
            coLectures,
            reviewers,
            team_name: team.name,
            team_id: team.team_id,
            reviewerResit
          }
        }))
        setLoading(false)

      }).catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getchDataResit()
  }, [loadTable])
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
  const handleToggleCheckbox = (record) => {
    // Toggle chọn/bỏ chọn một item
    const newSelectedItems = [...selectedItems]
    const index = newSelectedItems.findIndex(item => item.key === record.key)
    if (index !== -1) {
      newSelectedItems.splice(index, 1) // Bỏ chọn
    } else {
      newSelectedItems.push(record) // Chọn
    }
    setSelectedItems(newSelectedItems)
  }

  const handleToggleAllCheckbox = () => {
    setShowCheckbox(!showCheckbox)
    if (selectedItems.length === data.length && showCheckbox) {
      setSelectedItems([]) // Bỏ chọn tất cả nếu đã chọn hết
    } else {
      setSelectedItems([...data]) // Chọn tất cả
    }
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

  const handleDelete = (item) => {
    //const class_ids = [item.key]

    MySwal.fire({
      title: t("Confirm"),
      text: t("Deleting this class will delete the all information this class is working on this semester, are you sure you want to delete it?"),
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
        api.classesApi.deleteOneClassesApi({ class_ids: [item.key] }, campus, semester)
          .then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
              setSelectedItems([])
              setShowCheckbox(false)
            } else {
              notificationError(t(rs.error.message.map(item => item)))
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
  const handleDeleteAllClass = () => {

    const class_ids = selectedItems.map(item => item.key)
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete all Class! Deleting this group will delete the class information this class is working on this semester, are you sure you want to delete it?"),
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
        api.classesApi.deleteOneClassesApi({ class_ids }, campus, semester)
          .then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
              setSelectedItems([])
              setShowCheckbox(false)
            } else {
              notificationError(t(rs.error.message.map(item => item)))
            }
          })
          .catch((e) => {
            //notificationError(t('Delete fail'))
            if (e.response.status === 500) {
              if (e.response.data.error.message.length > 0) {
                notificationError(t(e.response.data.error.message.map(item => item)))
              } else {
                notificationError(t('Delete fail'))
              }
            }
          })
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
  const handleAssignResit = (item) => {
    setDataItem(item)
    setTypeModal('AssignResit')
    handleModal()
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
      title: <div style={{ textAlign: 'center' }}>{t('Class Name')}</div>,
      dataIndex: 'name',
      key: 'name',
      width: 80,
      minWidth: 50,
      maxWidth: 100,
      align: 'center'
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Lecture Email')}</div>,
      dataIndex: 'label',
      key: 'label',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Co-Lecture Email')}</div>,
      dataIndex: 'colectureEmail',
      key: 'colectureEmail',
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        <div>
          {record.colectureEmail.map((email, index) => (
            <Fragment key={index}>
              <Tag style={{ marginBottom: '4px', fontSize: '14px' }} key={index}>{email}</Tag>
              <br /> {/* Để mỗi tag nằm trên một dòng */}
            </Fragment>
          ))}
        </div>
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Reviewer Email')}</div>,
      dataIndex: 'reviewerEmail',
      key: 'reviewerEmail',
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        <div>
          {record.reviewerEmail.map((email, index) => (
            <div key={index}>
              <Tag style={{ fontSize: '14px', marginBottom: '4px' }} key={index}>{email}</Tag>
            </div>
          ))
          }
        </div >
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Quantity')}</div>,
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      align: 'center'
    },
    {
      title: (
        <div>
          <Space size="middle">
            Action
            <Checkbox onChange={handleToggleAllCheckbox} checked={showCheckbox} />
            {showCheckbox && (
              <Tooltip title={t(`Delete all select checkbox`)}>
                <DeleteOutlined onClick={handleDeleteAllClass} />
              </Tooltip>
            )}
          </Space>
        </div>),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 100,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        < Space size="middle" >
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleDetail(record) }} />
          </Tooltip>
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEdit(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDelete(record) }}></DeleteOutlined>
          </Tooltip>
          {showCheckbox && (
            <Checkbox
              checked={selectedItems.some(item => item.key === record.key)}
              onChange={() => handleToggleCheckbox(record)}
            />
          )}
        </Space >
      )
    }
  ]
  const headerRestiColumns = [
    {
      title: <div style={{ textAlign: 'center' }}>{t('Class Name')}</div>,
      dataIndex: 'class_name',
      key: 'class_name',
      width: 80,
      minWidth: 50,
      maxWidth: 100,
      align: 'center'
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Lecture Email')}</div>,
      dataIndex: 'lecture_email',
      key: 'lecture_email',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Co-Lecture Email')}</div>,
      dataIndex: 'coLectures',
      key: 'coLectures',
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        <div>
          {record.coLectures.map((email, index) => (
            <Fragment key={index}>
              <Tag style={{ marginBottom: '4px', fontSize: '14px' }} key={index}>{email.coLecture_email}</Tag>
              <br /> {/* Để mỗi tag nằm trên một dòng */}
            </Fragment>
          ))}
        </div>
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Reviewer Email')}</div>,
      dataIndex: 'reviewers',
      key: 'reviewers',
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        <div>
          {record.reviewers.map((email, index) => (
            <div key={index}>
              <Tag style={{ fontSize: '14px', marginBottom: '4px' }} key={index}>{email.reviewer_name}</Tag>
            </div>
          ))
          }
        </div >
      )
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Reviewer Resit Email')}</div>,
      dataIndex: 'reviewerResit',
      key: 'reviewerResit',
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      render: (_, record) => (
        <div>
          {record.reviewerResit.map((email, index) => (
            <div key={index}>
              <Tag style={{ fontSize: '14px', marginBottom: '4px' }} key={index}>{email.label}</Tag>
            </div>
          ))
          }
        </div >
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
          <Tooltip title={t(`Assign Reviewer Resit`)}>
            <EditOutlined onClick={() => { handleAssignResit(record) }}></EditOutlined>
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
            />
          </Col>
        </Row>
        <div className='react-dataTable mx-2'>
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
          <CustomPagination />
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Class Resit In Semester')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            dataSource={dataResit}
            bordered
            columns={headerRestiColumns}
            pagination={false}
            onChange={handleTableChange}
            loading={loading}
            scroll={{
              x: 'max-content',
              y: windowSize.innerHeight - 280
            }}
            rowClassName={getRowClassName}
          ></Table>
          {/*<CustomPagination />*/}
        </div>
      </Card>
    </Fragment >
  )
}

export default Position
