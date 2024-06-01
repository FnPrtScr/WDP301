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
import { object } from 'prop-types'


const MySwal = withReactContent(Swal)

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
  const dataProjectStudent = JSON.parse(window.localStorage.getItem('dataProjectStudent'))
  const initialIteration_id = dataProjectStudent && dataProjectStudent.length > 0 ? dataProjectStudent[3]?.Iterations[0]?.iteration_id : null
  const [iterationId, setIterationId] = useState(initialIteration_id)
  useEffect(() => {
    const obj = dataProjectStudent && dataProjectStudent.length > 0 ? dataProjectStudent[3]?.Iterations[0]?.iteration_id : null
    setIterationId(obj)
  }, [dataProjectStudent])

  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')

  const fetchData = async () => {
    api.pointApi.getMyPointByIterationApi({}, campus, semester, iterationId)
      .then((rs) => {
        const keys = Object.keys(rs.data)
        const filteredData = keys.filter(key => key === 'getMyPoint' || key === 'getMyPointResit')
          .map(key => rs.data[key])
        const newItem = {}
        const grades = filteredData.map(item => {
          if ('graded_point' in item) {
            newItem['graded_point'] = item.graded_point
          } else if ('graded_pointrs' in item) {
            newItem['graded_pointrs'] = item.graded_pointrs
          }
          return newItem
        })
        setData([newItem])

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

  const Columns = [
    {
      title: t('Iteration Final Point'),
      dataIndex: 'graded_point',
      key: 'graded_point',
      width: '35%'
    },
    {
      title: t('Iteration Final Resit Point'),
      dataIndex: 'graded_pointrs',
      key: 'graded_pointrs',
      width: '35%'
    },
    {
      title: t('Feedback'),
      dataIndex: 'note',
      key: 'note',
      width: '30%',
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
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('My Final Point')}</h2>
        <div className='react-dataTable mx-2 mb-2'>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={Columns}
            pagination={false}
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
