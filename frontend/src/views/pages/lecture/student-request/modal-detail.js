import { Fragment, useContext, useState } from 'react'
import { Row, Col, Modal, Button, ModalBody } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import { RequestContext } from './useContext'
import { useTranslation } from 'react-i18next'
import ModalHeader from '../../../../@core/components/modal-header'
import { Table, Tag, Space, Tooltip, Switch, DatePicker } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons"


const ModalComponent = () => {
  const [data, setData] = useState([])
  

  const { openModalDetail,
    handleModalDetail,
    handleModal,
    setDataItem,
    typeModal,
    dataItem
  } = useContext(RequestContext)
  const { t } = useTranslation()
  const handleFormOpened = () => {
    setData(dataItem.functionReqs)
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
  const headerColumns = [
    {
      title: t('Function Name'),
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: t('Feature'),
      dataIndex: 'feature',
      key: 'feature',
      width: 75
    },
    {
      title: t('LOC'),
      dataIndex: 'LOC',
      key: 'LOC',
      width: 50,
      align:'center'
    },
    {
      title: t('Complexity'),
      dataIndex: 'complexity',
      key: 'complexity',
      width: 75,
      align:'center'
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 200
    },
    {
      title: t('Action'),
      dataIndex: '',
      align: 'center',
      key: 'action',
      width: 70,
      render: (_, record) => (
        < Space size="middle" >
          <Tooltip title={t(`Edit`)}>
            <EditOutlined onClick={() => { handleEdit(record) }}></EditOutlined>
          </Tooltip>
          <Tooltip title={t(`Delete`)}>
            <DeleteOutlined onClick={() => { handleDelete(record) }}></DeleteOutlined>
          </Tooltip>
        </Space >
      )
    }
  ]
  return (
    <Fragment>
      <Modal
        isOpen={openModalDetail && typeModal === 'Detail'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-xl'>
        <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Function Requirement' />
        <ModalBody>
          <div className='border p-2 mb-2'>
            <Row className='gy-1 pt-75'>
              <div className='react-dataTable mx-2'>
                <Table
                  // style={{ height: windowSize.innerHeight - 280 }}
                  dataSource={data}
                  bordered
                  columns={headerColumns}
                ></Table>
              </div>
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
