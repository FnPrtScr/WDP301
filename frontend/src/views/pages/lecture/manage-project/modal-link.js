/* eslint-disable no-unused-vars */
import { Fragment, useContext, useState, useEffect } from 'react'
import {
  Row,
  Col,
  Modal,
  Label,
  Input,
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
import { notificationError, notificationSuccess } from '../../../../utility/notification'
import { getSocket } from '../../../../serviceWorker'
const defaultValues = {
  class_id: 0,
  project_id: 0
}

const ModalLinkComponent = () => {
  const {
    handleModalLink,
    handleModal,
    handleLoadTable,
    //setDataItem,
    openModalLink,
    dataItem,
    typeModal
  } = useContext(ProjectContext)
  const { t } = useTranslation()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const socket = getSocket()
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


  const handleFormOpened = () => {
    if (typeModal === "LinkTeamProject") {
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
  const onSubmit = data => {
    if (typeModal === "LinkTeamProject") {
      // if (validate(data)) {
      api.teamProjectApi.AddLinkAndTechApi(data, campus, semester).then((rs) => {
        if (rs.statusCode === 201) {
          handleLoadTable()
          handleModalLink()
          notificationSuccess(t('Asign project success'))
          socket.emit('notifications')
        }
      }).catch((e) => {
        if (e.response.data.statusCode === 500) {
          notificationError(t('This team has been working on another project'))
        } else {
          notificationError(t('Asign project fail'))
        }
      }
      )
      // }
    }
  }

  const handleCancel = () => {
    handleModalClosed()
    handleModalLink()
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
        isOpen={openModalLink && typeModal === 'LinkTeamProject'}
        toggle={handleModalLink}
        onClosed={handleModalClosed}
        onOpened={handleFormOpened}
        backdrop='static'
        className='modal-dialog-centered modal-lg'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={'Add Link and Technical'} />
          <ModalBody>
            <div className='border p-1 mb-2'>
              <Row className='gy-1'>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Technical')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='technical'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='technical' placeholder={t('Enter Technical')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Link Gitlab')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='link_gitlab'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='link_gitlab' placeholder={t('Enter Link Gitlab')} invalid={errors.name && true} />
                    )}
                  />
                  {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className='form-label' for='name'>
                    {t('Link Jira')} <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    name='link_jira'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id='link_jira' placeholder={t('Enter Link Jira')} invalid={errors.name && true} />
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

export default ModalLinkComponent
