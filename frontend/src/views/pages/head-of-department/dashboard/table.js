import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Flex, Spin } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons"
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
import api from '../../../../api'
import ChartPieComponent from './chartPie'


// ** Table Header


const Position = () => {
  const { t } = useTranslation()
  const {

  } = useContext(UserContext)
  const [dataPie, setDataPie] = useState(null)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')

  const fetchData = () => {
    api.statisticApi.getStatisticPassAndNotPassApi({}, campus, semester)
      .then((rs) => {
        setDataPie(rs.data && rs.data)

      }).catch(() => {
      })
  }
  useEffect(() => {
    fetchData()
  }, [])


  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Statistic Pass/NotPass In Semester')}</h2>

        <div className='react-dataTable mx-2'>
          {!dataPie ? (
            <Flex gap="small" vertical style={{ height: '50vh', justifyContent: 'center', alignItems: 'center' }}>
              <Flex gap="small">
                <Spin tip="Loading" size="large">
                  <div className="content" />
                </Spin>
              </Flex>
            </Flex>
          ) : (
            <Card className='overflow-hidden mx-10'>
              <>
                <Row>
                  <Col xl={3} lg={3} md={3}>
                  </Col>
                  <Col xl={6} lg={6} md={6}>
                    <ChartPieComponent width={300} height={200} dataPie={dataPie} />
                  </Col>
                  <Col xl={3} lg={3} md={3}>
                  </Col>
                </Row>
              </>
            </Card>
          )}
        </div>
      </Card>
    </Fragment >
  )
}

export default Position
