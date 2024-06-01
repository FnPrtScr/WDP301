import { Fragment, useContext, useState } from 'react'
import { Row, Col, Modal, Button, ModalBody } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import ModalHeader from '../../../@core/components/modal-header'
import { Form, Table } from 'antd'
import '../css/style.css'
import api from '../../../../api'

const ModalComponent = () => {
  const [data, setData] = useState([])

  const { openModalDetail,
    handleModalDetail,
    handleModal,
    setDataItem,
    typeModal,
    dataItem
  } = useContext(UserContext)
  const { t } = useTranslation()
  const handleFormOpened = () => {
    api.semesterApi.getAllsemesterApi(dataItem.semester_id).then((rs) => {
      setData(rs.data)
    })
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
        <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Semester' />
        <ModalBody>
          <div className='border p-2 mb-2'>
            <Row className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Form.Item label={t("Semester name")}>
                  <div>{dataItem.name}</div>
                </Form.Item>
              </Col>
              {data.length === 0 ? <></> : <>
              </>}
              <Col md={12} xs={12}>
                <Form.Item label={t("Start Date")}>
                  <div>{dataItem.startDate}</div>
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item label={t("End Date")}>
                  <div>{dataItem.endDate}</div>
                </Form.Item>
              </Col>
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
