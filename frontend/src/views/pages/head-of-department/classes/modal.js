import { Fragment, useContext, useState, useEffect } from 'react'
import {
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalBody,
  FormFeedback,
  Form
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { getSocket } from '../../../../serviceWorker'
//import { Select as SelectAntd, Space } from "antd"
const defaultValues = {
  name: '',
  lecturer_id: 0,
  colectures: [],
  reviewers: []
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal } = useContext(UserContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataLecture, setDataLecture] = useState([])
  const [filteredColectures, setFilteredColectures] = useState([])
  const [filteredReviewers, setFilteredReviewers] = useState([])
  const [lecturerId, setLecturerId] = useState(null)
  const [colectureId, setColectureId] = useState([])
  const [reviewerId, setreviewerId] = useState([])
  const socket = getSocket()

  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    //watch,
    //getValues,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })
  const fetchDataLecture = () => {
    api.userRoleSemesterApi.getAllLectureNotPagingApi({}, campus, semester)
      .then((rs) => {

        setDataLecture(rs && rs.data ? rs.data.map((item) => {
          // Sử dụng Map để lưu trữ các user_id đã xuất hiện
          const userIdMap = new Map()

          // Duyệt qua các cặp key-value trong đối tượng
          return Object.entries(item).map(([key, userArray]) => {
            // Duyệt qua mảng đối tượng để trích xuất thông tin user_id và email
            return userArray.map(user => {
              const { user_id, User } = user
              const { email } = User

              // Kiểm tra xem user_id đã xuất hiện trước đó hay chưa
              if (userIdMap.has(user_id)) {
                // Nếu đã xuất hiện, kiểm tra xem email đã tồn tại trong user_id đó hay chưa
                if (userIdMap.get(user_id) !== email) {
                  // Nếu email khác nhau, trả về null để không gộp vào mảng kết quả
                  return null
                }
              } else {
                // Nếu chưa xuất hiện, gán user_id và email vào Map và trả về object mới
                userIdMap.set(user_id, email)
                return { key, value: user_id, label: email }
              }
            }).filter(Boolean) // Loại bỏ các phần tử null (đã trùng user_id nhưng khác email)
          }).flat() // Sử dụng flat để làm phẳng mảng kết quả
        }).flat() : [])

      })
      .catch(() => {
      })
  }
  //sửa corelecture không phải reviewer ở đây
  const filterDataByLecturer = () => {
    if (lecturerId) {
      // Lọc ra các co-lecturer và reviewer không phải là lecturer đã chọn
      const filteredColectures = dataLecture.filter(user => user.value !== lecturerId)
      setFilteredColectures(filteredColectures)
      const filteredReviewers = dataLecture.filter(user => user.value !== lecturerId)
      setFilteredReviewers(filteredReviewers)
    }
  }
  const filterDataByColecturer = () => {
    if (colectureId) {
      // Lọc ra các co-lecturer và reviewer không phải là lecturer đã chọn
      const filteredReviewers = dataLecture.filter(user => !colectureId.some(id => id === user.value) && user.value !== lecturerId)
      setFilteredReviewers(filteredReviewers)
    }
  }
  const filterDataByReviewer = () => {
    if (reviewerId) {
      // Lọc ra các co-lecturer và reviewer không phải là lecturer đã chọn
      const filteredColectures = dataLecture.filter(user => !reviewerId.some(id => id === user.value) && user.value !== lecturerId)
      setFilteredColectures(filteredColectures)
    }
  }
  useEffect(() => {
    filterDataByLecturer()
  }, [lecturerId])

  useEffect(() => {
    filterDataByColecturer()
  }, [colectureId])

  useEffect(() => {
    filterDataByReviewer()
  }, [reviewerId])

  useEffect(() => {
    filterDataByLecturer()
  }, [dataLecture])

  useEffect(() => {
    if (typeModal === 'Edit' && dataItem && dataItem.lecturer_id) {
      setLecturerId(dataItem.lecturer_id) // Cập nhật lecturerId khi dataItem thay đổi
    }
  }, [dataItem])

  const handleFormOpened = () => {
    fetchDataLecture()
    if (typeModal === "Edit") {
      if (dataItem) {
        Object.entries(dataItem).forEach(
          ([name, value]) => {
            setValue(name, value)
          }
        )
      }
    }
  }

  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
    setDataLecture([])
    setFilteredReviewers([])
    setFilteredColectures([])
    setLecturerId(null)
    setColectureId([])
    setreviewerId([])
  }

  const validate = (data) => {
    let flag = true
    if (data.name.length === 0) {
      setError('name', {
        message: `${t('Please enter a valid')} ${t('Class Name')}`
      })
      flag = false
    }
    return flag
  }

  const onSubmit = data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        // Tìm các phần tử mới được thêm vào
        const newColectures = data.colectures.filter(item => !dataItem.colectures.includes(item))
        const newReviewers = data.reviewers.filter(item => !dataItem.reviewers.includes(item))
        // Tạo mảng mới với giá trị có dấu "-" đằng trước những phần tử mới thêm vào
        const updatedColectures = [...dataItem.colectures.map(item => (data.colectures.includes(item) ? item : -item)), ...newColectures]
        const updatedReviewers = [...dataItem.reviewers.map(item => (data.reviewers.includes(item) ? item : -item)), ...newReviewers]
        data.colectures = [...updatedColectures]
        data.reviewers = [...updatedReviewers]
        api.classesApi.updateOneClassesApi(data, campus, semester, dataItem.key).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Edit class success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Edit class fail'))
          }
        }).catch((e) => {
          notificationError(t('Edit class fail'))
          console.error('Edit class fail', e)
        })
      }
    } else {
      if (validate(data)) {
        if (data.lecturer_id === 0) {
          notificationError(t('Please Select Lecturer'))
        } else {
          api.classesApi.createOneClassesApi(data, campus, semester).then((rs) => {
            if (rs.statusCode === 201) {
              handleLoadTable()
              handleModal()
              notificationSuccess(t('Add class success'))
              socket.emit('notifications')
            } else {
              notificationError(t('Add class fail'))
            }
          }).catch((e) => {
            if (e.response.status === 400) {
              notificationError(e.response.data.error)
            } else {
              notificationError(t('Add class fail'))
            }
          }
          )
        }

      }
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModal()
  }

  const renderFooterButtons = () => {
    return (
      <Fragment>
        <Button color='primary' className='me-1'>{t('Save')}</Button>
        <Button color='secondary' onClick={handleCancel} outline className='me-1'>{t('Close')}</Button>
      </Fragment>
    )
  }
  return (
    <Fragment >
      <Modal
        isOpen={openModal && (typeModal === 'Add' || typeModal === 'Edit')}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Add Class' : 'Edit Class'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Class Name')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='name' placeholder={t('Enter Class Name')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Lecture<span style={{ color: 'red' }}>*</span></Label>
                  <Controller
                    name='lecturer_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='lecturer_id'
                        value={dataLecture && dataLecture?.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value)
                          setLecturerId(e.value)
                        }}
                        placeholder={t('Select Lecture')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={''}
                        options={dataLecture}
                        isClearable={false}
                      />
                    )}
                  />
                </Col>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Co-Lecture</Label>
                  <Controller
                    name='colectures'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='colectures'
                        value={(value.map((x) => filteredColectures.find((val) => val.value === x)))}
                        onChange={(val) => {
                          onChange(val.map((item) => item.value))
                          setColectureId(val.map((item) => item.value))
                        }}
                        isClearable={false}
                        theme={selectThemeColors}
                        isMulti
                        options={filteredColectures}
                        className='react-select'
                        classNamePrefix='select'
                        closeMenuOnSelect={false}
                      />
                    )}
                  />
                </Col>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Reviewer</Label>
                  <Controller
                    name='reviewers'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='reviewers'
                        value={(value.map((x) => filteredReviewers.find((val) => val.value === x)))}
                        onChange={(val) => {
                          onChange(val.map((item) => item.value))
                          setreviewerId(val.map((item) => item.value))
                        }}
                        isClearable={false}
                        theme={selectThemeColors}
                        isMulti
                        options={filteredReviewers}
                        className='react-select'
                        classNamePrefix='select'
                        closeMenuOnSelect={false}
                      />
                    )}
                  />
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
        </Form>
      </Modal>
    </Fragment>

  )
}

export default ModalComponent
