import React, { Fragment, useContext, useState, useEffect } from 'react'
import { Card, Input, Button, Badge, Col, Row, InputGroup, TabPane } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ProjectContext } from './useContext'
import api from '../../../../api'
import { Tabs, List, Drawer, Avatar, Divider, Card as AntdCard } from 'antd'
import { EditOutlined, ExportOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
// import { notificationError, notificationSuccess } from '../../../../utility/notification'
import '../../../../styles/table.css'
const MySwal = withReactContent(Swal)

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
)

const tabClass = () => {
  const { t } = useTranslation()
  const {
    // setDataItem,
    // handleModal,
    // setTypeModal
  } = useContext(ProjectContext)
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataMyTeam, setDataMyTeam] = useState([])
  const [dataMyLecture, setDataMyLecture] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const { Meta } = AntdCard

  const [open, setOpen] = useState(false)
  const showDrawer = (user) => {
    setOpen(true)
    setCurrentUser(user)
  }
  const onClose = () => {
    setOpen(false)
  }

  const fetchDataMyTeam = () => {
    api.teamApi.getMyTeamApi({}, campus, semester)
      .then((rs) => {
        const teamUsersData = rs.data.map((teamUser) => ({
          id: teamUser.User.user_id,
          firstName: teamUser.User.first_name || '',
          lastName: teamUser.User.last_name || '',
          email: teamUser.User.email,
          lead: teamUser.isLead
        }))
        teamUsersData.sort((a, b) => (((a.lead === b.lead) ? 0 : a.lead) ? -1 : 1))
        setDataMyTeam(teamUsersData)
        setTotalItems(rs.total)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: rs.totalItems
          }
        })
      }).catch(() => {
      })
  }

  useEffect(() => {
    fetchDataMyTeam()
  }, [])
  const fetchDataMyLecture = () => {
    api.userClassSemesterApi.getAllLectureApi({}, campus, semester)
      .then((rs) => {
        setDataMyLecture([
          {
            id: rs.data?.Lecture.user_id,
            firstName: `${rs.data?.Lecture.first_name}`,
            lastName: `${rs.data?.Lecture.last_name}`,
            email: rs.data?.Lecture.email
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
      })
  }

  useEffect(() => {
    fetchDataMyLecture()
  }, [])

  const items = [
    {
      key: '1',
      label: 'My Team',
      children: (

        <Fragment >
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <>
                  <List
                    dataSource={dataMyTeam}
                    bordered
                    renderItem={(item) => (
                      <List.Item
                        key={item.id}
                        actions={[
                          <a onClick={() => showDrawer(item)} key={`a-${item.id}`}>
                            View Profile
                          </a>
                        ]}
                      >
                        <List.Item.Meta

                          avatar={
                            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                          }
                          title={
                            <span>
                              {`${(item.firstName !== null && item.firstName !== 'undefined') ? (
                                (item.firstName.includes("undefined") ? item.firstName.replace("undefined", " ") : item.firstName)
                              ) : ''} ${(item.lastName !== null && item.lastName !== 'undefined') ? (
                                (item.lastName.includes("undefined") ? item.lastName.replace("undefined", " ") : item.lastName)
                              ) : ''}${item.userCode ? `(${item.userCode})` : ''}`}
                              {item.lead ? <span style={{ color: 'red' }}> (TeamLeader)</span> : null}
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
                    <p
                      className="site-description-item-profile-p"
                      style={{
                        marginBottom: 24
                      }}
                    >
                      User Profile
                    </p>
                    <Row>
                      <Col span={12}>
                        <DescriptionItem
                          title="Full Name"
                          content={`${(currentUser?.firstName !== null && currentUser?.firstName !== 'undefined') ? (
                            // eslint-disable-next-line multiline-ternary
                            (currentUser?.firstName && currentUser?.firstName.includes("undefined")) ?
                              currentUser?.firstName.replace("undefined", " ") : currentUser?.firstName
                          ) : ''} ${(currentUser?.lastName !== null && currentUser?.lastName !== 'undefined') ? (
                            // eslint-disable-next-line multiline-ternary
                            (currentUser?.lastName && currentUser?.lastName.includes("undefined")) ?
                              currentUser?.lastName.replace("undefined", " ") : currentUser?.lastName
                          ) : ''}${currentUser?.userCode ? `(${currentUser?.userCode})` : ''}`}
                        />
                      </Col>
                      <Col span={12}>
                        <DescriptionItem title="Email" content={currentUser?.email} />
                      </Col>
                    </Row>
                  </Drawer>
                </>
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>

            </div>
          </Card>
        </Fragment >
      )
    },
    {
      key: '2',
      label: 'My Lecture',
      children: (
        <Fragment >
          <Card className='overflow-hidden'>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <>
                  <List
                    dataSource={dataMyLecture}
                    bordered
                    renderItem={(item) => (
                      <List.Item
                        key={item.id}
                        actions={[
                          <a onClick={() => showDrawer(item)} key={`a-${item.id}`}>
                            View Profile
                          </a>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                          }
                          title={`${(item.firstName !== null && item.firstName !== 'undefined') ? (item.firstName.includes("undefined") ? item.firstName.replace("undefined", " ") : item.firstName) : ''} ${(item.lastName !== null && item.lastName !== 'undefined') ? (item.lastName.includes("undefined") ? item.lastName.replace("undefined", " ") : item.lastName) : ''}${item.userCode ? `(${item.userCode})` : ''}`}
                        />
                      </List.Item>
                    )}
                  />
                  <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
                    <p
                      className="site-description-item-profile-p"
                      style={{
                        marginBottom: 24
                      }}
                    >
                      User Profile
                    </p>
                    <Row>
                      <Col span={12}>
                        <DescriptionItem title="Full Name" content={`${(currentUser?.firstName !== null && currentUser?.firstName !== 'undefined') ? (
                          // eslint-disable-next-line multiline-ternary
                          (currentUser?.firstName && currentUser?.firstName.includes("undefined")) ?
                            currentUser?.firstName.replace("undefined", " ") : currentUser?.firstName
                        ) : ''} ${(currentUser?.lastName !== null && currentUser?.lastName !== 'undefined') ? (
                          // eslint-disable-next-line multiline-ternary
                          (currentUser?.lastName && currentUser?.lastName.includes("undefined")) ?
                            currentUser?.lastName.replace("undefined", " ") : currentUser?.lastName
                        ) : ''}${currentUser?.userCode ? `(${currentUser?.userCode})` : ''}`} />
                      </Col>
                      <Col span={12}>
                        <DescriptionItem title="Email" content={currentUser?.email} />
                      </Col>
                    </Row>
                  </Drawer>
                </>
              </Col>
            </Row>
            <div className='react-dataTable mx-2'>

            </div>
          </Card>
        </Fragment >
      )
    }
  ]
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Team and Lecture Information')}</h2>
        <div className='react-dataTabs mx-2'>
          <Tabs defaultActiveKey="1" items={items}>
          </Tabs>
        </div>
      </Card>

    </Fragment>
  )
}

export default tabClass