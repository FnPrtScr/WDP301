import { Fragment, useState, useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Modal, Space, Tooltip, Checkbox, Empty } from 'antd'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import Select from 'react-select'
import { Card, Input, Button, Badge, Col, Row, InputGroup, Label } from 'reactstrap'
import { UserContext } from './useContext'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import api from '../../../../api'
import '../../../../styles/table.css'
import { Controller, useForm } from 'react-hook-form'
import * as Utils from '@utils'
const MySwal = withReactContent(Swal)
const defaultValues = {
  class_id: 0,
  mileStone_id: 0
}
// ** Table Header
const CustomHeader = ({ handleFilter }) => {
  const { t } = useTranslation()

  const [searchText, setSearchTerm] = useState('')

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
      < div className='d-flex align-items-centerm mx-50'>
        <InputGroup className='my-25'>
          <Input
            id='search-invoice'
            style={{ minWidth: '200px' }}
            placeholder={t('Search')}
            type='search'
            value={searchText}
            onChange={e => {
              if (e.target.value) {
                setSearchTerm(e.target.value)
              } else {
                handleFilter('')
                setSearchTerm(e.target.value)
              }

            }}
          />
          <span style={{ cursor: 'pointer' }} onClick={() => { handleFilter(searchText) }} className='input-group-text '>
            <SearchOutlined></SearchOutlined>
          </span>
        </InputGroup>

      </div>
      <div className='d-flex justify-content-end mx-2'>
      </div>
    </div >
  )
}

