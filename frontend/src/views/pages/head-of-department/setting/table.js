import { Fragment, useContext, useEffect, useState, useRef } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tour } from 'antd'
import { Card, Col, Row, Button } from 'reactstrap'
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'

const MySwal = withReactContent(Swal)
const campus = window.localStorage.getItem('campus')
const semester = window.localStorage.getItem('semester')

const CustomHeader = ({ handleEdit }) => {
  const { t } = useTranslation()

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      <div className='d-flex justify-content-end mx-2 flex-grow-1'>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleEdit}>
          {t('Edit')}
        </Button>
      </div>
    </div>
  )
}

const Position = () => {
  const { t } = useTranslation()
  // khai bao ref của những phần tử cần định nghĩa
  const refTable = useRef(null)
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    windowSize,
    updateCounter
  } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [setting, setSetting] = useState({})
  const [data, setData] = useState([])
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

  const fetchData = () => {
    setLoading(true)
    api.settingApi
      .getAll({}, campus, semester)
      .then((rs) => {
        const lastElement = rs.data[rs.data.length - 1]
        setSetting(lastElement)
        setData(rs.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })

  }

  useEffect(() => {
    fetchData()
  }, [updateCounter])

  const handleEdit = () => {
    setDataItem({
      assessment_1: data[data.length - 1].assessment_1,
      assessment_2: data[data.length - 1].assessment_1,
      assessment_3: data[data.length - 1].assessment_1,
      final_project: data[data.length - 1].final_project,
      total: '',
      status: true
    })
    setTypeModal('Edit')
    handleModal()
  }

  const headerColumns = [
    {
      title: t("ID"),
      dataIndex: 'setting_id',
      key: 'setting_id',
      width: 150,
      align: 'center'
    },
    {
      title: t('Assignment 1'),
      dataIndex: 'assessment_1',
      key: 'assessment_1',
      width: 150,
      align: 'center'
    },
    {
      title: t('Asignment 2'),
      dataIndex: 'assessment_2',
      key: 'assessment_2',
      width: 150,
      align: 'center'
    },
    {
      title: t('Assignment 3'),
      dataIndex: 'assessment_3',
      key: 'assessment_3',
      width: 150,
      align: 'center'
    },
    {
      title: t('Final Project'),
      dataIndex: 'final_project',
      key: 'final_project',
      width: 150,
      align: 'center'
    }
  ]
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }

  return (
    <Fragment>
      <Card className='overflow-hidden'>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader handleEdit={handleEdit} loading={loading} />
          </Col>
        </Row>
        <div className='mt-2 px-2'>
          <Row>
            <Col xl={4} lg={12} md={12}>
              <h3>GRADE CATEGORY</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <h3>GRADE ITEM</h3>
            </Col>
            <Col xl={4} lg={12} md={12}>
              <h3>WEIGHT</h3>
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
          </Row>
          <div style={{ borderBottom: '1px solid black', marginBottom: '50px' }}></div>
        </div>
        <div className='react-dataTable mx-2 pb-4' ref={refTable}>
          <Table
            // style={{ height: windowSize.innerHeight - 280 }}
            dataSource={data}
            bordered
            columns={headerColumns}
            // pagination={tableParams.pagination}
            pagination={false}
            onChange={handleTableChange}
            loading={loading}
            scroll={{
              x: 0,
              y: windowSize.innerHeight - 280
            }}
            rowClassName={getRowClassName}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default Position
