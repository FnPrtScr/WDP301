import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Card, Input, Button, Badge, Col, Row, InputGroup, TabPane } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ProjectContext } from './useContext'
import api from '../../../../api'
import { Tabs, Table, Tag, Modal, Space, Tooltip, Avatar, Card as AntdCard, Descriptions } from 'antd'
import { EditOutlined, ExportOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons"
import Select from 'react-select'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../../../../styles/table.css'
// import { notificationError, notificationSuccess } from '../../../../utility/notification'
import ReactPaginate from 'react-paginate'
import { PUBLIC_URL_SERVER } from "../../../../dataConfig"

const MySwal = withReactContent(Swal)

// ** Table Header tab 1
const CustomHeader1 = ({ handleAddProject, dataProject }) => {
  const { t } = useTranslation()

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAddProject} disabled={!dataProject || dataProject.length === 0}>
          {t('Setting Project')}
        </Button>
      </div>
    </div >
  )
}
// ** Table Header tab 2
const CustomHeader = ({ handleFilter }) => {
  const { t } = useTranslation()
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
      </div>
    </div >
  )
}

const tabClass = () => {
  const { t } = useTranslation()
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    windowSize,
    loadTable,
    handleModalDetail
  } = useContext(ProjectContext)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermGroup, setSearchTermGroup] = useState('')
  const [dataProject, setDataProject] = useState([])
  const [dataAllProject, setDataAllProject] = useState([])
  const { Meta } = AntdCard
  const [showApiToken, setShowApiToken] = useState(false)
  const [showTokenGit, setShowTokenGit] = useState(false)

  const handleToggleApiToken = () => {
    setShowApiToken(!showApiToken)
  }

  const handleToggleTokenGit = () => {
    setShowTokenGit(!showTokenGit)
  }


  const handleAddProject = () => {
    setDataItem(dataProject)
    setTypeModal('AddProject')
    handleModal()
  }

  const handleDetail = (item) => {
    setDataItem(item)
    handleModalDetail()
    setTypeModal('Detail')
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
    tmi = setTimeout(() => {
      setSearchTermGroup(val)

    }, 500)
  }

  const handleDownload = (text) => {
    fetch(`${PUBLIC_URL_SERVER}${text}`, {
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
        link.setAttribute("download", text.split("\\")[4])
        document.body.appendChild(link)
        link.click()

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error)
      })
  }

  const itemsProject = dataProject.map((item) => ({
    key: item.key,
    label: "Project Information",
    children: [
      {
        key: "1",
        label: "Project Name",
        value: item.name
      },
      {
        key: "2",
        label: "Technical",
        value: item.technical
      },
      {
        key: "3",
        label: "Descriptions",
        value: item.description
      },
      {
        key: "4",
        label: "Group Name",
        value: item.team_name
      },
      {
        key: "5",
        label: "Link Gitlab",
        value: item.link_gitlab,
        isLink: true
      },
      {
        key: "6",
        label: "Link Jira",
        value: item.link_jira,
        isLink: true
      },
      {
        key: "7",
        label: "Email Owner",
        value: item.email_owner
      },
      {
        key: "8",
        label: "API Token",
        value: (
          <span onClick={handleToggleApiToken} className="password-toggle">
            {showApiToken ? item.apiToken : "********"}
            {showApiToken ? <FaEyeSlash /> : <FaEye />}
          </span>
        ),
        toggleIcon: true,
        toggleHandler: handleToggleApiToken
      },
      {
        key: "9",
        label: "Token Git",
        value: (
          <span onClick={handleToggleTokenGit} className="password-toggle">
            {showTokenGit ? item.tokenGit : "********"}
            {showTokenGit ? <FaEyeSlash /> : <FaEye />}
          </span>
        ),
        toggleIcon: true,
        toggleHandler: handleToggleTokenGit
      },
      {
        key: "10",
        label: "Link Project Tracking",
        value: item.project_tracking,
        isLink: true
      },
      {
        key: "11",
        label: "Link Documents Final",
        value: ""
      },
      {
        key: "12",
        label: "Requirement",
        value: item.file ? (
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              handleDownload(item.file)
            }}
          >
            {item.file.split("\\")[4]}
          </a>
        ) : null
      }
    ]
  }))

  const headerColumnsAllProject = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 35
    },
    {
      title: t('Project Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
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
              {text.split('\\')[4]}
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
      width: 200
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 50,
      render: (_, record) => (
        < Space size="middle" >
          <Tooltip title={t(`View`)}>
            <EyeOutlined onClick={() => { handleDetail(record) }} />
          </Tooltip>
        </Space >
      )
    }
  ]

  const fetchDataProject = () => {
    setLoading(true)
    api.projectApi.getMyProjectApi({}, campus, semester)
      .then((rs) => {
        setDataProject([
          {
            project_id: rs.data?.Project.project_id,
            teamproject_id: rs.data?.teamproject_id,
            file: rs.data?.Project.file_path_requirement,
            name: rs.data?.Project.name,
            description: rs.data?.Project.description,
            technical: rs.data?.technical,
            link_jira: rs.data?.link_jira,
            link_gitlab: rs.data?.link_gitlab,
            email_owner: rs.data?.email_owner,
            apiToken: rs.data?.apiToken,
            tokenGit: rs.data?.tokenGit,
            project_tracking: rs.data?.project_tracking,
            team_name: rs.data?.Team.name
          }
        ])
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
    fetchDataProject()
  }, [loadTable])

  const fetchDataAllProject = () => {
    setLoading(true)
    api.projectApi.getAllProjecFromLecturetApi({}, campus, semester)
      .then((rs) => {
        setDataAllProject(rs && rs.data.map((item, index) => ({
          key: index + 1,
          project_id: item?.project_id,
          name: item?.name,
          file: item?.file_path_requirement,
          description: item?.description
        })))
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDataAllProject()
  }, [loadTable])

  const childrenArray = itemsProject.map((item) => item.children)
  //const getRowClassName = (record, index) => {
  //  return index % 2 === 0 ? 'even-row' : 'odd-row'
  //}
  const items = [
    {
      key: '1',
      label: 'My Project',
      children: (

        <Fragment >
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeader1
                  //currentStatus={currentStatus}
                  //setcurrentStatus={setcurrentStatus}
                  searchTerm={searchTermGroup}
                  handleFilter={handleFilter1}
                  handleAddProject={handleAddProject}
                  dataProject={dataProject}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>
              {childrenArray.map((children, index) => (
                <Descriptions key={index} title="Project Information" bordered layout="vertical">
                  {children.map((item) => {
                    // Kiểm tra nếu item là một liên kết
                    if (item.isLink) {
                      return (
                        <Descriptions.Item key={item.key} label={item.label}>
                          <a href={item.value} target="_blank" rel="noopener noreferrer">
                            {item.value}
                          </a>
                        </Descriptions.Item>
                      )
                    }
                    // Nếu không phải là liên kết, hiển thị giá trị bình thường
                    return (
                      <Descriptions.Item key={item.key} label={item.label}>
                        {item.value}
                      </Descriptions.Item>
                    )
                  })}
                </Descriptions>
              ))}
            </div>
          </Card>
        </Fragment >
      )
    },
    {
      key: '2',
      label: 'All Project',
      children: (
        <Fragment >
          <Card className='overflow-hidden'>
            <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('List All Project')}</h2>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <CustomHeader
                  //currentStatus={currentStatus}
                  //setcurrentStatus={setcurrentStatus}
                  searchTerm={searchTerm}
                  handleFilter={handleFilter}
                />
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>
              <Table
                // style={{ height: windowSize.innerHeight - 280 }}
                dataSource={dataAllProject}
                bordered
                columns={headerColumnsAllProject}
                loading={loading}
                scroll={{
                  x: 0,
                  y: windowSize.innerHeight - 280
                }}
              //rowClassName={getRowClassName}
              ></Table>
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
          <Tabs defaultActiveKey="1" items={items}>
          </Tabs>
        </div>
      </Card>

    </Fragment>
  )
}

export default tabClass