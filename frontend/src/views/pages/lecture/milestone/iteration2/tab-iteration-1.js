import { Fragment, useContext, useEffect, useState } from 'react'
import { Card, Input, Button, Badge, Col, Row, InputGroup, Label } from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { UserContext } from './useContext'
import api from '../../../../../api'
import { Tabs, Table, Tag, Modal, Space, Tooltip, Avatar, Progress, List, Card as AntdCard, Statistic, Alert, Flex, Spin, Empty } from 'antd'
import { EditOutlined, ExportOutlined, SearchOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined, PlusOutlined, ArrowLeftOutlined, PlusCircleOutlined, WarningOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { notificationError } from '../../../../../utility/notification'
//import { getUserData } from '@utils'
import ReactPaginate from 'react-paginate'
import Select, { components } from 'react-select' // eslint-disable-line
//import { selectThemeColors } from '@utils'
import { PUBLIC_URL_SERVER, PUBLIC_URL_SERVER_API } from "../../../../../dataConfig"
import { Link } from 'react-router-dom'
import ChartComponent from './chart'
import ChartPieComponent from './chartPie'
import ChartProjectTrackingComponent from './chartProjectTracking'
import ChartPieProjectTrackingComponent from './chartPieProjectTracking'
import ChartGitComponent from './chartGit'
//import ChartPieGitComponent from './chartPieGit'
import moment from 'moment'
import * as Utils from '@utils'
//import { colors } from 'react-select/dist/declarations/src/theme'
const MySwal = withReactContent(Swal)
const defaultValues = {
  class_id: 0,
  team_id: 0
}
import '../../../../../styles/table.css'
const CustomHeader = ({ handleDeadline, handleSetting, dataDeadline, handleCompletedIteration }) => {
  const { t } = useTranslation()
  //const [searchText, setSearchTerm] = useState('')
  const { Countdown } = Statistic
  //let deadline = 0
  //if (dataDeadline && dataDeadline.endDate) {
  //  const [day, month, year] = dataDeadline.endDate.split('-').map(Number)
  //  const endDateObj = new Date(year, month - 1, day)
  //  deadline = endDateObj.getTime()  // Dayjs is also OK
  //}
  // Sử dụng useState để lưu trữ giá trị deadline
  const [deadline, setDeadline] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const onFinish = () => {
    setIsFinished(true)
  }
  // Sử dụng useEffect để cập nhật giá trị deadline khi dataDeadline thay đổi
  useEffect(() => {
    // Kiểm tra xem dataDeadline có tồn tại và có endDate không
    if (dataDeadline && dataDeadline.endDate) {
      // Tính toán ngày kết thúc từ dataDeadline
      const newEndDate = dataDeadline.endDate.split("T")[0]
      const [year, month, day] = newEndDate.split('-').map(Number)
      const endDateObj = new Date(year, month - 1, day)
      // Cập nhật giá trị deadline
      setDeadline(endDateObj.getTime())
      setIsFinished(false)
    } else {
      // Nếu không có endDate, set giá trị deadline thành null
      setDeadline(null)
    }
  }, [dataDeadline])
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <Col span={3} className="text-center">
          {isFinished ? (
            <div style={{ color: 'red', fontSize: '20px' }} >Time is over</div>
          ) : (
            <Countdown title="Deadline for iteration 2" value={deadline} onFinish={onFinish} format={`D [days] H [hours] m [minutes] s [seconds]`} />
          )}
        </Col>
      </div >
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleDeadline}>
          {t('Set Deadline')}
        </Button>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleSetting} disabled={!deadline}>
          {t('Setting')}
        </Button>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleCompletedIteration}>
          {t('Set Completed')}
        </Button>
      </div>
    </div >
  )
}
// ** Table Header
const CustomHeaderScoring = ({ handleDownloadDocument, handlGradeDocument, path_file_doc, url_doc }) => {
  const { t } = useTranslation()
  //const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        {(path_file_doc === null && url_doc === null) ? <span className='add-new-user mx-25 my-25' style={{ color: 'red', textAlign: 'center', display: 'block' }}>
          Currently, this group has not submitted a progress report for this iteration
        </span> : <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleDownloadDocument}>
          {t('Download Document')}
        </Button>}

        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handlGradeDocument}>
          {t('Grade Document')}
        </Button>
      </div>
    </div >
  )
}
const CustomHeaderPoint = ({ handlePoint }) => {
  const { t } = useTranslation()
  //const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handlePoint}>
          {t('Grade Student')}
        </Button>
      </div>
    </div >
  )
}
const tabIteration1 = () => {
  const { t } = useTranslation()
  const {
    dataItem,
    setDataItem,
    handleModal,
    setTypeModal,
    // handleModalResetPassword,
    windowSize,
    openModal,
    //handleModalDetail,
    //handleLoadTable,
    loadTable
  } = useContext(UserContext)

  const {
    control,
    //clearErrors,
    //handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange' })

  const [dataClass, setDataClass] = useState([])
  const [dataDeadline, setDataDeadline] = useState([])
  const [dataTeam, setDataTeam] = useState([])
  const [dataTable, setdataTable] = useState([])
  const [dataTableLocEvaluation, setDataTableLocEvaluation] = useState([])
  const [dataTableTotalLocEvaluation, setDataTableTotalLocEvaluation] = useState([])
  const [dataTablePoint, setDataTablePoint] = useState([])
  //const [dataProject, setDataProject] = useState([])
  const [dataTeamMember, setDataTeamMember] = useState([])
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const dataProject = JSON.parse(window.localStorage.getItem('dataProject'))
  const initialMilestoneId = dataProject && dataProject.length > 0 ? dataProject[1].navLink : null
  const [milestoneId, setMilestoneId] = useState(initialMilestoneId)
  const [path_file_doc, setPath_file_doc] = useState(null)
  const [dataJira, setDataJira] = useState(null)
  const [dataProjectTracking, setDataProjectTracking] = useState(null)
  const [dataGit, setDataGit] = useState()
  //const [formattedDataGit, setFormattedDataGit] = useState(null)
  const [url_doc, setUrl_doc] = useState(null)
  const [classId, setClassId] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [loading, setLoading] = useState(false)
  const optionTypeStatistic = [
    { label: 'Jira', value: 0 },
    { label: 'Project Tracking', value: 1 },
    { label: 'Gitlab', value: 2 }
  ]
  const [selectedValue, setSelectedValue] = useState(0)

  useEffect(() => {
    const obj = dataProject && dataProject.length > 0 ? dataProject[1].navLink : null
    setMilestoneId(obj)
  }, [dataProject])
  const fetchDataClass = () => {
    api.classesApi.getAllMyClassApi({ keyword: '', page: 1 }, campus, semester)
      .then((rs) => {
        setDataClass(rs && rs.data ? rs.data.rows.map(item => {
          const value = item.class_id
          const label = item.name
          return {
            value,
            label
          }
        }) : [])
      })
      .catch((e) => {
        console.log(e)
      })

  }
  const fetchDataDeadline = (classId) => {
    api.iterationApi.getDeadlineApi({}, campus, semester, milestoneId, classId)
      .then((rs) => {
        setDataDeadline(rs && rs.data ? rs.data : [])
      })
      .catch((e) => {
        if (e.response.data.statusCode === 404) {
          notificationError(t('You have not set a deadline for iteration 2'))
        } else {
          notificationError(t('Deadline not found'))
        }
      })
  }
  useEffect(() => {
    fetchDataClass()
  }, [])
  useEffect(() => {
    if (classId !== null) {
      fetchDataDeadline(classId)
    }
  }, [classId, loadTable])
  const getStudent = (id) => {
    api.teamApi.getAllTeamFromClassApi({ keyword: '', page: 1 }, campus, semester, id)
      .then((rs) => {
        setDataTeam(rs && rs.data ? rs.data.findAllTeam.map(item => {
          const value = item.team_id
          const label = item.name
          const classId = id
          return {
            value,
            label,
            classId
          }
        }) : [])
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const processDataTable = (data, classId) => {
    return data.map((item, index) => ({
      key: index + 1,
      name: item?.FunctionRequirement.name || '',
      feature: item?.FunctionRequirement.feature || '',
      LOC: item?.FunctionRequirement.LOC || '',
      complexity: item?.FunctionRequirement.complexity || '',
      description: item?.FunctionRequirement.description || '',
      fcrqm_id: item?.fcrqm_id || '',
      label: item?.Student?.email || '',
      value: item?.student_id || '',
      graded_LOC: item?.graded_LOC || '',
      iteration_id: item?.iteration_id || '',
      lecture_id: item?.lecture_id || '',
      locEvaluation_id: item?.locEvaluation_id || '',
      note: item?.note || '',
      quality: item?.quality || '',
      status: item?.status || '',
      class_id: classId,
      team_id: item?.team_id || ''
    }))
  }

  const processDataTeamMember = (data) => {
    return data[0].Team?.TeamUsers?.map((item, idx) => ({
      key: idx + 1,
      value: item?.student_id || '',
      isLead: item?.User.isLead || '',
      label: item?.User.email || '',
      code: item?.User.code || '',
      first_name: item?.User.first_name || '',
      last_name: item?.User.last_name || '',
      avatar: item?.User.avatar || ''
    }))
  }
  const processDataTableLocEva = (data) => {
    return data.map((item, index) => ({
      key: index + 1,
      name: item?.FunctionRequirement.name || '',
      feature: item?.FunctionRequirement.feature || '',
      LOC: item?.FunctionRequirement.LOC || '',
      complexity: item?.FunctionRequirement.complexity || '',
      description: item?.FunctionRequirement.description || '',
      gradeBy: item?.Lecture.email || '',
      inCharge: item?.Student.email || '',
      graded_LOC: item?.graded_LOC || '',
      quality: `${item?.quality}%` || '',
      note: item?.note || '',
      student_id: item?.Student.user_id || '',
      fcrqm_id: item?.fcrqm_id || ''
    }))
  }
  const fetchData = (classId, teamId) => {
    if (classId !== null && teamId !== null) {
      setLoading(true)
      api.LocEvaluationApi.getFunctionRequirementScoringApi({}, campus, semester, dataDeadline.iteration_id, classId, teamId)
        .then((rs) => {
          setdataTable(processDataTable(rs.data || [], classId))
          setDataTeamMember(processDataTeamMember(rs.data || []))
          setLoading(false)
          //setTotalItems(rs.total)
        }).catch((e) => {
          if (e.response?.data.statusCode === 500) {
            //notificationError(t('You have not assigned a project to this group'))
            console.log(e)
          } else {
            console.log(e)
          }
          setLoading(false)
        })
      api.teamIterationDocumentApi.getDocumentByTeamIDApi({}, campus, semester, dataDeadline.iteration_id, teamId)
        .then((rs) => {
          setPath_file_doc(rs.data.path_file_doc)
          setUrl_doc(rs.data.url_doc)

        }).catch((e) => {
          console.log(e)
        })
    }
  }
  const fetchDataStatistic = (classId, teamId) => {
    if (classId !== null && teamId !== null) {
      api.statisticApi.getStatisticJiraByTeamApi({}, campus, semester, dataDeadline.iteration_id, classId, teamId)
        .then((rs) => {
          if (rs.statusCode === 200) {
            setDataJira(rs.data)
          }
          //else if (rs.statusCode === 404) {
          //  notificationError(t('This team has not yet submitted jira'))
          //}
        }).catch(() => {
          //if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
          //  notificationError(t('This team has not yet submitted jira'))
          //}
        })
      api.statisticApi.getStatisticLinkProjectTrackingByTeam({}, campus, semester, classId, dataDeadline.iteration_id, teamId)
        .then((rs) => {
          if (rs.statusCode === 200) {
            setDataProjectTracking(rs.data[0]["iteration 2"])
            //} else if (rs.statusCode === 404) {
            //  notificationError(t('This team has not yet submitted project tracking'))
          }
        }).catch(() => {
          //if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
          //  notificationError(t('This team has not yet submitted project tracking'))
          //}
        })
      api.statisticApi.getStatisticLinkGitlabByTeam({}, campus, semester, classId, dataDeadline.iteration_id, teamId)
        .then((rs) => {
          if (rs.statusCode === 200) {
            const commitsArray = Object.entries(rs.data.commitsByAuthor).map(([author, commits]) => ({
              author,
              commitsByDate: Object.entries(commits).map(([date, commits]) => ({ date, commits }))
            }))
            const suspiciousAuthors = Object.entries(rs.data.suspiciousAuthors).map(([susAuthor]) => ({
              susAuthor
            }))
            setDataGit({ commitsArray, suspiciousAuthors })
          }
          //else if (rs.statusCode === 404) {
          //  notificationError(t('This team has not yet submitted a Gitlab link'))
          //}
        }).catch((e) => {
          console.log(e)
          //if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
          //  notificationError(t('This team has not yet submitted a Gitlab link'))
          //}
        })
    }
  }
  const fetchDataLocEva = (classId, teamId) => {
    if (classId !== null && teamId !== null) {
      setLoading(true)
      api.LocEvaluationApi.getFunctionRequirementGradedApi({}, campus, semester, dataDeadline.iteration_id, classId, teamId)
        .then((rs) => {
          setDataTableLocEvaluation(processDataTableLocEva(rs.data))
        }).catch((e) => {
          console.log(e)
          //if (e.response?.data.statusCode === 500) {
          //  notificationError(t('You have not assigned a project to this group'))
          //} else if (e.response?.data.statusCode === 404) {
          //  notificationError(t('Class not found or you are not a Lecturer or CoLecturer of this Class'))
          //} else {
          //  console.log(e)
          //}
        })
      api.LocEvaluationApi.getTotalLOCApi({}, campus, semester, dataDeadline.iteration_id, classId, teamId)
        .then((rs) => {
          setDataTableTotalLocEvaluation(rs.data[0].map((item, index) => ({
            key: index + 1,
            totalLOC: item?.totalLOC || '',
            email: item?.student_info.email || '',
            status: item?.status
          })))
          setLoading(false)
        }).catch(() => {
          //if (e.response?.data.statusCode === 500) {
          //  notificationError(t('You have not assigned a project to this group'))
          //} else if (e.response?.data.statusCode === 404) {
          //  notificationError(t('Class not found or you are not a Lecturer or CoLecturer of this Class'))
          //} else {
          //  console.log(e)
          //}
          setLoading(false)
        })
    }
  }
  const fetchDataGradeTeam = (classId, teamId) => {
    if (classId !== null && teamId !== null) {
      api.pointApi.getPointByTeamApi({}, campus, semester, dataDeadline.iteration_id, classId, teamId)
        .then((rs) => {
          setDataTablePoint(rs.data.filter(item => item !== null).map((item, index) => ({ ...item, index: index + 1, studentEmail: item.User.email })))
        }).catch((e) => {
          console.log(e)
          //if (e.response?.data.statusCode === 500) {
          //  notificationError(t('You have not assigned a project to this group'))
          //} else if (e.response?.data.statusCode === 404) {
          //  notificationError(t(e.response?.data.error))
          //}
        })
    }
  }
  useEffect(() => {
    if (classId !== null && teamId !== null) {
      fetchDataLocEva(classId, teamId)
    }
  }, [loadTable])
  useEffect(() => {
    if (!openModal) {
      fetchData(classId, teamId)
      fetchDataGradeTeam(classId, teamId)
    }
  }, [openModal])

  const handleDeadline = () => {
    setDataItem({ milestoneId, classId })
    setTypeModal('Deadline')
    handleModal()
    //fetchDataClass()
  }
  const handleCompletedIteration = () => {
    setLoading(true)
    api.iterationApi.setCompletedIterationApi({}, campus, semester, dataDeadline.iteration_id, classId)
      .then(() => {
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
  }
  const handleSetting = () => {
    setDataItem({ iteration_id: dataDeadline.iteration_id, classId })
    setTypeModal('Setting')
    handleModal()
  }
  const handleGrade = (item) => {
    setDataItem({ item, dataTeamMember, iteration_id: dataDeadline.iteration_id })
    setTypeModal('Grade')
    handleModal()
  }

  const handleDownloadDocument = () => {
    if (path_file_doc !== null) {
      fetch(`${PUBLIC_URL_SERVER_API}/download/zip?n=${encodeURIComponent(path_file_doc)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/zip"
        }
      })
        .then((response) => response.blob())
        .then((blob) => {
          // create a temporary URL object from the blob
          const url = window.URL.createObjectURL(new Blob([blob]))

          // create a link element to trigger the download
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", path_file_doc.split("/").pop())
          document.body.appendChild(link)
          link.click()

          // remove the temporary URL object from memory
          window.URL.revokeObjectURL(url)
        })
        .catch((error) => {
          console.error("Error downloading Document file:", error)
        })
    } else if (url_doc !== null) {
      window.open(url_doc, "_blank")
    }
  }
  const handlGradeDocument = () => {
    setDataItem({ iteration_id: dataDeadline.iteration_id, class_Id: classId, team_Id: teamId })
    setTypeModal('GradeDocument')
    handleModal()
  }
  const handlePoint = () => {
    setDataItem({ dataTeamMember, iteration_id: dataDeadline.iteration_id, class_Id: classId, team_Id: teamId })
    setTypeModal('Point')
    handleModal()
  }
  const handleEditPoint = (record) => {
    setDataItem({ record, dataTeamMember, iteration_id: dataDeadline.iteration_id, class_Id: classId, team_Id: teamId })
    setTypeModal('EditPoint')
    handleModal()
  }
  const handleEditGrade = (record) => {
    setDataItem({ record, dataTeamMember, iteration_id: dataDeadline.iteration_id, class_Id: classId, team_Id: teamId })
    setTypeModal('EditGrade')
    handleModal()
  }


  const headerColumns = [
    {
      title: t('Index'),
      dataIndex: 'key',
      key: 'key',
      width: 70
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
      width: 50
    },
    {
      title: t('Complexity'),
      dataIndex: 'complexity',
      key: 'complexity',
      width: 75
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
          <Tooltip title={t(`Grade`)}>
            <PlusCircleOutlined onClick={() => { handleGrade(record) }} style={{ fontSize: '24px' }}></PlusCircleOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]
  const LocEvaluationColumns = [
    {
      title: t('Index'),
      dataIndex: 'key',
      key: 'key',
      width: 70
    },
    {
      title: t('Function Name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('LOC'),
      dataIndex: 'LOC',
      key: 'LOC',
      width: 70,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Grade By'),
      dataIndex: 'gradeBy',
      key: 'gradeBy',
      width: 250,
      minWidth: 150,
      maxWidth: 300
    },
    {
      title: t('In Charge'),
      dataIndex: 'inCharge',
      key: 'inCharge',
      width: 200,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Quality'),
      dataIndex: 'quality',
      key: 'quality',
      width: 100,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Graded LOC'),
      dataIndex: 'graded_LOC',
      key: 'graded_LOC',
      width: 100,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Feedback'),
      dataIndex: 'note',
      key: 'note',
      width: 200,
      minWidth: 100,
      maxWidth: 200,
      render: (text) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
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
          <Tooltip title={t(`Edit Grade`)}>
            <EditOutlined onClick={() => { handleEditGrade(record) }} style={{ fontSize: '12px' }}></EditOutlined>
          </Tooltip>
        </Space >
      )
    }

  ]
  const TotalLocEvaluationColumns = [
    {
      title: t('Index'),
      dataIndex: 'key',
      key: 'key',
      width: 30
    },
    {
      title: t('Student Name'),
      dataIndex: 'email',
      key: 'email',
      width: 150,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Total LOC'),
      dataIndex: 'totalLOC',
      key: 'totalLOC',
      width: 70,
      minWidth: 100,
      maxWidth: 200
    }
  ]
  const PointColumns = [
    {
      title: t('index'),
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: t('Student Email'),
      dataIndex: 'studentEmail',
      key: 'studentEmail',
      width: 150
    },
    {
      title: t('Point By Total LOC'),
      dataIndex: 'point_by_LOC',
      key: 'point_by_LOC',
      width: 150
    },
    {
      title: t('Graded Point'),
      dataIndex: 'graded_point',
      key: 'graded_point',
      width: 150
    },
    {
      title: t('Feedback'),
      dataIndex: 'note',
      key: 'note',
      width: 200,
      minWidth: 100,
      maxWidth: 200,
      render: (text) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
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
          <Tooltip title={t(`Edit Grade`)}>
            <EditOutlined onClick={() => { handleEditPoint(record) }} style={{ fontSize: '12px' }}></EditOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]
  const jiraColumns = [
    {
      title: t('Issue'),
      dataIndex: 'Issue',
      key: 'Issue',
      width: 50
    },
    {
      title: t('Summary'),
      dataIndex: 'Summary',
      key: 'Summary',
      width: 150
    },
    {
      title: t('Status'),
      dataIndex: 'Status',
      key: 'Status',
      width: 75
    },
    {
      title: t('Assignee'),
      dataIndex: 'Assignee',
      key: 'Assignee',
      width: 70
    },
    {
      title: t('Start_Date'),
      dataIndex: 'Start_Date',
      key: 'Start_Date',
      width: 75,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: t('Due_Date'),
      dataIndex: 'Due_Date',
      key: 'Due_Date',
      width: 75,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    }
  ]
  const projectTrackingColumns = [
    {
      title: t('Index'),
      dataIndex: '#',
      key: '#',
      align: 'center',
      width: 80
    },
    {
      title: t('Screen / Function'),
      dataIndex: 'Screen / Function',
      key: 'Screen / Function',
      align: 'center',
      width: 150,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('Feature'),
      align: 'center',
      dataIndex: 'Feature',
      key: 'Feature',
      width: 100,
      minWidth: 80,
      maxWidth: 200
    },
    {
      title: t('Screen/Function Description'),
      dataIndex: 'Screen/Function Description',
      align: 'center',
      key: 'Screen/Function Description',
      width: 300,
      minWidth: 150,
      maxWidth: 400
    },
    {
      title: t('In Charge'),
      dataIndex: 'In Charge',
      align: 'center',
      key: 'In Charge',
      width: 100,
      minWidth: 80,
      maxWidth: 150
    },
    {
      title: t('Status'),
      dataIndex: 'Status',
      align: 'center',
      key: 'Status',
      width: 100,
      minWidth: 80,
      maxWidth: 150
    },
    {
      title: t('LOC'),
      dataIndex: 'LOC',
      key: 'LOC',
      align: 'center',
      width: 100,
      minWidth: 80,
      maxWidth: 150
    },
    {
      title: t('Complexity'),
      dataIndex: 'Complexity',
      key: 'Complexity',
      align: 'center',
      width: 120,
      minWidth: 80,
      maxWidth: 150
    },
    {
      title: t('Quality'),
      dataIndex: 'Quality',
      key: 'Quality',
      align: 'center',
      width: 100,
      minWidth: 80,
      maxWidth: 150
    }
  ]
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value)
    // Do something with selected value...
  }
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  const items = [
    {
      key: '1',
      label: 'Scoring for team',
      children: (
        <Fragment >
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeaderScoring
                  handleDownloadDocument={handleDownloadDocument}
                  handlGradeDocument={handlGradeDocument}
                  path_file_doc={path_file_doc}
                  url_doc={url_doc}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>
              <Table
                dataSource={dataTable}
                bordered
                columns={headerColumns}
                pagination={false}
                //onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
            </div>
          </Card>
        </Fragment >
      )
    },
    {
      key: '2',
      label: 'Group statistic',
      children: (
        <>
          <Col className='mb-1' md='12' sm='12'>
            <Label className='form-label'>Selected type of statistic</Label>
            <Select
              id='type'
              value={optionTypeStatistic.find((option) => option.value === selectedValue)}
              onChange={handleChange}
              placeholder='Select type of statistic'
              className='react-select'
              classNamePrefix='select'
              options={optionTypeStatistic}
              isClearable={false}
              defaultValue={optionTypeStatistic[0]}
            />
          </Col>
          {selectedValue === 0 && (
            <>
              {!dataJira ? (
                <Flex gap="small" vertical style={{ height: '50vh', justifyContent: 'center', alignItems: 'center' }}>
                  <Flex gap="small">
                    <Spin tip="Loading" size="large">
                      <div className="content" />
                    </Spin>
                  </Flex>
                </Flex>
              ) : (
                <Card className='overflow-hidden'>
                  <>
                    <Row>
                      <Col xl={7} lg={7} md={7}>
                        <ChartComponent width={300} height={200} dataJira={dataJira} />
                      </Col>
                      <Col xl={1} lg={1} md={1}>
                      </Col>
                      <Col xl={3} lg={3} md={3}>
                        <ChartPieComponent width={300} height={200} dataJira={dataJira} />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: '50px' }}>
                      <Col style={{ textAlign: 'right' }}>
                        <span>Percent of work completed:</span>
                      </Col>
                      <Col xl={6} lg={6} md={6}>
                        <Progress
                          percent={dataJira && dataJira ? dataJira.percentDoneOnTodoInProgress : 0}
                          status="active"
                          strokeColor={{
                            from: '#108ee9',
                            to: '#87d068'
                          }} />
                      </Col>
                      <Col></Col>
                    </Row>
                    <Row className='mt-3'>
                      <Table
                        dataSource={dataJira && dataJira ? (dataJira.arrDataIssue?.map(item => item)) : null}
                        bordered
                        columns={jiraColumns}
                        pagination={false}
                        //onChange={handleTableChange}
                        loading={loading}
                        scroll={{
                          x: 0,
                          y: windowSize.innerHeight - 280
                        }}
                        rowClassName={getRowClassName}
                      ></Table>
                    </Row>
                  </>
                </Card>
              )}
            </>
          )}
          {selectedValue === 1 && (
            <>
              {!dataProjectTracking ? (
                <Flex gap="small" vertical style={{ height: '50vh', justifyContent: 'center', alignItems: 'center' }}>
                  <Flex gap="small">
                    <Spin tip="Loading" size="large">
                      <div className="content" />
                    </Spin>
                  </Flex>
                </Flex>
              ) : (
                <Card className='overflow-hidden'>
                  <>
                    <Row>
                      <Col xl={6} lg={6} md={6}>
                        <ChartProjectTrackingComponent width={300} height={200} dataProjectTracking={dataProjectTracking && dataProjectTracking} />
                      </Col>
                      <Col xl={1} lg={1} md={1}>
                      </Col>
                      <Col xl={4} lg={4} md={4}>
                        <ChartPieProjectTrackingComponent width={300} height={200} dataProjectTracking={dataProjectTracking && dataProjectTracking} />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: '50px' }}>
                      <Col style={{ textAlign: 'right' }}>
                        <span>Percent of work completed:</span>
                      </Col>
                      <Col xl={6} lg={6} md={6}>
                        <Progress
                          percent={dataProjectTracking && dataProjectTracking ? (((dataProjectTracking.totalToDo + dataProjectTracking.totalInProgress) / dataProjectTracking.totalDone) * 100) : 0}
                          status="active"
                          strokeColor={{
                            from: '#108ee9',
                            to: '#87d068'
                          }} />
                      </Col>
                      <Col></Col>
                    </Row>
                    <Row className='mt-3'>
                      <Table
                        dataSource={dataProjectTracking && dataProjectTracking ? (dataProjectTracking.sheetData?.map(item => item)) : null}
                        bordered
                        columns={projectTrackingColumns}
                        pagination={false}
                        //onChange={handleTableChange}
                        loading={loading}
                        scroll={{
                          x: 'max-content',
                          y: windowSize.innerHeight - 280
                        }}
                        rowClassName={getRowClassName}
                      ></Table>
                    </Row>
                  </>
                </Card>
              )}
            </>
          )}
          {selectedValue === 2 && (
            <Row style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                <div style={{ marginRight: '10px' }}>StartedAt: {dataDeadline.startDate} - EndAt: {dataDeadline.endDate}</div>
                <div style={{ marginLeft: 'auto' }}>
                  <Tag icon={<CheckCircleOutlined />} color={Utils.transparentize(Utils.CHART_COLORS.blue, 0)}>normal</Tag>
                  <Tag icon={<ExclamationCircleOutlined />} color={Utils.transparentize(Utils.CHART_COLORS.red, 0)}>warning</Tag>
                </div>
              </div>
              {dataGit ? (dataGit.commitsArray).map((key) => {
                if (dataGit.suspiciousAuthors.some(item => item.susAuthor === key.author)) {
                  return (
                    <Col xl={6} lg={6} md={6} key={key.author}>
                      {/*<WarningOutlined style={{ color: 'red', position: 'absolute', right: 0.5 }} />*/}
                      <ChartGitComponent width={300} height={200} formattedDataGit={key} status={true} />
                    </Col>
                  )
                }
                return (
                  <Col xl={6} lg={6} md={6}>
                    <ChartGitComponent width={300} height={200} formattedDataGit={key} status={false} />
                  </Col>
                )
              }) : <>
                <Flex gap="small" vertical style={{ height: '50vh', justifyContent: 'center', alignItems: 'center' }}>
                  <Flex gap="small">
                    <Spin tip="Loading" size="large">
                      <div className="content" />
                    </Spin>
                  </Flex>
                </Flex>
              </>}
            </Row>
          )
          }
        </>
      )
    },
    {
      key: '3',
      label: 'LOC Evaluation',
      children: (
        <>
          <Card className='overflow-hidden'>
            <h3 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Total LOC Evaluation')}</h3>
            <div className='react-dataTable mx-2'>
              <Table
                dataSource={dataTableTotalLocEvaluation}
                bordered
                columns={TotalLocEvaluationColumns}
                pagination={false}
                //onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 'max-content',
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
            </div>
            <h3 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Grade LOC Evaluation Details')}</h3>
            <div className='react-dataTable mx-2'>
              <Table
                dataSource={dataTableLocEvaluation}
                bordered
                columns={LocEvaluationColumns}
                pagination={false}
                //onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 'max-content',
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
            </div>
          </Card>
        </>
      )
    },
    {
      key: '4',
      label: 'Graded Iteration',
      children: (
        <>
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeaderPoint
                  handlePoint={handlePoint}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>
              <Table
                dataSource={dataTablePoint}
                bordered
                columns={PointColumns}
                pagination={false}
                //onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 'max-content',
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
            </div>
          </Card>
        </>
      )
    }
  ]
  const onChange = (key) => {
    if (key === '3') {
      fetchDataLocEva(classId, teamId)
    }
    if (key === '4') {
      fetchDataGradeTeam(classId, teamId)
    }
  }
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        {classId !== null && (
          <Row>
            <Col xl={12} lg={12} md={12}>
              <CustomHeader
                handleCompletedIteration={handleCompletedIteration}
                handleDeadline={handleDeadline}
                handleSetting={handleSetting}
                dataDeadline={dataDeadline}
              />
            </Col>
          </Row>
        )}
        <div className='react-dataTabs mx-2 mt-2'>
          <div className='border p-1 mb-2'>
            <Row className='gy-1'>
              <Col className='mb-1' md='12' sm='12'>
                <Label className='form-label'>Selected Class</Label>
                <Controller

                  name='class_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      id='class_id'
                      value={dataClass.find((val) => val.value === value)}
                      onChange={(e) => {
                        setDataDeadline([])
                        onChange(e.value)
                        getStudent(e.value)
                        setValue('project_id', dataItem)
                        setValue('team_id', undefined)
                        setClassId(e.value)
                        //fetchDataDeadline(e.value)
                      }}
                      placeholder={t('Select class')}
                      theme={Utils}
                      className='react-select'
                      classNamePrefix='select'
                      defaultValue={''}
                      options={dataClass}
                      isClearable={false}
                    />
                  )}
                />
                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

              </Col>
              {dataDeadline && Object.keys(dataDeadline).length > 0 && (<Col className='mb-1' md='12' sm='12'>
                <Label className='form-label'>Selected Team</Label>
                <Controller
                  name='team_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      id='team_id'
                      value={dataTeam.find((val) => val.value === value) ?? ''}
                      onChange={(e) => {
                        onChange(e.value)
                        setTeamId(e.value)
                        setdataTable([])
                        setDataTeamMember([])
                        setUrl_doc(null)
                        setPath_file_doc(null)
                        setDataJira(null)
                        setDataGit(null)
                        setDataProjectTracking(null)
                        setDataTableLocEvaluation([])
                        setDataTablePoint([])
                        setDataTableTotalLocEvaluation([])
                        fetchData(e.classId, e.value)
                        fetchDataLocEva(e.classId, e.value)
                        //fetchDataGradeTeam(e.classId, e.value)
                        fetchDataStatistic(e.classId, e.value)
                      }}
                      placeholder={t('Select team')}
                      theme={Utils}
                      className='react-select'
                      classNamePrefix='select'
                      options={dataTeam}
                      isClearable={false}
                    />
                  )}
                />
                {errors.team_id && <FormFeedback>{errors.team_id.message}</FormFeedback>}

              </Col>)}
            </Row>
          </div>
        </div>
        {teamId === null ? (
          <>
            <div style={{ marginTop: '100px' }}></div> {/* Thêm khoảng trống */}
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            <div style={{ marginBottom: '100px' }}></div>
          </>
        ) : (
          <>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Team Information')}</h2>
            <div className='react-dataTabs mx-2'>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange}>
              </Tabs>
            </div>
          </>
        )}
      </Card>
    </Fragment>
  )
}

export default tabIteration1