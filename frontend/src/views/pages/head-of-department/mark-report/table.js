import { Fragment, useState, useContext, useEffect, Children, useRef } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, List, Avatar, Button, Tour } from 'antd'
import { Card } from 'reactstrap'
import { UserContext } from './useContext'
import api from '../../../../api'
import '.././table.css'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const Position = () => {
  const { t } = useTranslation()
  //
  const refTable = useRef(null)  
  // khai báo state để mở định nghĩa
  const [openNote, setOpenNote] = useState(false) 
  const {
    windowSize
  } = useContext(UserContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  //const userData = getUserData()
  // Đinh nghĩa 
  const steps = [
    {
      title: "Table mark-report",
      description: "View list mark-report",
      target: () => refTable.current
    }

  ]
  const fetchData = () => {
    setLoading(true)
    api.pointApi.getTopTeamByClassApi({}, campus, semester)
      .then((rs) => {
        setData(rs.data ? rs.data.map((item) => ({
          key: item.team_id,
          class_name: item.class.class_name,
          team_name: item.team.team_name,
          average: item.average,
          children: item.students.map(student => ({
            key: student.student_id,
            studentName: student.email.split('@')[0],
            markIter1: student.iteration1,
            markIter2: student.iteration2,
            markIter3: student.iteration3,
            markIter4: student.iteration4,
            totalmark: student.totalFinal
          }))
        })) : [])
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])
  const getColSpan = (record, dataIndex) => {
    const childrenLength = record.children ? record.children.length : 0
    if (childrenLength === 0) {
      // Nếu không có children, không merge cell
      return {
        colSpan: 1,
        rowSpan: 0
      }
    } else if (dataIndex === 'class_name' || dataIndex === 'team_name' || dataIndex === 'average') {
      // Merge cell cho các cột class_name và team_name
      return {
        colSpan: 1,
        rowSpan: childrenLength + 1
      }
    }
    // Các cột còn lại không merge cell
    return {
      colSpan: 1,
      rowSpan: 1
    }
  }
  const columns = [
    {
      title: 'Class Name',
      dataIndex: 'class_name',
      key: 'class_name',
      width: '10%',
      render: (text, record) => ({
        children: text,
        props: getColSpan(record, 'class_name')
      })
    },
    {
      title: 'Team Name',
      dataIndex: 'team_name',
      key: 'team_name',
      width: '10%',
      render: (text, record) => ({
        children: text,
        props: getColSpan(record, 'team_name')
      })
    },
    {
      title: 'Average',
      dataIndex: 'average',
      key: 'average',
      width: '10%',
      render: (text, record) => ({
        children: text,
        props: getColSpan(record, 'average')
      })
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '20%'
    },
    {
      title: 'Iteration1',
      dataIndex: 'markIter1',
      key: 'markIter1',
      width: '10%'
    },
    {
      title: 'Iteration2',
      dataIndex: 'markIter2',
      key: 'markIter2',
      width: '10%'
    },
    {
      title: 'Iteration3',
      dataIndex: 'markIter3',
      key: 'markIter3',
      width: '10%'
    },
    {
      title: 'Iteration4',
      dataIndex: 'markIter4',
      key: 'markIter4',
      width: '10%'
    },
    {
      title: 'total Final',
      dataIndex: 'totalmark',
      key: 'totalmark',
      width: '10%'
    }
  ]

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }

  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <div className='d-flex justify-content-between align-items-center'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Top Team In Semester')}</h2>
        <Button
            color="secondary"
            icon={<BsFillQuestionCircleFill/>}
            onClick={() => setOpenNote(true)} />
        </div>
        
        <div className='react-dataTable mx-2 mb-2'>
          <div ref = {refTable}>
          <Table
            dataSource={data}
            bordered
            columns={columns}
            pagination={false}
            loading={loading}
            scroll={{
              x: 'max-content',
              y: windowSize.innerHeight - 280
            }}
            rowClassName={getRowClassName}
          ></Table>
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
