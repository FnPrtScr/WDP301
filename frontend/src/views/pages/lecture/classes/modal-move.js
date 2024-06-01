import { Fragment, useContext, useState } from 'react'
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
  student_id: 0,
  new_team_id: 0
}
import { Select as SelectAntd, Space } from "antd"
const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    typeModal
  } = useContext(UserContext)
  const { t } = useTranslation()
  const [team, setTeam] = useState([])
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()

  const {
    control,
    //setError,
    clearErrors,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues })

  const fetchDataGroup = () => {
    api.teamApi.getAllTeamFromClassApi({ keyword: '', page: 1 }, campus, semester, dataItem.value)
      .then((rs) => {
        setTeam(rs && rs.data ? rs.data.findAllTeam.map(item => {
          const class_id = item.class_id
          const value = item.team_id
          const label = item.name
          return {
            class_id,
            value,
            label
          }
        }) : [])
      })
      .catch(() => {
      })
  }
  const handleFormOpened = () => {
    fetchDataGroup()
    if (typeModal === "Move") {
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
    setTeam([])
  }
  //const validate = (data) => {
  //  let flag = true
  //  if (data.new_team_id === dataItem.new_team_id) {
  //    setError('selectedTeam', {
  //      message: `${t('Student already in this group!')} ${t('Please select a new group')}`
  //    })
  //    flag = false
  //  }
  //  return flag
  //}

  const onSubmit = (data) => {
    if (typeModal === "Move") {
      if (data.new_team_id !== dataItem.new_team_id) {
        api.teamApi.moveStudentIntoOtherTeamApi({ student_id: dataItem.userId, new_team_id: data.new_team_id }, campus, semester, dataItem.value, dataItem.new_team_id).then((rs) => {
          if (rs.success === true) {
            handleLoadTable()
            handleModal()
            notificationSuccess(t('Move student success'))
            socket.emit('notifications')
          } else {
            notificationError(t('Move student fail'))
          }
        }).catch((e) => {
          if (e.response.status === 404) {
            notificationError(t(e.response.data.message))
          } else {
            notificationError(t('Move student fail'))
          }
        }
        )
      } else {
        notificationError(t(`${t('Student already in this group!')} ${t('Please select a new group')}`))
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
        isOpen={openModal && typeModal === 'Move'}
        toggle={handleModal}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Move' ? 'Move Student Into Other Team' : ''} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Group</Label>
                  <Controller
                    name='new_team_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='new_team_id'
                        value={team && team.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value)
                        }}
                        placeholder={t('Select a new group for student')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={''}
                        options={team}
                        isClearable={false}

                      />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

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
