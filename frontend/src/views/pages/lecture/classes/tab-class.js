import { Fragment, useContext, useEffect, useState } from 'react'
import { Card, Input, Button, Badge, Col, Row, InputGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { UserContext } from './useContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../../../../api'
import { Tabs, Table, Tag, Modal, Space, Tooltip, Avatar, List, Card as AntdCard, Empty, Checkbox } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, UpOutlined, ExportOutlined, DownOutlined, SearchOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined, PlusOutlined, ArrowLeftOutlined, CrownOutlined } from "@ant-design/icons"
import Select from 'react-select'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
//import { getUserData } from '@utils'
import ReactPaginate from 'react-paginate'
import '../../../../styles/table.css'
const MySwal = withReactContent(Swal)
import { getSocket } from '../../../../serviceWorker'
// ** Table Header tab 1
const CustomHeader1 = ({ handleAddTeam, handleRandom }) => {
  const { t } = useTranslation()
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleAddTeam}>
          {t('Create Group')}
        </Button>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleRandom}>
          {t('Random Group')}
        </Button>
      </div>
    </div >
  )
}
// ** Table Header tab 2
const CustomHeader = ({ handleAdd, handleImport }) => {
  const { t } = useTranslation()

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleImport}>
          {t('Import Student')}
        </Button>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAdd}>
          {t('Add Student')}
        </Button>
      </div>
    </div >
  )
}

