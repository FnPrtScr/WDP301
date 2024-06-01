import { Fragment, useContext } from 'react'
import { Row, Col, Modal, Button, ModalBody } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import ModalHeader from '../../../../@core/components/modal-header'
import { Tabs, Table, Tag, Space, Tooltip, Avatar, List, Card as AntdCard } from 'antd'

const ModalComponent = () => {
  //const [data, setData] = useState([])

  const { openModalDetail,
    handleModalDetail,
    handleModal,
    setDataItem,
    typeModal,
    dataItem
  } = useContext(UserContext)
  const { t } = useTranslation()
  const { Meta } = AntdCard
  const handleFormOpened = () => {

  }

  const handleModalClosed = () => {
    setDataItem({})
  }
  const handleCancel = () => {
    handleModalDetail()
  }

  const renderFooterButtons = () => {
    return (
      <Fragment>
        <Button color='secondary' onClick={handleCancel} outline className='me-1'>{t('Close')}</Button>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Modal
        isOpen={openModalDetail}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='View Class Details' />
        <ModalBody>
          <div className='border p-2 mb-2'>
            <Row className='gy-1 pt-75'>
              <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Lecture')}</h2>
              <div style={{ borderBottom: '1px solid black' }}></div>
              <Row>
                <Col key={dataItem?.lecturer_id} xl={12} md={12} xs={12}>
                  <AntdCard key={dataItem?.lecturer_id} className='my-1'>
                    <Meta
                      avatar={<Avatar src={dataItem.avatar ? dataItem?.avatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${dataItem?.idx}`} style={{ marginTop: '10px' }} />}
                      title={<span >{dataItem?.label}</span>}
                      description={dataItem?.lectureName ? dataItem?.lectureName : ""}
                    />
                  </AntdCard>
                </Col>
              </Row>
              <Row className='px-2 mt-2'>
                <Col >
                  <h2 style={{ fontWeight: '700' }} >{t('Co-Lecture')}</h2>
                </Col>
              </Row>
              <div style={{ borderBottom: '1px solid black' }}></div>
              <Row>
                {dataItem.colectureEmail ? dataItem?.colectureEmail.map((item, index) => (
                  <Col key={index} xl={6} md={6} xs={6}>
                    <AntdCard key={index} className='my-1'>
                      <Row className="justify-content-between">
                        <Col>
                          <Meta
                            avatar={<Avatar src={item.colectureAvatar ? item.colectureAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                            title={<span>{item}</span>}
                            description={item.colectureName !== '' ? item.colectureName : null}
                          />
                        </Col>
                        {/*<Col className='mt-1' xs={1}>
                        < Space size="middle" >
                          <Tooltip title={t(`Delete`)}>
                            <DeleteOutlined onClick={() => { handleDelete(item) }}></DeleteOutlined>
                          </Tooltip>
                        </Space >
                      </Col>*/}
                      </Row>
                    </AntdCard>
                  </Col>
                )) : []}
              </Row>
              <Row className='px-2 mt-2'>
                <Col >
                  <h2 style={{ fontWeight: '700' }} >{t('Reviewer')}</h2>
                </Col>
              </Row>
              <div style={{ borderBottom: '1px solid black' }}></div>
              <Row>
                {dataItem.reviewerEmail ? dataItem?.reviewerEmail.map((item, index) => (
                  <Col key={index} xl={6} md={6} xs={6}>
                    <AntdCard key={index} className='my-1'>
                      <Row className="justify-content-between">
                        <Col>
                          <Meta
                            avatar={<Avatar src={item.reviewerAvatar ? item.reviewerAvatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.key}`} style={{ marginTop: '10px' }} />}
                            title={<span>{item}</span>}
                            description={item.reviewerName !== '' ? item.reviewerName : null}
                          />
                        </Col>
                        {/*<Col className='mt-1' xs={1}>
                        < Space size="middle" >
                          <Tooltip title={t(`Delete`)}>
                            <DeleteOutlined onClick={() => { handleDelete(item) }}></DeleteOutlined>
                          </Tooltip>
                        </Space >
                      </Col>*/}
                      </Row>
                    </AntdCard>
                  </Col>
                )) : []}
              </Row>
            </Row>
          </div>
        </ModalBody>
        <div
          className='d-flex justify-content-end p-1'
          style={{ boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)' }}
        >
          {renderFooterButtons()}
        </div>
      </Modal>
    </Fragment >
  )
}

export default ModalComponent
