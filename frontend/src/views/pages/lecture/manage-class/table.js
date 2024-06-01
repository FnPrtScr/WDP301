import { Fragment, useState, useContext, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Avatar, Card as AntdCard, Empty, Tour } from 'antd'
import { useNavigate } from 'react-router-dom'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons"
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
import { getUserData } from '@utils'
import { getSocket } from '../../../../serviceWorker'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleFilter, handleAdd, refSearch, refBtnAdd }) => {
  const { t } = useTranslation()
  //const isDefaultOptions = [
  //  { value: true, label: t('Active') },
  //  { value: false, label: t('Inactive') }
  //]
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
      <div className='d-flex justify-content-end mx-2' ref={refBtnAdd}>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAdd}>
          {t('Add My Class')}
        </Button>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
   //
   const refSearch = useRef(null)
   const refBtnAdd = useRef(null)
   const refTable = useRef(null)
   //
   const [openNote, setOpenNote] = useState(false)
  const {
    setDataItem,
    handleModal,
    // handleModalResetPassword,
    setTypeModal,
    //windowSize,
    //handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(UserContext)
  const socket = getSocket()
  const { Meta } = AntdCard
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [userData] = useState(getUserData())
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  //
  const steps = [
    {
      title: "Search",
      description: "You can filter by class name",
      placement: 'rightBottom',
      target: () => refSearch.current
    },
    {
      title: "Button Add",
      description: "You can open modal to add classes",
      target: () => refBtnAdd.current
    },
    {
      title: "Table semesters",
      description: "View list classes",
      target: () => refTable.current
    }
  ]
  //const role = window.localStorage.getItem('role')
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const navigate = useNavigate()
  const handleCardChange = (pagination) => {
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
    api.classesApi.getAllMyClassApi({ keyword: String(searchTerm).trim(), page: currentPage }, campus, semester)
      .then((rs) => {
        setData(rs.data && rs.data.rows ? rs.data.rows.map(item => ({
          key: item.class_id,
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          ownerId: item.Owner ? item.Owner.user_id : null,
          lectureId: item.Lecture ? item.Lecture.user_id : null,
          lectureEmail: item.Lecture ? item.Lecture.email : null,
          lectureName: item.Lecture ? `${item.Lecture.first_name !== null ? item.Lecture.first_name : ''} ${item.Lecture.last_name !== null ? item.Lecture.last_name : ''}` : '',
          lectureAvatar: item.Lecture ? item.Lecture.avatar : null,
          colectures: item.ColectureClasses ? item.ColectureClasses.map(colecture => ({
            key: colecture.User ? colecture.User.user_id : null,
            colectureEmail: colecture.User ? colecture.User.email : null,
            colectureName: colecture.User ? `${colecture.User.first_name !== null ? colecture.User.first_name : ''} ${colecture.User.last_name !== null ? colecture.User.last_name : ''}` : '',
            colectureAvatar: colecture.User ? colecture.User.avatar : null
          })) : [],
          reviewers: item.ReviewerClasses ? item.ReviewerClasses.map(reviewer => ({
            key: reviewer.User ? reviewer.User.user_id : null,
            reviewerEmail: reviewer.User ? reviewer.User.email : null,
            reviewerName: reviewer.User ? `${reviewer.User.first_name !== null ? reviewer.User.first_name : ''} ${reviewer.User.last_name !== null ? reviewer.User.last_name : ''}` : '',
            reviewerAvatar: reviewer.User ? reviewer.User.avatar : null
          })) : []
        })) : [])
        setTotalItems(rs.total)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.data.count
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
  const handleEdit = (item) => {
    setDataItem(item)
    setTypeModal('Edit')
    handleModal()
  }
  const handleDelete = (item) => {
    //if (item.ownerId === userData.user_id) {
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
        api.classesApi.deleteOneClassApi({}, campus, semester, item.key)
          .then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
            }
          })
          .catch(e => {
            if (e.response.status === 404) {
              notificationError(`${e.response.data.error}`)
            } if (e.response.status === 500) {
              notificationError(`${e.response.data.error}`)
            }
          })
        // handleDelete(contextMenuClick.rowInfo.rowData.id)
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
    //} else {
    //  notificationError(t('Can not delete this class because it was created by someone else'))
    //}
  }
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }
  const handleTitleClick = (item) => {
    // Xử lý logic khi title được click
    navigate(`/lecture/tab-class/${item.name}`, { state: item })

    // Thêm logic chuyển hướng đến link ẩn nếu cần
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

  const imageUrls = [
    'https://www.gstatic.com/classroom/themes/img_breakfast_thumb.jpg',
    'https://gstatic.com/classroom/themes/Honors_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_graduation_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_bookclub_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_code_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_reachout_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_learnlanguage_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_backtoschool_thumb.jpg',
    'https://gstatic.com/classroom/themes/img_read_thumb.jpg'
  ]
  const getRandomImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length)
    return imageUrls[randomIndex]
  }
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex align-items-center'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My Class')}</h2>
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
              refBtnAdd={refBtnAdd}
              refSearch={refSearch}
            />
          </Col>
        </Row>
        <div className='react-dataCard mx-2' ref = {refTable}>
          <Row>
            {data.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              data.map(item => (
                <Col key={item.key} xl={4} md={4} xs={6}>
                  <AntdCard key={item.key}
                    className='my-1'
                    cover={
                      <img
                        alt="example"
                        src={getRandomImageUrl()}
                      />
                    }
                    actions={[
                      <Tooltip title={t(`Export List Student`)}>
                        <SettingOutlined key="setting" onClick={() => { }} />
                      </Tooltip>,
                      <EditOutlined key="edit" onClick={() => { handleEdit(item) }} />,
                      <DeleteOutlined key="ellipsis" onClick={() => { handleDelete(item) }} />
                    ]}
                    onChange={() => handleCardChange(item)}
                    loading={loading}
                  >
                    <Meta
                      avatar={<Avatar src={userData.avatar ? userData.avatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${dataClass?.key}`} style={{ marginTop: '10px' }} />}
                      title={<div>
                        <span onClick={() => handleTitleClick(item)} style={{ cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.3s' }}>
                          {item.name}
                        </span>
                        <Tag color={item.status ? 'green' : 'red'} style={{ marginLeft: '10px' }}>
                          {item.status ? 'active' : 'inactive'}
                        </Tag>
                      </div>}
                      description={
                        <div>
                          <div>{`${item.lectureEmail}`}</div>
                          <div>{`Number of student in class: ${item.quantity}`}</div>
                        </div>
                      }
                    />
                  </AntdCard>
                </Col>
              )))}
          </Row>
        </div>
        {/*<CustomPagination />*/}
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
