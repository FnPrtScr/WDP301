import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Empty, Tabs, Flex, Spin, Progress } from 'antd'
import Select from 'react-select'
import { Card, Input, Button, Col, Row, InputGroup, Label } from 'reactstrap'
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import '../../../../../styles/table.css'
import api from '../../../../../api'
import { Controller, useForm } from 'react-hook-form'
import * as Utils from '@utils'
import Cookies from 'js-cookie'
const token = Cookies.get('accessToken')
import { PUBLIC_URL_SERVER_API } from '../../../../../dataConfig'
import ChartComponent from './chart'
import ChartPieComponent from './chartPie'
import ChartProjectTrackingComponent from './chartProjectTracking'
import ChartPieProjectTrackingComponent from './chartPieProjectTracking'
import ChartGitComponent from './chartGit'
import { notificationError } from '../../../../../utility/notification'
import moment from 'moment'
import { EditOutlined, ExportOutlined, SearchOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined, PlusOutlined, ArrowLeftOutlined, PlusCircleOutlined, WarningOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"

/*eslint-disable */
const MySwal = withReactContent(Swal)
// ** Table Header
const CustomHeaderTab1 = ({ handleGrade, handleExportMyGrade }) => {
  const { t } = useTranslation()
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
        </div>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleExportMyGrade}>
          {t('Export My Grade')}
        </Button>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleGrade}>
          {t('Grade Iteration Final')}
        </Button>
      </div>
    </div >
  )
}
const CustomHeaderTab2 = ({ handleExportTotalGrade }) => {
  const { t } = useTranslation()
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
        </div>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleExportTotalGrade}>
          {t('Export Total Grade')}
        </Button>
      </div>
    </div >
  )
}
const defaultValues = {
  class_id: 0,
  team_id: 0,
  type: 0
}
const App = () => {
  const { t } = useTranslation()
  const {
    control,
    //clearErrors,
    //handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange' })
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    windowSize,
    loadTable
  } = useContext(UserContext)

  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataClass, setDataClass] = useState([])
  const [dataTeam, setDataTeam] = useState([])
  const [classId, setClassId] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [type, setType] = useState(1)
  const [dataFinalE, setDataFinalE] = useState([])
  const [dataFinalEInSystem, setDataFinalEInSystem] = useState([])
  const [dataTeamMember, setDataTeamMember] = useState([])
  const [dataIterationDocument, setDataIterationDocument] = useState([])
  const dataProject = JSON.parse(window.localStorage.getItem('dataProject'))
  const initialMilestoneId = dataProject && dataProject.length > 0 ? dataProject[3].navLink : null
  const [milestoneId, setMilestoneId] = useState(initialMilestoneId)
  const [currentTab, setCurrentTab] = useState("1")
  const optionTypeStatistic = [
    { label: 'Jira', value: 0 },
    { label: 'Project Tracking', value: 1 },
    { label: 'Gitlab', value: 2 }
  ]
  const [selectedValue, setSelectedValue] = useState(0)
  const [dataJira, setDataJira] = useState(null)
  const [dataProjectTracking, setDataProjectTracking] = useState(null)
  const [dataGit, setDataGit] = useState()
  const [path_file_doc, setPath_file_doc] = useState(null)
  const [url_doc, setUrl_doc] = useState(null)

  useEffect(() => {
    const obj = dataProject && dataProject.length > 0 ? dataProject[3].navLink : null
    setMilestoneId(obj)
  }, [dataProject])
  const fetchDataClass = () => {
    api.projectApi.getAllReviewProjectApi({}, campus, semester, milestoneId)
      .then((rs) => {
        setDataClass(rs && rs.data ? rs.data.map(item => {
          const value = item.class_id
          const label = item.Class.name
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
  useEffect(() => {
    fetchDataClass()
  }, [])
  const getStudent = (id) => {
    api.projectApi.getAllReviewProjectApi({ filter: id }, campus, semester, milestoneId)
      .then((rs) => {
        const teams = rs && rs.data[0].Class.Teams
        teams.sort((a, b) => {
          // Extract the name from each team
          const nameA = a.name.toUpperCase() // ignore upper and lowercase
          const nameB = b.name.toUpperCase() // ignore upper and lowercase

          // Compare the names
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          // Names are equal
          return 0
        })
        setDataTeam(teams.map(item => {
          const value = item.team_id
          const label = item.name
          const classId = id
          const dataTeamUser = item.TeamUsers
          const dataTeamProject = item.TeamProject
          const dataTeamIterationDocument = item.TeamIterationDocument
          return {
            value,
            label,
            classId,
            dataTeamUser,
            dataTeamProject,
            dataTeamIterationDocument
          }
        }))
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const fetchDataStatistic = (classId, teamId, iteration_id) => {
    if (classId !== null && teamId !== null && iteration_id !== null) {
      api.statisticApi.getStatisticJiraByTeamApi({}, campus, semester, iteration_id, classId, teamId)
        .then((rs) => {
          if (rs.statusCode === 200) {
            setDataJira(rs.data)
          } else if (rs.statusCode === 404) {
            notificationError(t('This team has not yet submitted jira'))
          }
        }).catch((e) => {
          if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
            notificationError(t('This team has not yet submitted jira'))
          }
        })
      api.statisticApi.getStatisticLinkProjectTrackingByTeam({}, campus, semester, classId, iteration_id, teamId)
        .then((rs) => {
          if (rs.statusCode === 200) {
            setDataProjectTracking(rs.data[0]["Iteration 1"])
          } else if (rs.statusCode === 404) {
            notificationError(t('This team has not yet submitted project tracking'))
          }
        }).catch((e) => {
          if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
            notificationError(t('This team has not yet submitted project tracking'))
          }
        })
      api.statisticApi.getStatisticLinkGitlabByTeam({}, campus, semester, classId, iteration_id, teamId)
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
          } else {
            notificationError(rs.error)

          }

        }).catch((e) => {
          if (e.response?.data.statusCode === 404 || e.response?.data.statusCode === 500) {
            notificationError(t('This team has not yet submitted a Gitlab link or Unauthorized'))
          }
        })
    }
  }
  useEffect(() => {
    if (dataTeam && teamId) {
      setDataTeamMember(dataTeam && dataTeam.find(team => team.value === teamId)?.dataTeamUser.map((item, index) => ({
        key: index,
        label: item.User.email.split('@')[0],
        value: item.User.user_id,
        status: item.status
      })))
      setDataIterationDocument(dataTeam && dataTeam.find(team => team.value === teamId)?.dataTeamIterationDocument)
    }
  }, [dataTeam, teamId])
  useEffect(() => {
    if (dataIterationDocument?.iteration_id !== undefined) {
      fetchDataStatistic(classId, teamId, dataIterationDocument?.iteration_id)
      setPath_file_doc(dataIterationDocument.path_file_doc)
      setUrl_doc(dataIterationDocument.url_doc)
    }
  }, [dataIterationDocument, teamId])

  const [loading, setLoading] = useState(false)
  const fetchData = (classId, teamId) => {
    setLoading(true)
    api.finalEvaluationApi.getFinalGradedApi({}, campus, semester, milestoneId, classId, teamId)
      .then((rs) => {
        setDataFinalEInSystem(rs.data ? rs.data.getGradedFinalEInSystem : [])
        setDataFinalE(rs.data ? rs.data.allGraded : [])
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    if (teamId !== null || classId !== null) {
      fetchData(classId, teamId)
    }
  }, [loadTable])
  const handleGrade = () => {
    setDataItem({ milestoneId, classId, teamId, dataTeamMember })
    setTypeModal('Add')
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
  const handleExportGrade = (type) => {
    let fileName = '';
    if (+type === 1) {
      fileName = `Team-${Date.now()}-MyGraded-Final-Evaluation.xlsx`;
    } else if (+type === 2) {
      fileName = `Team-${Date.now()}-Graded-Final-Evaluation.xlsx`;
    } else {
      console.error('Invalid type for export.');
      return;
    }

    fetch(`${PUBLIC_URL_SERVER_API}/download/${campus}/${semester}/${milestoneId}/${classId}/${teamId}/graded?type=${type}`, {
      method: "GET",
      headers: {
        'Token': `Bear ${token}`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // create a temporary URL object from the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading Document file:", error);
      });
  }
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value)
    // Do something with selected value...
  }
  const handleChangeTab = (key) => {
    setCurrentTab(key)
    setType(key)
  }
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  const columns = [
    ...Object.keys(dataFinalEInSystem[0] && dataFinalEInSystem[0].project_introduction ? dataFinalEInSystem[0].project_introduction : []).map((category) => ({
      title:
        category === "ClassName/Group"
          ? "Into Scoring Criteria"
          : category.split("@")[0],
      dataIndex: category,
      render: (text) => text,
    })),
  ];

  const data = dataFinalEInSystem.map((item, index) => ({
    key: String(index + 1),
    category: Object.keys(item)[0],
    ...Object.values(item)[0],
  }));
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
  const items = [
    {
      key: '1',
      label: 'My Grade',
      children: (
        <>
          <Row>
            <Col xl={12} lg={12} md={12}>
              <CustomHeaderTab1
                handleGrade={handleGrade}
                handleExportMyGrade={() => handleExportGrade(type)}
              />
            </Col>
          </Row>
          <div className='react-dataTabs mt-2 px-2 mb-2'>

            {dataFinalE.length === 0 ? (
              <>
                <div style={{ marginTop: '100px' }}></div> {/* Thêm khoảng trống */}
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <div style={{ marginBottom: '100px' }}></div>
              </>
            ) : (dataFinalE.map((data, index) => {
              return (
                <Fragment>
                  <div key={data.reviewer}>
                    <h2>Reviewer: {data.reviewer}</h2>
                    <Table
                      key={index}
                      rowClassName={getRowClassName}
                      bordered
                      pagination={false}
                      loading={loading}
                      scroll={{
                        y: windowSize.innerHeight - 280
                      }}
                      style={{ marginBottom: '50px' }}
                      columns={Object.keys(data.datas[0].project_introduction).map(
                        (category) => ({
                          title:
                            category === "ClassName/Group"
                              ? "Into Scoring Criteria"
                              : category.split("@")[0],
                          dataIndex: category,
                          render: (text) => (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {text}
                            </div>
                          ),
                        }),
                      )}
                      dataSource={data.datas.map((item, index) => ({
                        key: String(index + 1),
                        category: Object.keys(item)[0],
                        ...Object.values(item)[0],
                      }))}
                    />
                  </div>
                </Fragment>
              )
            })
            )}

          </div>
        </>
      )
    },
    {
      key: '2',
      label: 'Total Grade',
      children: (
        <Fragment >
          <Card className='overflow-hidden'>
            <>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <CustomHeaderTab2
                    handleExportTotalGrade={() => handleExportGrade(type)}
                  />
                </Col>
              </Row>
              <div className='react-dataTable mx-2'>
                <Table
                  //components={components}
                  columns={columns}
                  dataSource={data}
                  rowClassName={getRowClassName}
                  bordered
                  pagination={false}
                  loading={loading}
                  scroll={{
                    y: windowSize.innerHeight - 280
                  }}
                />
              </div>
            </>
          </Card>
        </Fragment >
      )
    },
    {
      key: '3',
      label: 'Group statistic',
      children: (
        <>
          <Col className='mb-1' md='12' sm='12'>
            <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
              < div className='d-flex align-items-centerm mx-50'>
                <div className='d-flex align-items-center mx-50' style={{ minWidth: "220px", maxWidth: "220px" }}>
                </div>
              </div>
              <div className='d-flex justify-content-end mx-2'>
                {(path_file_doc === null && url_doc === null) ? <span className='add-new-user mx-25 my-25' style={{ color: 'red', textAlign: 'center', display: 'block' }}>
                  Currently, this group has not submitted a progress report for this iteration
                </span> : <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleDownloadDocument}>
                  {t('Download Document')}
                </Button>}
              </div>
            </div >
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
                {/*<div style={{ marginRight: '10px' }}>StartedAt: {dataDeadline.startDate} - EndAt: {dataDeadline.endDate}</div>*/}
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
    }
  ]
  return (
    <Fragment >
      <Card className='overflow-hidden' >
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Final Project Presentation Evaluation')}</h2>
        <div className='react-dataTabs mt-2 px-2'>
          <div className='border p-1 mb-2' style={{ backgroundColor: 'white', borderRadius: '10px' }}>
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
                        onChange(e.value)
                        getStudent(e.value)
                        setValue('team_id', undefined)
                        setClassId(e.value)
                        setDataTeam([])
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
              <Col className='mb-1' md='12' sm='12'>
                <Label className='form-label'>Selected Team</Label>
                <Controller
                  name='team_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      id='team_id'
                      value={dataTeam.find((val) => val.value === value) ?? ''}
                      onChange={(e) => {
                        setDataTeamMember([])
                        setDataFinalEInSystem([])
                        setDataFinalE([])
                        setDataJira(null)
                        setDataGit(null)
                        setDataProjectTracking(null)
                        setUrl_doc(null)
                        setPath_file_doc(null)
                        setDataIterationDocument([])
                        onChange(e.value)
                        setTeamId(e.value)
                        fetchData(e.classId, e.value)
                        //setDataSource(initialDataSource)
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

              </Col>
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
            <div className='react-dataTabs mx-2'>
              <Tabs defaultActiveKey="1" items={items} activeKey={currentTab} onChange={handleChangeTab}>
              </Tabs>
            </div>
          </>
        )}
      </Card>
    </Fragment >
  )
}
export default App
