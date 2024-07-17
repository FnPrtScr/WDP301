import { Fragment, useState, useContext, useEffect } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {
  Card,
  Col,
  Row
} from 'reactstrap'
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import { Tag } from 'antd'
const MySwal = withReactContent(Swal)

const Position = () => {
  const {
    loadTable
  } = useContext(UserContext)

  const [data, setData] = useState([])
  const [setting, setSetting] = useState({})
  const [totalAssessment1, setTotalAssessment1] = useState(null)
  const [totalAssessment2, setTotalAssessment2] = useState(null)
  const [totalAssessment3, setTotalAssessment3] = useState(null)
  const [totalAssessment, setTotalAssessment] = useState(null)
  const [color, setColor] = useState('error')
  const [content, setContent] = useState('NOT PASSED')
  const [average, setAverage] = useState(null)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const userData = JSON.parse(window.localStorage.getItem('userData'))

  const fetchData = () => {
    api.pointApi.getMyPointApi({}, campus, semester)
      .then((rs) => {
        //return
        setData(rs && rs.data)
      }).catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData1 = () => {
    api.settingApi
      .getAll({}, campus, semester)
      .then((rs) => {
        const lastElement = rs.data[rs.data.length - 1]
        setSetting(lastElement)
        setData(rs.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData1()
  }, [loadTable])

  useEffect(() => {
    const filteredItems1 = data && data.getMyPoint ? data.getMyPoint.filter(item => item.Iteration.name === 'Iteration 1') : []
    const filteredItems2 = data && data.getMyPoint ? data.getMyPoint.filter(item => item.Iteration.name === 'Iteration 2') : []
    const filteredItems3 = data && data.getMyPoint ? data.getMyPoint.filter(item => item.Iteration.name === 'Iteration 3') : []
    if (filteredItems1.length > 0) {
      const gradedPoint = filteredItems1[0]?.graded_point
      const pointByLOC = filteredItems1[0]?.point_by_LOC
      let totalAssessment1 = ""
      if (gradedPoint && pointByLOC) {
        totalAssessment1 = gradedPoint
      } else if (!gradedPoint && pointByLOC) {
        totalAssessment1 = pointByLOC
      } else if (gradedPoint && !pointByLOC) {
        totalAssessment1 = gradedPoint
      }
      setTotalAssessment1(totalAssessment1)
    } else {
      setTotalAssessment1(null)
    }

    if (filteredItems2.length > 0) {
      const gradedPoint = filteredItems2[0]?.graded_point
      const pointByLOC = filteredItems2[0]?.point_by_LOC
      let totalAssessment2 = ""
      if (gradedPoint && pointByLOC) {
        totalAssessment2 = gradedPoint
      } else if (!gradedPoint && pointByLOC) {
        totalAssessment2 = pointByLOC
      } else if (gradedPoint && !pointByLOC) {
        totalAssessment2 = gradedPoint
      }
      setTotalAssessment2(totalAssessment2)
    } else {
      setTotalAssessment2(null)
    }

    if (filteredItems3.length > 0) {
      const gradedPoint = filteredItems3[0]?.graded_point
      const pointByLOC = filteredItems3[0]?.point_by_LOC
      let totalAssessment3 = ""
      if (gradedPoint && pointByLOC) {
        totalAssessment3 = gradedPoint
      } else if (!gradedPoint && pointByLOC) {
        totalAssessment3 = pointByLOC
      } else if (gradedPoint && !pointByLOC) {
        totalAssessment3 = gradedPoint
      }
      setTotalAssessment3(totalAssessment3)
    } else {
      setTotalAssessment3(null)
    }
    const totalAssessment = (setting?.assessment_1 + setting?.assessment_2 + setting?.assessment_3) / 100
    if (filteredItems1.length > 0 && filteredItems2.length > 0 && filteredItems3.length > 0) {
      const total = ((totalAssessment1 * (setting?.assessment_1) / 100) + (totalAssessment2 * (setting?.assessment_2) / 100) + (totalAssessment3 * (setting?.assessment_3) / 100))
      setTotalAssessment(total.toFixed(1))
      if (total !== null && data.pointIterFinal && !data?.getMyPointResit?.graded_pointrs) {
        const ave = ((total * totalAssessment) + (data.pointIterFinal * (setting?.final_project) / 100)).toFixed(1)
        setAverage(ave)
        setColor(ave < 5 && data.pointIterFinal < 5 ? 'error' : 'success')
        setContent(ave < 5 && data.pointIterFinal < 5 ? 'NOT PASSED' : 'PASSED')
      } else if (total !== null && !data.pointIterFinal && data?.getMyPointResit?.graded_pointrs) {
        const ave = ((total * totalAssessment) + (data?.getMyPointResit?.graded_pointrs * (setting?.final_project) / 100)).toFixed(1)
        setAverage(ave)
        setColor(ave < 5 && data?.getMyPointResit?.graded_pointrs < 5 ? 'error' : 'success')
        setContent(ave < 5 && data?.getMyPointResit?.graded_pointrs < 5 ? 'NOT PASSED' : 'PASSED')
      } else if (total !== null && data?.pointIterFinal && data?.getMyPointResit?.graded_pointrs) {
        const ave = ((total * totalAssessment) + (data?.getMyPointResit?.graded_pointrs * (setting?.final_project) / 100)).toFixed(1)
        setAverage(ave)
        setColor(ave < 5 && data?.getMyPointResit?.graded_pointrs < 5 ? 'error' : 'success')
        setContent(ave < 5 && data?.getMyPointResit?.graded_pointrs < 5 ? 'NOT PASSED' : 'PASSED')
      } else {
        setAverage(null)
      }
    } else {
      setTotalAssessment(null)
    }

  }, [data.getMyPoint, totalAssessment1, totalAssessment2, totalAssessment3])

  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{`Grade report for: ${userData.first_name} ${userData?.last_name} (${userData.code ?? ''})`}</h2>
        <div className='mt-2 px-2'>
          <Row >
            <Col xl={4} lg={12} md={12}>
              <h3>GRADE CATEGORY</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <h3>GRADE ITEM</h3>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <h3>WEIGHT</h3>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <h3>VALUE</h3>
            </Col>
          </Row>
          <div style={{ borderBottom: '1px solid black' }}></div>
          <Row>
            <Col xl={4} lg={12} md={12}>
              <h3>Final Project Presentation</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>Final Project Presentation</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>Total</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.final_project}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.final_project}.0 %</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{data ? data.pointIterFinal : ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{data ? data.pointIterFinal : ''}</h3>
                </Col>
              </Row>

            </Col>
          </Row>
          <div style={{ borderBottom: '1px solid black' }}></div>
          <Row>
            <Col xl={4} lg={12} md={12}>
              <h3>Final Project Presentation Resit</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>Final Project Presentation Resit</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>Total</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.final_project}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.final_project}.0 %</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{data ? data?.getMyPointResit?.graded_pointrs : ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{data ? data?.getMyPointResit?.graded_pointrs : ''}</h3>
                </Col>
              </Row>

            </Col>
          </Row>
          <div style={{ borderBottom: '1px solid black' }}></div>
          <Row>
            <Col xl={4} lg={12} md={12}>
              <h3>On-going Assessment</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>On-going Assessment 1</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>On-going Assessment 2</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>On-going Assessment 3</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>Total</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.assessment_1}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.assessment_2}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.assessment_3}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{setting?.assessment_1 + setting?.assessment_2 + setting?.assessment_3}.0 %</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={2} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{totalAssessment1 ? totalAssessment1 : ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{totalAssessment2 ? totalAssessment2 : ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{totalAssessment3 ? totalAssessment3 : ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{totalAssessment}</h3>
                </Col>
              </Row>
            </Col>
          </Row>
          <div style={{ borderBottom: '1px solid black' }}></div>
          <Row>
            <Col xl={4} lg={12} md={12}>
              <h3>COURSE TOTAL</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>AVERAGE</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>STATUS</h3>
                </Col>
              </Row>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <h3>{average ?? ''}</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <Tag color={color}>{content}</Tag>
                </Col>
              </Row>
            </Col>

          </Row>
          <div style={{ borderBottom: '1px solid black', marginBottom: '50px' }}></div>
        </div>
      </Card>
    </Fragment >
  )
}

export default Position
