/* eslint-disable no-unused-vars */
import { Fragment, useContext, useState, useEffect } from 'react'
import { Row, Col, Modal, Button, ModalBody } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import ModalHeader from '../../../../@core/components/modal-header'
import withReactContent from 'sweetalert2-react-content'
import { Form, Table, Space, Tooltip } from 'antd'
import Swal from 'sweetalert2'

// import '../css/style.css'
import api from '../../../../api'
const MySwal = withReactContent(Swal)
const ModalDetailComponent = () => {

  const { openModalDetail,
    handleModalDetail,
    handleModal,
    setDataItem,
    typeModal,
    dataItem,
    loadTableDetail
  } = useContext(ProjectContext)
  const { t } = useTranslation()
  const [data, setData] = useState([])
  // const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1
    }
  })
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')

  const fetchData = () => {
    setLoading(true)
    api.funcrmApi.getAllFunctionByStudentApi({}, campus, semester, dataItem.project_id)
      .then((rs) => {
        setData(rs && rs.data.FunctionRequirements.map((item, index) => ({
          key: index + 1,
          fcrm_id: item?.functionrequirement_id,
          name: item?.name,
          feature: item?.feature,
          complexity: item?.complexity,
          LOC: item?.LOC,
          description: item?.description
        })))
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
        setLoading(false)
      })
  }

  const headerColumns = [
    {
      title: t('#'),
      dataIndex: 'key',
      key: 'key',
      width: 50
    },
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
      width: 100
    },
    {
      title: t('LOC'),
      dataIndex: 'LOC',
      key: 'LOC',
      width: 100
    },
    {
      title: t('Complexity'),
      dataIndex: 'complexity',
      key: 'complexity',
      width: 100
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 100
    }

  ]
  const handleFormOpened = () => {
    fetchData()
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
        isOpen={openModalDetail && typeModal === 'Detail'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        style={{ maxWidth: '90%' }}
        className='modal-dialog-centered modal-lg'>
        <ModalHeader typeModal={typeModal} handleModal={handleCancel} title='Function Requirement' />
        <ModalBody>
          <div className='border p-2 mb-2'>
            <Row className='gy-1 pt-75'>
              {/* {data.length === 0 ? <></> : <> */}
              {dataItem.length === 0 ? <></> : <>
                <Col md={12} xs={12}>
                  <Table
                    pagination={false}
                    dataSource={data}
                    bordered
                    columns={headerColumns}
                    loading={loading}
                    loadTableDetail={loadTableDetail}
                  ></Table>
                </Col>
              </>}
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

export default ModalDetailComponent
