import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Card, Input, Button, Badge, Col, Row, InputGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ProjectContext } from './useContext'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../../../api'
import { Tabs, Table, Tag, Modal, Space, Tooltip, Avatar, List, Card as AntdCard, Tour } from 'antd'
import { EditOutlined, ExportOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import ReactPaginate from 'react-paginate'
import { PUBLIC_URL_SERVER, PUBLIC_URL_SERVER_API } from "../../../../dataConfig"
import '../../../../styles/table.css'
import { getSocket } from '../../../../serviceWorker'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
const MySwal = withReactContent(Swal)

// ** Table Header tab 1
const CustomHeader1 = ({ handleAddProject, handleFilter1, refSearch, refBtnAdd }) => {
  const { t } = useTranslation()
  //const isDefaultOptions = [
  //  { value: true, label: t('Active') },
  //  { value: false, label: t('Inactive') }
  //]
  const [searchTermGroup, setSearchTermGroup] = useState('')

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
            value={searchTermGroup}
            onChange={e => {
              if (e.target.value) {
                setSearchTermGroup(e.target.value)
              } else {
                handleFilter1('')
                setSearchTermGroup(e.target.value)
              }

            }}
          />
          <span style={{ cursor: 'pointer' }} onClick={() => { handleFilter1(searchTermGroup) }} className='input-group-text '>
            <SearchOutlined></SearchOutlined>
          </span>
        </InputGroup>
        </div>
        
      </div>
      <div className='d-flex justify-content-end mx-2' ref={refBtnAdd}>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAddProject}>
          {t('Add Project')}
        </Button>
      </div>
    </div >
  )
}
// ** Table Header tab 2
const CustomHeader = ({ handleFilter, refSearch2 }) => {
  const { t } = useTranslation()
  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <div ref={refSearch2}>
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
        
      </div>
    </div >
  )
}