const Position = () => {
  const { t } = useTranslation()
  const {
    windowSize,
    loadTable
    //openModal
  } = useContext(UserContext)
  const {
    control,
    //clearErrors,
    //handleSubmit,
    //setValue,
    formState: { }
  } = useForm({ defaultValues, mode: 'onChange' })
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  //const [currentPage, setCurrentPage] = useState(1)
  //const [rowsPerPage, setRowsPerPage] = useState(10)
  //const [totalItems, setTotalItems] = useState(0)
  const [currentStatus, setcurrentStatus] = useState()
  const [loading, setLoading] = useState(false)
  //const [tableParams, setTableParams] = useState({
  //  pagination: {
  //    current: 1
  //  }
  //})
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const dataProject = window.localStorage.getItem('dataProject')
  const [optionMilestone, setOptionMilestone] = useState([])
  const [dataClass, setDataClass] = useState([])
  const [classId, setClassId] = useState(null)
  const [mileStoneId, setMileStoneId] = useState(null)
  useEffect(() => {
    if (dataProject) {
      const parsedDataProject = JSON.parse(dataProject)
      if (parsedDataProject.length > 0) {
        setOptionMilestone(parsedDataProject.map((item, index) => ({
          key: index,
          value: item.navLink,
          label: item.title
        })))
      }
    }
  }, [dataProject])

  const fetchDataClass = () => {
    api.classesApi.getAllMyClassApi({ keyword: '', page: 1 }, campus, semester)
      .then((rs) => {
        setDataClass(rs && rs.data ? rs.data.rows.map(item => {
          const value = item.class_id
          const label = item.name
          return {
            value,
            label
          }
        }) : [])
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const fetchData = (classId, iterationId) => {
    setLoading(true)
    if (classId !== (null || undefined) && iterationId !== (null || undefined)) {
      api.pointApi.getPointByClassApi({ keyword: searchTerm, iteration: iterationId }, campus, semester, classId)
        .then((rs) => {
          //const offset = (currentPage - 1) * 10
          setData(rs.data && rs.data ? rs.data.map((item, index) => ({
            ...item,
            key: index,
            idx: index + 1,
            graded_point: item.graded_point,
            studentName: item.User.email.split('@')[0],
            teamName: item.Team.name,
            iterationName: item.Iteration.name

          })) : [])
          //setTotalItems(rs.totalPages)
          setLoading(false)
          //setTableParams({
          //  ...tableParams,
          //  pagination: {
          //    ...tableParams.pagination,
          //    total: rs.data.counta
          //  }
          //})
        }).catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

  }
  useEffect(() => {
    fetchDataClass()
  }, [loadTable])
  useEffect(() => {
    fetchData()
  }, [loadTable, searchTerm, currentStatus, classId, mileStoneId])

  //const handlePagination = page => {
  //  setCurrentPage(page.selected + 1)
  //}


  let tmi
  const handleFilter = val => {
    clearTimeout(tmi)
    tmi = setTimeout(() => {
      setSearchTerm(val)

    }, 500)
  }

  //const CustomPagination = () => {

  //  const countPage = Number(Math.ceil(totalItems))
  //  return (
  //    <div className='d-flex align-items-center w-100 justify-content-between'>
  //      <div className='ps-2'>
  //      </div>
  //      <ReactPaginate
  //        previousLabel={''}
  //        nextLabel={''}
  //        pageCount={countPage || 1}
  //        activeClassName='active'
  //        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
  //        onPageChange={page => handlePagination(page)}
  //        pageClassName={'page-item'}
  //        nextLinkClassName={'page-link'}
  //        nextClassName={'page-item next'}
  //        previousClassName={'page-item prev'}
  //        previousLinkClassName={'page-link'}
  //        pageLinkClassName={'page-link'}
  //        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
  //      />
  //    </div >
  //  )
  //}

  const headerColumns = [
    {
      title: <div style={{ textAlign: 'center' }}>{t('Index')}</div>,
      dataIndex: 'idx',
      key: 'idx',
      width: 70,
      minWidth: 50,
      maxWidth: 100,
      align: 'center'
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Team Name')}</div>,
      dataIndex: 'teamName',
      key: 'teamName',
      width: 80,
      minWidth: 50,
      maxWidth: 100,
      align: 'center'
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Iteration Name')}</div>,
      dataIndex: 'iterationName',
      key: 'iterationName',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Student Name')}</div>,
      dataIndex: 'studentName',
      key: 'studentName',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Point By Total LOC')}</div>,
      dataIndex: 'point_by_LOC',
      key: 'point_by_LOC',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    },
    {
      title: <div style={{ textAlign: 'center' }}>{t('Graded Point')}</div>,
      dataIndex: 'graded_point',
      key: 'graded_point',
      width: 150,
      minWidth: 50,
      maxWidth: 200
    }
  ]
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'
  }
  return (
    <Fragment >
      <Card className='overflow-hidden'>
        <h2 style={{ fontWeight: '700' }} className='px-2 mt-2'>{t('Manage Mark In Semester')}</h2>
        <Row>
          <Col xl={12} lg={12} md={12}>
            <CustomHeader
              currentStatus={currentStatus}
              setcurrentStatus={setcurrentStatus}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTabs mx-2 mt-2'>
          <div className='border p-1 mb-2' style={{ backgroundColor: 'white', borderRadius: '10px' }}>
            <Row className='gy-1'>
              <Col className='mb-1' md='12' sm='12'>
                <Label className='form-label'>Selected Class</Label>
                <Controller

                  name='class_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      id='class_id'
                      value={dataClass.find((val) => val.value === value)}
                      onChange={(e) => {
                        onChange(e?.value)
                        //fetchData(e?.value)
                        setClassId(e?.value)
                        //setMileStoneId('')
                      }}
                      placeholder={t('Select class')}
                      theme={Utils}
                      className='react-select'
                      classNamePrefix='select'
                      defaultValue={''}
                      options={dataClass}
                      isClearable={false}
                    />
                  )}
                />
              </Col>
              <Col className='mb-1' md='12' sm='12'>
                <Label className='form-label'>Selected Iteration</Label>
                <Controller

                  name='mileStone_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      id='mileStone_id'
                      value={optionMilestone.find((val) => val.value === value)}
                      onChange={(e) => {
                        onChange(e?.value)
                        setMileStoneId(e?.value)
                        fetchData(classId, e?.value)
                      }}
                      placeholder={t('Select class')}
                      theme={Utils}
                      className='react-select'
                      classNamePrefix='select'
                      options={optionMilestone}
                      isClearable={false}
                    />
                  )}
                />
              </Col>
            </Row>
          </div>
        </div>
        {(mileStoneId === null || classId === null) ? (
          <>
            <div style={{ marginTop: '100px' }}></div> {/* Thêm khoảng trống */}
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            <div style={{ marginBottom: '100px' }}></div>
          </>
        ) : (
          <>
            <div className='react-dataTable mx-2 mb-2'>
              <Table
                dataSource={data}
                bordered
                columns={headerColumns}
                pagination={false}
                //onChange={handleTableChange}
                loading={loading}
                scroll={{
                  x: 'max-content',
                  y: windowSize.innerHeight - 280
                }}
                rowClassName={getRowClassName}
              ></Table>
              {/*<CustomPagination />*/}
            </div>
          </>
        )}
      </Card>
    </Fragment >
  )
}

export default Position