const tabClass = () => {
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
  const location = useLocation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  //const [userData] = useState(getUserData())
  const [loading, setLoading] = useState(false)
  const [loadingGroup, setLoadingGroup] = useState(false)
  const [data, setData] = useState([])
  const [dataGroup, setDataGroup] = useState([])
  const [dataStudentWithoutGroup, setDataStudentWithoutGroup] = useState([])
  const [nos, setNos] = useState()
  const { Meta } = AntdCard
  const [dataClass, setDataClass] = useState(location.state)
  const [currentTab, setCurrentTab] = useState("1")
  const [isHiddenCoLecturer, setIsHiddenCoLecturer] = useState(true)
  const [isHiddenClassmates, setIsHiddenClassmates] = useState(true)
  const [isHiddenReviewer, setIsHiddenReviewer] = useState(true)
  const [isHiddenStudentGroup, setIsHiddenStudentGroup] = useState(true)
  const [showCheckbox, setShowCheckbox] = useState(false)
  //const [showAllCheckbox, setShowAllCheckbox] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const toggleDataVisibilityCoLecturer = () => {
    setIsHiddenCoLecturer(!isHiddenCoLecturer)
  }
  const toggleDataVisibilityClassmates = () => {
    setIsHiddenClassmates(!isHiddenClassmates)
  }
  const toggleDataVisibilityReviewer = () => {
    setIsHiddenReviewer(!isHiddenReviewer)
  }
  const toggleDataVisibilityStudentGroup = () => {
    setIsHiddenStudentGroup(!isHiddenStudentGroup)
  }
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  useEffect(() => {
    const obj = location.state
    setDataClass({ ...obj })
  }, [])

  const handleChangeTab = (key) => {
    setCurrentTab(key)
  }

  const handleAdd = () => {
    setDataItem(dataClass)
    setTypeModal('AddStudent')
    handleModal()
  }
  const handleImport = () => {
    setDataItem(dataClass)
    setTypeModal('ImportStudent')
    handleModal()
  }
  const handleAddTeam = () => {
    setCurrentTab('2')
    MySwal.fire({
      title: t("Confirm"),
      text: t("Are you sure you want to create a new group?"),
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
        api.teamApi.createOneApi({}, campus, semester, dataClass.key)
          .then((rs) => {
            if (rs.success === true) {
              handleLoadTable()
              notificationSuccess(t('Create group successfully'))
              socket.emit('notifications')
            } else {
              notificationError(t('Create group fail'))
            }
          })
          .catch(() => {
            notificationError(t('Create group fail'))
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }
  const handleRandom = () => {
    setCurrentTab('2')
    setDataItem(dataClass)
    setTypeModal('Random')
    handleModal()
  }
  const handleMove = (item) => {
    setCurrentTab('2')
    setDataItem(item)
    setTypeModal('Move')
    handleModal()
  }
  const handleAddOneStudentIntoTeam = (item) => {
    setCurrentTab('2')
    setDataItem(item)
    setTypeModal('AddOneStudentIntoTeam')
    handleModal()
  }
  const handleUpdateStudent = (item) => {
    setDataItem(item)
    setTypeModal('UpdateStudent')
    handleModal()
  }
  const handleAddManyStudentIntoGroup = (item) => {
    setDataItem({ item, dataStudentWithoutGroup })
    setTypeModal('AddManyStudentIntoGroup')
    handleModal()
  }

  const handleDeleteGroup = (item) => {
    setCurrentTab('2')
    MySwal.fire({
      title: t("Confirm"),
      text: t("Deleting this group will delete the project information this group is working on this semester, are you sure you want to delete it?"),
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
        api.teamApi.removeTeamInClass({ teams_id: [item.new_team_id] }, campus, semester, item.value)
          .then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Delete fail'))
            }
          })
          .catch((e) => {
            if (e.response?.data?.error?.message?.length > 0) {
              notificationError(e.response.data.error.message)
            } else {
              notificationError(t('Delete fail'))
            }
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }
  const handleDeleteStudentOutGroup = (item) => {
    setCurrentTab('2')
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this student out of group?"),
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
        api.teamApi.removeMemberOutGroup({}, campus, semester, item.value, item.new_team_id, item.userId)
          .then(() => {
            handleLoadTable()
            notificationSuccess(t('Delete success'))
            socket.emit('notifications')
          })
          .catch(() => {
            notificationError(t('Delete fail'))

          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }
  const handleMakeMemberAsLeader = (item) => {
    setCurrentTab('2')
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to make this member as the group leader?"),
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
        api.teamApi.setLeaderInTeam({ student_id: item.userId }, campus, semester, item.value, item.new_team_id)
          .then(() => {
            handleLoadTable()
            notificationSuccess(t('Set leader success'))
            socket.emit('notifications')
          })
          .catch(() => {
            notificationError(t('Set leader fail'))

          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
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
    //setShowAllCheckbox(!showAllCheckbox)
    setShowCheckbox(!showCheckbox)
    if (selectedItems.length === dataGroup.length && showCheckbox) {
      setSelectedItems([]) // Bỏ chọn tất cả nếu đã chọn hết
    } else {
      setSelectedItems([...dataGroup]) // Chọn tất cả
    }
  }
  const handleDeleteAllGroup = () => {
    const teamsIds = selectedItems.map(item => item.new_team_id)
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete all group! Deleting this group will delete the project information this group is working on this semester, are you sure you want to delete it?"),
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
        api.teamApi.removeTeamInClass({ teams_id: teamsIds }, campus, semester, selectedItems[0].value)
          .then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              notificationSuccess(t('Delete success'))
              socket.emit('notifications')
              setSelectedItems([])
              setShowCheckbox(false)
            } else {
              notificationError(t('Delete fail'))
            }
          })
          .catch((e) => {
            if (e.response.data.error.message.length > 0) {
              notificationError(e.response.data.error.message.map(item => item).join('\n'))
            } else {
              notificationError(t('Delete fail'))
            }
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
    setCurrentTab('2')
  }
  const headerColumns = [
    {
      title: t('Group Name'),
      dataIndex: 'label',
      key: 'label',
      width: 100
    },
    {
      title: t('Team Quantity'),
      dataIndex: 'teamQuantity',
      key: 'teamQuantity',
      width: 150
    },
    {
      title: (
        <div>
          <Space size="middle">
            Action
            <Checkbox onChange={handleToggleAllCheckbox} checked={showCheckbox} />
            {showCheckbox && (
              <Tooltip title={t(`Delete all select checkbox`)}>
                <DeleteOutlined onClick={handleDeleteAllGroup} />
              </Tooltip>
            )}
          </Space>
        </div>),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        < Space size="middle" >
          <Tooltip title={t(`Add student into class`)}>
            <EditOutlined onClick={() => { handleAddManyStudentIntoGroup(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDeleteGroup(record) }}></DeleteOutlined>
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
  const fetchDataGroup = () => {
    setLoadingGroup(true)
    api.teamApi.getAllTeamFromClassApi({ keyword: '', page: '' }, campus, semester, dataClass?.key)
      .then((rs) => {
        if (rs && rs.data && rs.data.findAllTeam) {
          const newDataGroup = rs.data.findAllTeam.map((item, index) => {
            const key = index
            const new_team_id = item.team_id
            const value = item.class_id
            const label = item.name
            const teamQuantity = item.quantity
            const TeamUsers = item.TeamUsers.map(itemUser => {
              const userId = itemUser.User.user_id
              const isLead = itemUser.isLead
              const userEmail = itemUser.User.email
              const userCode = itemUser.User.code
              const userFirstName = itemUser.User.first_name
              const userLastName = itemUser.User.last_name
              const userAvatar = itemUser.User.avatar
              return {
                new_team_id,
                value,
                label,
                isLead,
                userId,
                userEmail,
                userCode,
                userFirstName,
                userLastName,
                userAvatar
              }
            })
            TeamUsers.sort((a, b) => (((a.isLead === b.isLead) ? 0 : a.isLead) ? -1 : 1))
            return {
              key,
              new_team_id,
              value,
              label,
              teamQuantity,
              TeamUsers
            }
          })
          const studentWithoutGroup = rs.data.studentsWithoutGroup.map((item) => {
            const key = item.user_id ? item.user_id : null
            const email_student = item.User ? item.User.email : null
            const studentCode = item.User ? item.User.code : null
            const studentAvatar = item.User ? item.User.avatar : null
            const studentName = item.User ? `${(item.User.first_name !== null && item.User.first_name !== 'undefined') ? (item.User.first_name.includes("undefined") ? item.User.first_name.replace("undefined", " ") : item.User.first_name) : ''} ${(item.User.last_name !== null && item.User.last_name !== 'undefined') ? (item.User.last_name.includes("undefined") ? item.User.last_name.replace("undefined", " ") : item.User.last_name) : ''}` : ''
            const classId = item.class_id ? item.class_id : null
            return {
              key,
              classId,
              email_student,
              studentCode,
              studentAvatar,
              studentName
            }
          })
          setDataStudentWithoutGroup(studentWithoutGroup)
          setDataGroup(newDataGroup)
          setLoadingGroup(false)
        } else {
          setLoadingGroup(false)
        }
      })
      .catch(() => {
        setLoadingGroup(false)
      })

  }
  useEffect(() => {
    fetchDataGroup()
  }, [loadTable])
  const fetchData = () => {
    setLoading(true)
    api.classesApi.getAllStudentFromClassApi({ keyword: '' }, campus, semester, dataClass?.key)
      .then((rs) => {
        setData(rs.data && rs.data.rows ? rs.data.rows.map(item => ({
          key: item.user_id,
          email_student: item.User ? item.User.email : null,
          studentCode: item.User ? item.User.code : null,
          studentAvatar: item.User ? item.User.avatar : null,
          //studentName: item.User ? `${item.User.first_name !== null || 'undefined' ? item.User.first_name.includes("undefined") ? item.User.first_name.replace("undefined", " ") : item.User.first_name : ''} ${item.User.last_name !== null || 'undefined' ? item.User.last_name.includes("undefined") ? item.User.last_name.replace("undefined", " ") : item.User.last_name : ''}` : ''
          studentName: item.User ? `${(item.User.first_name !== null && item.User.first_name !== 'undefined') ? (item.User.first_name.includes("undefined") ? item.User.first_name.replace("undefined", " ") : item.User.first_name) : ''} ${(item.User.last_name !== null && item.User.last_name !== 'undefined') ? (item.User.last_name.includes("undefined") ? item.User.last_name.replace("undefined", " ") : item.User.last_name) : ''}` : '',
          class_id: dataClass?.key,
          code: item.User ? item.User.code : null
        })) : [])
        setNos(rs.data.count)
        //setTotalItems(rs.total)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchData()

  }, [loadTable])
  const ExpandedRowComponent = ({ record }) => {
    const [userData] = useState(record.TeamUsers)
    return (
      <div>
        <List
          dataSource={userData}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.userAvatar ? item.userAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={
                  <div>
                    {`${(item.userFirstName !== null && item.userFirstName !== 'undefined') ? (item.userFirstName.includes("undefined") ? item.userFirstName.replace("undefined", " ") : item.userFirstName) : ''} ${(item.userLastName !== null && item.userLastName !== 'undefined') ? (item.userLastName.includes("undefined") ? item.userLastName.replace("undefined", " ") : item.userLastName) : ''}${item.userCode ? `(${item.userCode})` : ''}`}
                    {item.isLead && (
                      <span style={{ color: 'red' }}>(TeamLeader)</span>
                    )}
                  </div>
                } description={item.userEmail}
              />
              <Col className='mt-1' xs={1}>
                < Space size="middle" >
                  <Tooltip title={t(`Make a member as the group leader`)}>
                    <CrownOutlined onClick={() => { handleMakeMemberAsLeader(item) }}></CrownOutlined>
                  </Tooltip>
                  <Tooltip title={t(`Move Student To Other Group`)}>
                    <ExportOutlined onClick={() => { handleMove(item) }}></ExportOutlined>
                  </Tooltip>
                  <Tooltip title={t(`Delete Student out of Group`)}>
                    <DeleteOutlined onClick={() => { handleDeleteStudentOutGroup(item) }}></DeleteOutlined>
                  </Tooltip>
                </Space >
              </Col>
            </List.Item>
          )}
        />
      </div>
    )
  }
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  const items = [
    {
      key: '1',
      label: 'List Student',
      children: (
        <>
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeader
                  handleAdd={handleAdd}
                  handleImport={handleImport}
                />
              </Col>
            </Row>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Lecture')}</h2>
            <div style={{ borderBottom: '1px solid black' }}></div>
            <Row>
              <Col key={dataClass?.key} xl={12} md={12} xs={12}>
                <AntdCard key={dataClass?.key} className='my-1' loading={loading}>
                  <Meta
                    avatar={<Avatar src={dataClass.lectureAvatar ? dataClass.lectureAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${dataClass?.key}`} style={{ marginTop: '10px' }} />}
                    title={<span >{dataClass?.lectureEmail}</span>}
                    description={`${dataClass?.lectureName}`}
                  />
                </AntdCard>
              </Col>
            </Row>
            <Row className='px-2 mt-2'>
              <Col >
                < Space size="large" >
                  <h2 style={{ fontWeight: '700' }} >{t('Co-Lecture')}</h2>
                  <Tooltip title={!isHiddenCoLecturer ? t('Hide data') : t('Show data')}>
                    {!isHiddenCoLecturer ? (
                      <EyeOutlined onClick={toggleDataVisibilityCoLecturer} style={{ fontSize: '20px' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={toggleDataVisibilityCoLecturer} style={{ fontSize: '20px' }} />
                    )}
                  </Tooltip>
                </Space >
              </Col>
            </Row>
            <div style={{ borderBottom: '1px solid black' }}></div>
            {!isHiddenCoLecturer && (
              <Row>
                {dataClass.colectures.length === 0 ? (
                  <>
                    <div style={{ marginTop: '20px' }}></div> {/* Thêm khoảng trống */}
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </>
                ) : (
                  dataClass.colectures && dataClass.colectures.map(item => (
                    <Col key={item.key} xl={6} md={6} xs={6}>
                      <AntdCard key={item.key} className='my-1'>
                        <Row className="justify-content-between">
                          <Col>
                            <Meta
                              avatar={<Avatar src={item.colectureAvatar ? item.colectureAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                              title={<span>{item.colectureEmail}</span>}
                              description={item.colectureName !== '' ? item.colectureName : null}
                            />
                          </Col>
                        </Row>
                      </AntdCard>
                    </Col>
                  )))}
              </Row>
            )}
            <Row className='px-2 mt-2'>
              <Col >
                < Space size="large" >
                  <h2 style={{ fontWeight: '700' }} >{t('Reviewer')}</h2>
                  <Tooltip title={!isHiddenReviewer ? t('Hide data') : t('Show data')}>
                    {!isHiddenReviewer ? (
                      <EyeOutlined onClick={toggleDataVisibilityReviewer} style={{ fontSize: '20px' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={toggleDataVisibilityReviewer} style={{ fontSize: '20px' }} />
                    )}
                  </Tooltip>
                </Space >
              </Col>
            </Row>
            <div style={{ borderBottom: '1px solid black' }}></div>
            {!isHiddenReviewer && (
              <Row>
                {dataClass.reviewers.length === 0 ? (
                  <>
                    <div style={{ marginTop: '20px' }}></div> {/* Thêm khoảng trống */}
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </>
                ) : (
                  dataClass.reviewers && dataClass.reviewers.map(item => (
                    <Col key={item.key} xl={6} md={6} xs={6}>
                      <AntdCard key={item.key} className='my-1'>
                        <Row className="justify-content-between">
                          <Col>
                            <Meta
                              avatar={<Avatar src={item.reviewerAvatar ? item.reviewerAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                              title={<span>{item.reviewerEmail}</span>}
                              description={item.reviewerName !== '' ? item.reviewerName : null}
                            />
                          </Col>
                        </Row>
                      </AntdCard>
                    </Col>
                  )))}
              </Row>
            )}
            <Row className='px-2 mt-2'>
              <Col >
                < Space size="large" >
                  <h2 style={{ fontWeight: '700' }} >{t('Classmates')}</h2>
                  <Tooltip title={!isHiddenClassmates ? t('Hide data') : t('Show data')}>
                    {!isHiddenClassmates ? (
                      <EyeOutlined onClick={toggleDataVisibilityClassmates} style={{ fontSize: '20px' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={toggleDataVisibilityClassmates} style={{ fontSize: '20px' }} />
                    )}
                  </Tooltip>
                </Space >
              </Col>
              <Col xs={1} className='mt-1'>
                <h5>{nos} Students</h5>
              </Col>
            </Row>
            <div style={{ borderBottom: '1px solid black' }}></div>
            {!isHiddenClassmates && (
              <Row>
                {data.length === 0 ? (
                  <>
                    <div style={{ marginTop: '20px' }}></div> {/* Thêm khoảng trống */}
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </>
                ) : (
                  data.map(item => (
                    <Col key={item.key} xl={6} md={6} xs={6}>
                      <AntdCard key={item.key} className='my-1'>
                        <Row className="justify-content-between">
                          <Col>
                            <Meta
                              avatar={<Avatar src={item.studentAvatar ? item.studentAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                              title={<span>{item.email_student}</span>}
                              description={item.studentName}
                            />
                          </Col>
                          <Col className='mt-1' xs={1}>
                            < Space size="middle" >
                              <Tooltip title={t(`Edit`)}>
                                <EditOutlined onClick={() => { handleUpdateStudent(item) }}></EditOutlined>
                              </Tooltip>
                            </Space >
                          </Col>
                        </Row>
                      </AntdCard>
                    </Col>
                  )))}
              </Row>
            )}
          </Card>
        </>
      )
    },
    {
      key: '2',
      label: 'Group',
      children: (

        <Fragment >
          <Card className='overflow-hidden'>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Group In Class')}</h2>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeader1
                  handleAddTeam={handleAddTeam}
                  handleRandom={handleRandom}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>
              <Table
                dataSource={dataGroup}
                bordered
                columns={headerColumns}
                expandable={{
                  expandedRowRender: (record) => (
                    <ExpandedRowComponent record={record} />
                  ),
                  rowExpandable: (record) => record.TeamUsers.length > 0
                }}
                pagination={false}
                loading={loadingGroup}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
            </div>
            <Row>
              <Col className='px-2 mt-2'>
                < Space size="large" >
                  <h2 style={{ fontWeight: '700' }}>{t('List students without group')}</h2>
                  <Tooltip title={!isHiddenStudentGroup ? t('Hide data') : t('Show data')}>
                    {!isHiddenStudentGroup ? (
                      <EyeOutlined onClick={toggleDataVisibilityStudentGroup} style={{ fontSize: '20px' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={toggleDataVisibilityStudentGroup} style={{ fontSize: '20px' }} />
                    )}
                  </Tooltip>
                </Space >
              </Col>
            </Row>

            <div style={{ borderBottom: '1px solid black' }}></div>
            {!isHiddenStudentGroup && (
              <Row>
                {dataStudentWithoutGroup.length === 0 ? (
                  <>
                    <div style={{ marginTop: '30px' }}></div>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </>
                ) : (
                  dataStudentWithoutGroup.map(item => (
                    <Col key={item.key} xl={6} md={6} xs={6}>
                      <AntdCard key={item.key} className='my-1'>
                        <Row className="justify-content-between">
                          <Col>
                            <Meta
                              avatar={<Avatar src={item.studentAvatar ? item.studentAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                              title={<span>{item.email_student}</span>}
                              description={item.studentName}
                            />
                          </Col>
                          <Col className='mt-1' xs={1}>
                            < Space size="middle" >
                              <Tooltip title={t(`Add team for student`)}>
                                <PlusOutlined onClick={() => { handleAddOneStudentIntoTeam(item) }}></PlusOutlined>
                              </Tooltip>
                            </Space >
                          </Col>
                        </Row>
                      </AntdCard>
                    </Col>
                  )))}
              </Row>
            )}
          </Card>
        </Fragment >
      )
    }
  ]

  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='react-dataTabs mx-2 mt-2'>
          <Space size="middle">
            <Tooltip>
              <span onClick={handleGoBack} style={{ cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center' }}>
                <ArrowLeftOutlined></ArrowLeftOutlined>
                <span style={{ marginLeft: '8px' }}>Go Back</span>
              </span>
            </Tooltip>
          </Space>
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{`Class: ${dataClass.name}`}</h2>
        <div className='react-dataTabs mx-2'>
          <Tabs defaultActiveKey="1" items={items} activeKey={currentTab} onChange={handleChangeTab}>
          </Tabs>
        </div>
      </Card>
    </Fragment>
  )
}

export default tabClass