const tabClass = () => {
  const { t } = useTranslation()
  //
  
  const refSearch = useRef(null)
  const refSearch2 = useRef(null)
  const refBtnAdd = useRef(null)
  const refTableOne = useRef(null)
  const refPaginationOne = useRef(null)
  const refTableTwo = useRef(null)
  const refPaginationTwo = useRef(null)
  const refTableThree = useRef(null)
  const refPaginationThree = useRef(null)
  // khai báo state để mở định nghĩa
  const [openNote, setOpenNote] = useState(false)
  const {
    setDataItem,
    handleModal,
    handleModalAsign,
    handleModalEdit,
    // handleModalResetPassword,
    setTypeModal,
    windowSize,
    //handleModalDetail,
    handleLoadTable,
    loadTable
  } = useContext(ProjectContext)
  const socket = getSocket()
  const location = useLocation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermGroup, setSearchTermGroup] = useState('')
  const [dataProject, setDataProject] = useState([])
  const [dataProjectForRequestTopic, setDataProjectForRequestTopic] = useState([])
  const [dataTeamProject, setDataTeamProject] = useState([])
  const { Meta } = AntdCard
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  const steps = [
    {
      title: "Search",
      description: "You can filter by List lecturer project",
      placement: 'rightBottom',
      target: () => refSearch.current
    },
    {
      title: "Button Add Project",
      description: "You can open modal to add semesters",
      target: () => refBtnAdd.current
    },
    {
      title: "Table list lecturers",
      description: "View list semesters",
      target: () => refTableOne.current
    },
    {
      title: "Pagination",
      description: "You can paginate your seme",
      placement: 'Bottom',
      target: () => refPaginationOne.current
    },
    {
      title: "Table list lecturers",
      description: "View list semesters",
      target: () => refTableTwo.current
    },
    {
      title: "Pagination",
      description: "You can paginate your seme",
      placement: 'Bottom',
      target: () => refPaginationTwo.current
    },
    {
      title: "Table list lecturers",
      description: "View list semesters",
      target: () => refTableThree.current
    },
    {
      title: "Pagination",
      description: "You can paginate your seme",
      placement: 'Bottom',
      target: () => refPaginationThree.current
    }

  ]
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  //const [currentStatus, setcurrentStatus] = useState()

  //const [activeKey, setActiveKey] = useState("1")
  //const { TabPane } = Tabs
  const [dataClass, setDataClass] = useState(location.state)
  useEffect(() => {
    const obj = location.state
    setDataClass({ ...obj })
  }, [])


  const handleAddProject = () => {
    setDataItem(dataClass)
    setTypeModal('AddProject')
    handleModal()
  }

  const handleEditProject = (item) => {
    setDataItem(item)
    setTypeModal('EditProject')
    handleModal()
  }

  const handleEditTeamProject = (item) => {
    setDataItem(item)
    setTypeModal('EditTeamProject')
    handleModalEdit()
  }

  const handleAsign = (item) => {
    setDataItem(item.project_id)
    setTypeModal('AsignTeam')
    handleModalAsign()
  }

  const handleTitleClick = (item) => {
    // Xử lý logic khi title được click
    navigate(`/lecture/manage-function/${item.name}`, { state: item })
  }

  const handleDelete = (item) => {
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this project?"),
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
        api.projectApi.deleteOneProjectApi({}, campus, semester, item?.project_id)
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

  const handleDeleteTeamProject = (item) => {
    MySwal.fire({
      title: t("Confirm"),
      text: t("Do you want to delete this team?"),
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
        api.teamProjectApi.deleteTeamProjectApi({}, campus, semester, item.teamproject_id)
          .then(() => {
            handleLoadTable()
            notificationSuccess(t('Delete success'))
            socket.emit('notifications')
          })
          .catch((e) => {
            if (e.response.data.statusCode === 404) {
              notificationError(t(`${e.response.data.error}`))
            }
          }
          )
        // handleDelete(contextMenuClick.rowInfo.rowData.id)
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
      }
    })
  }
  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }
  let tmi1
  const handleFilter1 = val => {
    clearTimeout(tmi1)
    tmi1 = setTimeout(() => {
      setSearchTermGroup(val)
    }, 500)
  }
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
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
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

  const handleDownload = (text) => {
    fetch(`${PUBLIC_URL_SERVER_API}/download/pdf?n=${text}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.ms-excel"
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        // create a temporary URL object from the blob
        const url = window.URL.createObjectURL(new Blob([blob]))

        // create a link element to trigger the download
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", text.split("/").pop())
        document.body.appendChild(link)
        link.click()

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error)
      })
  }
  const splitString = (text) => {
    const newText = text.split("/").pop()
    return newText
  }

  const headerColumns = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 50
    },
    {
      title: t('Project Name'),
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: t('File Requirement'),
      dataIndex: 'file',
      key: 'file',
      width: 150,
      render: (text) => {
        if (text) {
          return (
            <a href='#' target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
              {splitString(text)}
            </a>
          )
        } else {
          return null
        }
      }
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
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
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleTitleClick(record) }} />
          </Tooltip>
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEditProject(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDelete(record) }}></DeleteOutlined>
          </Tooltip>
          <Tooltip title={t(`Asign project to team`)}>
            <PlusCircleOutlined onClick={() => { handleAsign(record) }}></PlusCircleOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]
  const headerColumnsRq = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 50
    },
    {
      title: t('Project Name'),
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: t('File Requirement'),
      dataIndex: 'file',
      key: 'file',
      width: 150,
      render: (text) => {
        if (text) {
          return (
            <a href='#' target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleDownload(text) }}>
              {splitString(text)}
            </a>
          )
        } else {
          return null
        }
      }
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 150,
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
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleTitleClick(record) }} />
          </Tooltip>
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEditProject(record) }}></EditOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]
  const headerColumnsTeam = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 30
    },
    {
      title: t('Group Name'),
      dataIndex: 'teamName',
      key: 'teamName',
      width: 80
    },
    {
      title: t('Class Name'),
      dataIndex: 'className',
      key: 'className',
      width: 100
    },
    {
      title: t('Project Name'),
      dataIndex: 'project_name',
      key: 'project_name',
      width: 150
    },
    {
      title: t('Technical'),
      dataIndex: 'technical',
      key: 'technical',
      width: 100
    },
    {
      title: t('Gitlab'),
      dataIndex: 'gitlab',
      key: '',
      width: 110,
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text?.substring(0, 18)}
        </a>
      )
    },
    {
      title: t('Jira'),
      dataIndex: 'jira',
      key: 'jira',
      width: 150,
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text?.split('/jira')[0]}
        </a>
      )
    },
    {
      title: t('Assigner'),
      dataIndex: 'assigner',
      key: 'assigner',
      width: 100,
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text?.split('@')[0]}
        </a>
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
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEditTeamProject(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDeleteTeamProject(record) }}></DeleteOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]

  const fetchDataProject = () => {
    setLoading(true)
    api.projectApi.getAllProjectApi({ keyword: searchTermGroup, page: currentPage }, campus, semester)
      .then((rs) => {
        setDataProject(rs && rs.map((item, index) => ({
          key: index + 1,
          project_id: item?.project_id,
          file: item?.file_path_requirement,
          name: item?.name,
          description: item?.description
        })))
        setTotalItems(rs.totalPages)
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
  const fetchDataStudentProject = () => {
    setLoading(true)
    api.projectApi.getAllProjectForRequestTopic({}, campus, semester)
      .then((rs) => {
        setDataProjectForRequestTopic(rs && rs.data.map((item, index) => ({
          key: index + 1,
          project_id: item?.project_id,
          file: item?.file_path_requirement,
          name: item?.name,
          description: item?.description
        })))
        setTotalItems(rs.totalPages)
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
    fetchDataProject()
    fetchDataStudentProject()
  }, [JSON.stringify(tableParams), loadTable, searchTermGroup, searchTerm, currentPage])

  const fetchDataTeamProject = () => {
    setLoading(true)
    api.teamProjectApi.getAllTeamProject({ keyword: searchTerm, page: currentPage }, campus, semester)
      .then((rs) => {
        const sortedTeamProjects = rs && rs.data.teamProjects.sort((a, b) => {
          if (a.Team.name < b.Team.name) {
            return -1
          }
          if (a.Team.name > b.Team.name) {
            return 1
          }
          return 0
        })
        setDataTeamProject(sortedTeamProjects.map((item, index) => ({
          key: index + 1,
          project_id: item?.project_id,
          teamproject_id: item?.teamproject_id,
          project_name: item?.Project.name,
          className: item?.Team.Class.name,
          teamName: item?.Team.name,
          gitlab: item?.link_gitlab,
          jira: item?.link_jira,
          technical: item?.technical,
          assigner: item?.User.email
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
    fetchDataTeamProject()
  }, [JSON.stringify(tableParams), loadTable, searchTerm, currentPage])
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  const items = [
    {
      key: '1',
      label: 'All Project',
      children: (

        <Fragment >
          <Card className='overflow-hidden'>
            <div className='d-flex align-items-center'>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('List lecturer Project')}</h2>
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
                <CustomHeader1
                  //currentStatus={currentStatus}
                  //setcurrentStatus={setcurrentStatus}
                  searchTermGroup={searchTermGroup}
                  handleFilter1={handleFilter1}
                  handleAddProject={handleAddProject}
                  refSearch={refSearch}
                  refBtnAdd={refBtnAdd}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2' ref={refTableOne}>
              <Table
                // style={{ height: windowSize.innerHeight - 280 }}
                dataSource={dataProject}
                bordered
                columns={headerColumns}
                pagination={false}
                onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
              <div ref={refPaginationOne}>
              <CustomPagination />
              </div>
              
            </div>
            
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('List student Project')}</h2>
                     
            <div className='react-dataTable mx-2 mt-2' ref={refTableTwo}>
              
              <Table
                // style={{ height: windowSize.innerHeight - 280 }}
                dataSource={dataProjectForRequestTopic}
                bordered
                columns={headerColumnsRq}
                pagination={false}
                onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
              <div ref={refPaginationTwo}>
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
    },
    {
      key: '2',
      label: 'Project of each Group',
      children: (
        <Fragment >
          <Card className='overflow-hidden'>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('List All Team Project')}</h2>
            <Button
            color="secondary"
            icon={<BsFillQuestionCircleFill />}

            onClick={() => setOpenNote(true)} />
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeader
                  //currentStatus={currentStatus}
                  //setcurrentStatus={setcurrentStatus}
                  searchTerm={searchTerm}
                  handleFilter={handleFilter}
                  refSearch2={refSearch2}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2' ref={refTableThree}>
              <Table
                // style={{ height: windowSize.innerHeight - 280 }}
                dataSource={dataTeamProject}
                bordered
                columns={headerColumnsTeam}
                pagination={false}
                onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
              <div ref={refPaginationThree}> <CustomPagination /></div>
             
            </div>
          </Card>
          
        </Fragment >
      )
    }
  ]
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Project')}</h2>
        <div className='react-dataTabs mx-2'>
          <Tabs defaultActiveKey="1" items={items} itemColor='primary'>
          </Tabs>
        </div>
      </Card>
      
    </Fragment>
  )
}

export default tabClass