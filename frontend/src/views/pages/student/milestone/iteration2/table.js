/* eslint-disable no-unused-vars */
import { Fragment, useState, useContext, useEffect } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Statistic } from 'antd'
import {
  Card,
  Input,
  Button,
  Badge,
  Col,
  Row,
  InputGroup
} from 'reactstrap'
import { SubmitContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../../api'
import moment from 'moment'
import { notificationError } from '../../../../../utility/notification'
import { PUBLIC_URL_SERVER_API } from "../../../../../dataConfig"


const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ handleAdd, onFinish, dataDeadline, isFinished }) => {
  const { t } = useTranslation()
  const { Countdown } = Statistic

  const [deadline, setDeadline] = useState(null)

  useEffect(() => {
    if (dataDeadline && dataDeadline.endDate) {
      const newEndDate = dataDeadline.endDate.split("T")[0]
      const [year, month, day] = newEndDate.split('-').map(Number)
      const endDateObj = new Date(year, month - 1, day)
      setDeadline(endDateObj.getTime())
    } else {
      setDeadline(null)
    }
  }, [dataDeadline])
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <Col span={3} className="text-center">
          {isFinished ? (
            <div>Time is over</div>
          ) : (
            <Countdown title="Deadline for iteration 2" value={deadline} onFinish={onFinish} format={`D [days] H [hours] m [minutes] s [seconds]`} />
          )}
        </Col>
      </div>
      <div className='d-flex justify-content-end mx-2'>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleAdd} disabled={isFinished}>
          {t('Submit Document')}
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
    setTypeModal,
    windowSize,
    // handleLoadTable,
    loadTable,
    typeModal,
    setDataDetail
  } = useContext(SubmitContext)
  const [data, setData] = useState([])
  const [dataDeadline, setDataDeadline] = useState([])
  const [isFinished, setIsFinished] = useState(false)
  const [dataPoint, setDataPoint] = useState([])
  const [dataLoc, setDataLoc] = useState([])
  const [dataPointDocument, setDataPointDocument] = useState([])
  const dataProjectStudent = JSON.parse(window.localStorage.getItem('dataProjectStudent'))
  const initialMilestoneId = dataProjectStudent && dataProjectStudent.length > 0 ? dataProjectStudent[1].milestone_id : null
  const [milestoneId, setMilestoneId] = useState(initialMilestoneId)
  useEffect(() => {
    const obj = dataProjectStudent && dataProjectStudent.length > 0 ? dataProjectStudent[1].milestone_id : null
    setMilestoneId(obj)
  }, [dataProjectStudent])

  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current)
    setRowsPerPage(pagination.pageSize)
    setTableParams({
      pagination,
      filters,
      ...sorter
    })

  }

  const fetchData = async () => {
    const rs = await api.iterationApi.getDeadlineRoleStudent({}, campus, semester, milestoneId)
      .catch((e) => {
        if (e.response.data?.statusCode === 404) {
          notificationError(t('Dont have any deadline'))
        } else {
          notificationError(t('Deadline not found'))
        }
      })
    setDataDeadline(rs && rs.data ? rs.data : [])
    api.iterDocumenttApi.getDocumentMyTeamApi({}, campus, semester, rs?.data.iteration_id)
      .then((rs) => {
        setData([rs.data])
      })
      .catch((e) => {
        console.log(e)
      })
    api.pointApi.getMyPointByIterationApi({}, campus, semester, rs?.data.iteration_id)
      .then((rs) => {
        setDataLoc(rs.data.getMyLOC.map((item, index) => ({ ...item, name: item.FunctionRequirement.name, Loc: item.FunctionRequirement.LOC, key: index + 1, complexity: item.FunctionRequirement.complexity, quality: `${item.quality}%` })))
        setDataPoint([rs.data.getMyPoint])
        setDataPointDocument([rs.data.getPointDoc])
      })
      .catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    fetchData()
  }, [loadTable])

  const handleAdd = () => {
    setDataItem(dataDeadline)
    setTypeModal('Add')
    handleModal()
  }

  const onFinish = () => {
    setIsFinished(true)

  }

  const handleDownload = (text) => {
    fetch(`${PUBLIC_URL_SERVER_API}/download/zip?n=${text}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/zip"
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        // create a temporary URL object from the blob
        const url = window.URL.createObjectURL(blob)

        // create a link element to trigger the download
        const link = document.createElement("a")
        link.href = url

        // Use encodeURIComponent to handle special characters in file names
        const fileName = text.split("/").pop()
        link.setAttribute("download", encodeURIComponent(fileName))

        document.body.appendChild(link)
        link.click()

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error("Error downloading file:", error)
      })
  }
  const splitString = (text) => {
    const newText = text.split("/").pop()
    return newText
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
      title: t('Link URL DOC'),
      dataIndex: 'url_doc',
      key: 'url_doc',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      )
    },
    {
      title: t('File'),
      dataIndex: 'path_file_doc',
      key: 'path_file_doc',
      width: 100,
      align: 'center',
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
      title: t('Submit Time'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      align: 'center',
      render: (text) => {
        if (text) {
          const updateAtPlus7Hours = moment(text).format('YYYY-MM-DD HH:mm:ss')
          return updateAtPlus7Hours
        } else {
          return null
        }
      }
    }
  ]
  const LocEvaluationColumns = [
    {
      title: t('Index'),
      dataIndex: 'key',
      key: 'key',
      width: 50
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
      title: t('Complexity'),
      dataIndex: 'complexity',
      key: 'complexity',
      width: 100,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: t('LOC'),
      dataIndex: 'Loc',
      key: 'Loc',
      width: 70,
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
    }
  ]
  const PointColumns = [
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
    }
  ]
  const PointDocumentColumns = [
    {
      title: t('Source Codes and Database'),
      dataIndex: 'grade_SCandDB',
      key: 'grade_SCandDB',
      width: 150
    },
    {
      title: t('Software Design Specification'),
      dataIndex: 'grade_SDS',
      key: 'grade_SDS',
      width: 150
    },
    {
      title: t('Software Requirement Specification'),
      dataIndex: 'grade_SRS',
      key: 'grade_SRS',
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
    }
  ]
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              handleAdd={handleAdd}
              onFinish={onFinish}
              dataDeadline={dataDeadline}
              isFinished={isFinished}
            />
          </Col>
        </Row>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('iteration 2 Information')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            pagination={false}
            onChange={handleTableChange}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
          ></Table>
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My LOC')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={dataLoc}
            bordered
            columns={LocEvaluationColumns}
            pagination={false}
            onChange={handleTableChange}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
          ></Table>
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My Document point')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={dataPointDocument}
            bordered
            columns={PointDocumentColumns}
            pagination={false}
            onChange={handleTableChange}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
          ></Table>
        </div>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My point')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={dataPoint}
            bordered
            columns={PointColumns}
            pagination={false}
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
