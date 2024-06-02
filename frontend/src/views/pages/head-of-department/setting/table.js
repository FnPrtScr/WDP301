import { Fragment, useContext, useEffect, useState } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import {
  Card,
  Button,
  Col,
  Row, 
  Table
} from 'reactstrap'
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
const MySwal = withReactContent(Swal)

const CustomHeader = ({ handleEdit }) => {
  const { t } = useTranslation()

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      <div className='d-flex justify-content-end mx-2 flex-grow-1'>
        <Button className='add-new-semester mx-50 my-25' color='primary' onClick={handleEdit}>
          {t('Edit')}
        </Button>
      </div>
    </div >
  )
}
const Position = () => {
  const {
    setDataItem,
    handleModal,
    setTypeModal,
    dataItem
  } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    api.settingApi.getOneSettingApi()
      .then((rs) => {
      setDataItem(rs)
      }).catch(() => {
        setLoading(false)
      })
    }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = () => {
    // setDataItem({})
    setTypeModal('Edit')
    handleModal()
  }

  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              handleEdit={handleEdit}
              loading={loading}
            />
          </Col>
        </Row>
        <div className='mt-2 px-2'>
          <Row >
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
                  <h3>{dataItem?.final_project}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{dataItem?.final_project}.0 %</h3>
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
                  <h3>{dataItem?.assessment_1}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{dataItem?.assessment_2}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{dataItem?.assessment_3}.0 %</h3>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <h3>{dataItem?.assessment_1 + dataItem?.assessment_2 + dataItem?.assessment_3}.0 %</h3>
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
