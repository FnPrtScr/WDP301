import { Fragment, useContext, useEffect, useState } from 'react'
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
import { getSocket } from '../../../../serviceWorker'
import { selectThemeColors } from '@utils'
import Select, { components } from 'react-select' // eslint-disable-line
const defaultValues = {
  reviewerResit: []
}

const ModalAssignComponent = () => {
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
  const [filteredReviewers, setFilteredReviewers] = useState([])

  //const [reviewerResitId, setReviewerResitId] = useState([])
  const socket = getSocket()
  const {
    control,
    //setError,
    clearErrors,
    handleSubmit,
    setValue,
    //watch,
    reset,
    formState: { }
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
  const handleFormOpened = () => {
    fetchDataLecture()

    if (dataItem) {
      Object.entries(dataItem).forEach(
        ([name, value]) => {
          setValue(name, value)
          if (name === 'reviewerResit') {
            if (dataItem.reviewerResit.length > 0) {
              setValue('reviewerResit', dataItem.reviewerResit.map(item => item.value))
            }
          }
        }
      )
    }
  }
  const filterDataByLecturer = () => {
    if (dataLecture && dataItem && dataItem.coLectures && dataItem.reviewers) {
      // Lọc ra các co-lecturer và reviewer không phải là lecturer đã chọn
      const resit = dataLecture.filter(user => !dataItem.coLectures.some(id => id.coLecture_id === user.value) && !dataItem.reviewers.some(id => id.reviewer_id === user.value) && user.value !== dataItem.key)
      setFilteredReviewers(resit)
    }
  }
  useEffect(() => {
    filterDataByLecturer()
  }, [dataLecture, dataItem])
  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
  }

  //const validate = (data) => {

  //}

  const onSubmit = data => {
    const arrReviewer = dataItem.reviewerResit.map(item => item.value)
    const newColectures = data.reviewerResit.filter(item => !arrReviewer.includes(item))
    const updatedColectures = [...arrReviewer.map(item => (data.reviewerResit.includes(item) ? item : -item)), ...newColectures]
    data.reviewerResit = [...updatedColectures]
    api.classesApi.setReviewerResitApi({ reviewers_id: data.reviewerResit }, campus, semester, dataItem.class_id).then((rs) => {
      if (rs.statusCode === 201) {
        handleLoadTable()
        handleModal()
        notificationSuccess(t('Assign Reviewer Resit success'))
        socket.emit('notifications')
      } else {
        notificationError(t('Assign Reviewer Resit fail'))
      }
    }).catch((e) => {
      notificationError(t('Assign Reviewer Resit fail'))
      console.error('Edit class fail', e)
    })
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
        isOpen={openModal && typeModal === 'AssignResit'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Assign Reviewer Resit'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Reviewer Resit</Label>
                  <Controller
                    name='reviewerResit'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='reviewerResit'
                        value={(value.map((x) => filteredReviewers.find((val) => val.value === x)))}
                        onChange={(val) => {
                          onChange(val.map((item) => item.value))
                          //setReviewerResitId(val.map((item) => item.value))
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

export default ModalAssignComponent
