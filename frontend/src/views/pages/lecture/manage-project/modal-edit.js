/* eslint-disable no-unused-vars */
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
import { ProjectContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../api'
import ModalHeader from '../../../../@core/components/modal-header'
import Select, { components } from 'react-select' // eslint-disable-line
import { selectThemeColors } from '@utils'
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  class_id: 0,
  team_id: 0,
  project_id: 0
}
const socket = getSocket()
const ModalEditComponent = () => {
  const {
    handleModalEdit,
    handleModal,
    handleLoadTable,
    //setDataItem,
    openModalEdit,
    dataItem,
    typeModal
  } = useContext(ProjectContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataProject, setDataProject] = useState([])

  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const fetchDataClass = () => {
    api.projectApi.getAllProjectApi({ keyword: '', page: 1 }, campus, semester)
      .then((rs) => {
        // setDataProject(rs)
        setDataProject(rs && rs ? rs.map(item => {
          const value = item.project_id
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
    if (typeModal === "EditTeamProject") {
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

  const onSubmit = data => {
    if (typeModal === "EditTeamProject") {
      api.teamProjectApi.updateTeamProjectApi({ project_id: data.project_id }, campus, semester, data.teamproject_id).then((rs) => {
        handleLoadTable()
        handleModalEdit()
        notificationSuccess(t('Edit Team Project Success'))
        socket.emit('notifications')
      }).catch((e) => {
        if (e.response.data.statusCode === 404) {
          notificationError(t(`${e.response.data.error}`))
        } else {
          notificationError(t('Asign project fail'))
        }
      }
      )
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModalEdit()
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
        isOpen={openModalEdit && typeModal === 'EditTeamProject'}
        toggle={handleModalEdit}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Edit Team Project'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col className='mb-1' md='12' sm='12'>
                  <Label className='form-label'>Selected Project</Label>
                  <Controller
                    name='project_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id='project_id'
                        value={dataProject.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value)
                        }}
                        placeholder={t('Select project')}
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={''}
                        options={dataProject}
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

export default ModalEditComponent
