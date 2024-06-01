import { Fragment, useContext } from 'react'
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
const defaultValues = {
  student_ids: [],
  new_team_id: 0
}

const ModalAddManyComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal
  } = useContext(UserContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()

  // eslint-disable-next-line no-unused-vars
  const optionStudent = (dataItem.dataStudentWithoutGroup || []).map(student => ({
    value: student.key,
    label: student.email_student
  }))
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    //setValue,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleFormOpened = () => {
  }
  const handleModalClosed = () => {
    clearErrors()
    reset()
    setDataItem({})
  }
  const validate = (data) => {
    let flag = true
    if (!data.student_ids || data.student_ids.length === 0) {
      setError('student_ids', {
        message: `${t('Please select a student')}`
      })
      flag = false
    }
    return flag
  }
  const onSubmit = (data) => {
    if (typeModal === "AddManyStudentIntoGroup") {
      if (validate) {
        api.teamApi.addOneStudentIntoTeam({ student_ids: data.student_ids, team_id: dataItem.item.new_team_id }, campus, semester, dataItem.item.value).then((rs) => {
          if (rs.statusCode === 201) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Move student success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Move student fail'))
          }
        }).catch(() => {
          notificationError(t('Move student fail'))
        }
        )
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
        isOpen={openModal && typeModal === 'AddManyStudentIntoGroup'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'AddManyStudentIntoGroup' ? 'Add Student Into Team' : ''} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Student</Label>
                  <Controller
                    name='student_ids'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='student_ids'
                        value={(value && value.map((x) => optionStudent.find((val) => val.value === x)))}
                        onChange={(val) => {
                          onChange(val.map((item) => item.value))
                        }}
                        isClearable={false}
                        theme={selectThemeColors}
                        //closeMenuOnSelect={false}
                        //components={animatedComponents}
                        isMulti
                        options={optionStudent}
                        className='react-select'
                        classNamePrefix='select'
                      />
                    )}
                  />
                  {errors.student_ids && <FormFeedback>{errors.student_ids.message}</FormFeedback>}

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

export default ModalAddManyComponent
