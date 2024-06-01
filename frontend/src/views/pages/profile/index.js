// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Custom Components
import UILoader from '@components/ui-loader'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import { Row, Col, Button, Card } from 'reactstrap'
import '@styles/react/pages/page-profile.scss'
import api from '../../../api'
const Profile = () => {
  const [data, setData] = useState([])
  // ** States
  const fetchData = () => {
    api.userApi.getMyProfileApi({})
      .then((rs) => {
        setData(rs && rs?.data)
      }).catch(() => {
      })
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Fragment>
      <Breadcrumbs title='Profile' data={[{ title: 'Profile' }]} />

      <Card className='overflow-hidden'>
        <Row className='px-2 mt-2'>
          <Col xl={12} md={12} xs={12}>
            <h2 style={{ fontWeight: '700', fontWeight: 'bold' }} >{'User detail'}</h2>

          </Col>
          <Col className={'mt-2 mb-2'} xl={12} md={12} xs={12}>
            <h4 style={{ fontWeight: '400' }}> <b>Name and Code: </b>{`${data?.email?.split('@')[0]}`}</h4>
            <div style={{ borderBottom: '1px solid black' }}></div>
          </Col>
          <Col className={'mt-2 mb-2'} xl={12} md={12} xs={12}>
            <h4 style={{ fontWeight: '400' }}> <b>Full name: </b>{`${data?.first_name}${data?.last_name}`}</h4>
            <div style={{ borderBottom: '1px solid black' }}></div>
          </Col>
          <Col className={'mt-2 mb-2'} xl={12} md={12} xs={12}>
            <h4 style={{ fontWeight: '400' }}> <b>Email:</b> {`${data?.email}`}</h4>
            <div style={{ borderBottom: '1px solid black' }}></div>
          </Col>
          <Col className={'mt-2 mb-2'} xl={12} md={12} xs={12}>
            <h4 style={{ fontWeight: '400' }}> <b>image:</b></h4>
            <img src={data?.avatar} alt="Avatar" height={'200px'}></img>

          </Col>
          <div className={'mb-2'} style={{ borderBottom: '1px solid black' }}></div>
        </Row>
      </Card>
    </Fragment>
  )
}

export default Profile
