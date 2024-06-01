/* eslint-disable no-unused-vars */
import { Fragment, useContext, useState, useEffect } from 'react'
import {
  Row,
  Col,
  Modal,
  Label,
  Button,
  ModalBody,
  FormFeedback,
  Form
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { Select as SelectAntd, Space } from "antd"
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  class_id: 0,
  project_id: 0
}

const ModalAsignComponent = () => {
  const {
    handleModalAsign,
    handleModal,
    handleLoadTable,
    //setDataItem,
    openModalAsign,
    dataItem,
    typeModal
  } = useContext(ProjectContext)
  const { t } = useTranslation()
  const socket = getSocket()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataClass, setDataClass] = useState([])
  const [dataTeam, setDataTeam] = useState([])
  const [arrDataAssign, setArrDataAssign] = useState([])
  const {
    control,
    clearErrors,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange' })

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
      .catch(() => {
      })
  }

  const getStudent = (id) => {
    api.teamApi.getAllTeamFromClassApi({ keyword: '', page: 1 }, campus, semester, id)
      .then((rs) => {
        setDataTeam(rs && rs.data ? rs.data.findAllTeam.map(item => {
          const value = item.team_id
          const label = item.name
          return {
            value,
            label
          }
        }) : [])
      })
      .catch(() => {
      })
  }


  const handleFormOpened = () => {
    fetchDataClass()
    if (typeModal === "AsignTeam") {
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
    // handleModal()
    // setDataItem({})
  }
  // const validate = (data) => {
  //   let flag = true
  //   if (data.team_id === dataItem.new_team_id) {
  //     setError('selectedTeam', {
  //       message: `${t('Student already in this group!')} ${t('Please select a new group')}`
  //     })
  //     flag = false
  //   }
  //   return flag
  // }
  const onSubmit = (data) => {
    data.teams_id = arrDataAssign
    if (typeModal === "AsignTeam") {
      if (!arrDataAssign || arrDataAssign.length === 0) {
        notificationError(t('Please select at least one team'))
        return
      }
      api.teamProjectApi.AsignProjectApi(data, campus, semester).then((rs) => {
        if (rs.statusCode === 201) {
          handleLoadTable()
          handleModalAsign()
          notificationSuccess(t('Assign project success'))
          socket.emit('notifications')
        }
      }).catch((e) => {
        if (e.response.status === 500) {
          notificationError(t(e.response.data.error?.message))
        } else {
          notificationError(t('Assign project fail'))
        }
      })
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModalAsign()
  }
  const handleChange = (value) => {
    setArrDataAssign(value)
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
        isOpen={openModalAsign && typeModal === 'AsignTeam'}
        toggle={handleModalAsign}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Asign Project Into Group'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
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
                          onChange(e.value)
                          getStudent(e.value)
                          setValue('project_id', dataItem)
                          // setValue('team_id', undefined)
                        }}
                        placeholder={t('Select class')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={''}
                        options={dataClass}
                        isClearable={false}
                      />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

                </Col>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Team</Label>
                  <SelectAntd
                    mode="multiple"
                    style={{
                      width: "100%",// eslint-disable-line
                    }}
                    placeholder="Select Team"
                    defaultValue={[]}
                    onChange={handleChange}
                    optionLabelProp="label"
                    options={dataTeam}
                    optionRender={(option) => (
                      <Space>
                        <span role="img" aria-label={option.label}>
                        </span>
                        {option.label}
                      </Space>
                    )}
                  />
                  {errors.team_id && <FormFeedback>{errors.team_id.message}</FormFeedback>}

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

export default ModalAsignComponent
