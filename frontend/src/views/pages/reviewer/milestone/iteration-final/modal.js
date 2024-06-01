import React, { Fragment, useContext, useRef, useState, useEffect } from 'react'
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
import { Form as FormAntd, Input, Popconfirm, Table, InputNumber } from "antd" // Thêm TextArea vào imports
import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/react-select/_react-select.scss'
import { UserContext } from './useContext'
import { useTranslation } from 'react-i18next'
import api from '../../../../../api'
import ModalHeader from '../../../../../@core/components/modal-header'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
import Select, { components } from 'react-select' // eslint-disable-line
import * as Utils from '@utils'
/*eslint-disable */
import { getSocket } from '../../../../../serviceWorker'
const defaultValues = {
  type: 0
}
const { TextArea } = Input
const EditableContext = React.createContext(null)
// eslint-disable-next-line no-unused-vars
const EditableRow = ({ index, ...props }) => {
  const [form] = FormAntd.useForm()
  return (
    <FormAntd form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </FormAntd>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(children)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  }
  const handleChange = (value) => {
    setInputValue(value) // Cập nhật giá trị của input khi có thay đổi
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values
      })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children
  if (editable && record.classCode !== "TOTAL") {
    // Thêm điều kiện kiểm tra hàng có phải là "Total" không
    childNode = editing ? (
      <FormAntd.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            // Loại bỏ quy tắc required khi dataIndex là "comments"
            required: dataIndex !== "comments",
            message: `required.`
          }
        ]}
      >
        {dataIndex === "comments" ? ( // Kiểm tra nếu là cột "comments"
          <TextArea
            ref={inputRef}
            autoSize={{ minRows: 2, maxRows: 6 }}
            onBlur={save}
            showCount
            maxLength={100}
            value={inputValue} // Sử dụng giá trị của state thay vì defaultValue
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <InputNumber
            min={0}
            max={10}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            value={inputValue} // Sử dụng giá trị của state thay vì defaultValue
            onChange={handleChange}
          />
        )}
      </FormAntd.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {dataIndex === "comments" ? (
          !editing ? (
            <TextArea
              ref={inputRef}
              showCount
              maxLength={100}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onBlur={save}
              value={inputValue}
            />
          ) : (
            <div
              className="editable-cell-textarea"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {inputValue}
            </div>
          )
        ) : (
          <InputNumber
            min={0}
            max={10}
            value={inputValue}
          />
        )}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const ModalComponent = () => {
  const {
    openModal,
    handleModal,
    handleLoadTable,
    setDataItem,
    dataItem,
    windowSize,
    typeModal } = useContext(UserContext)
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    //watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange' })
  const { t } = useTranslation()
  const socket = getSocket()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [type, setType] = useState(0)
  const optionTypeGrade = [
    { value: 0, label: 'Group' },
    { value: 1, label: 'Individual' }
  ]
  const initialDataSource = [
    {
      key: "0",
      classCode: "Project Introduction",
      weight: "10%"
    },
    {
      key: "1",
      classCode: "Software Requirement",
      weight: "20%"
    },
    {
      key: "2",
      classCode: "Software Design",
      weight: "20%"
    },
    {
      key: "3",
      classCode: "Implementation",
      weight: "40%"
    },
    {
      key: "4",
      classCode: "Question And Answer",
      weight: "10%"
    },
    {
      key: "5",
      classCode: "TOTAL",
      weight: "100%"
    }
  ]
  const [dataSource, setDataSource] = useState(initialDataSource)
  const defaultColumns = [
    {
      title: "Into Scoring Criteria",
      dataIndex: "classCode",
      key: "classCode",
      width: 200,
      minWidth: 100,
      maxWidth: 200
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      minWidth: 50,
      maxWidth: 100
    },
    ...(type === 0 ? [
      {
        title: "Group mark",
        dataIndex: "groupMark",
        key: "groupMark",
        width: 70,
        editable: true
      }
    ] : []
    ),
    ...(type === 1 && dataItem?.dataTeamMember ? dataItem?.dataTeamMember.map((member, index) => ({
      title: dataItem?.dataTeamMember.length !== 0 ? (member.status ? member.label : <span style={{ color: 'red' }}>{member.label} (This student is not allowed to present)</span>) : `Student Name${index} mark /10`,
      dataIndex: `studentMarks${index}`,
      key: `studentMarks${member.value}`,
      width: 150,
      minWidth: 50,
      maxWidth: 200,
      editable: true
    })) : []
    ),
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 200,
      editable: true
    }
  ]

  const handleSave = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    const totalRow = newData.find((item) => item.classCode === "TOTAL")
    if (totalRow) {
      // eslint-disable-next-line prefer-const
      const lengthStudent = dataItem?.dataTeamMember.length
      // eslint-disable-next-line prefer-const
      let totalStudentMarks = Array.from({ length: lengthStudent }, () => 0)
      let totalGroupMark = 0
      let totalWeight = 0
      newData.forEach((item) => {
        if (item.classCode !== "TOTAL") {
          dataItem?.dataTeamMember.map((member, index) => {
            totalStudentMarks[index] +=
              (parseFloat(item[`studentMarks${index}`]) || 0) *
              parseFloat(item.weight)
          })
          totalGroupMark +=
            (parseFloat(item.groupMark) || 0) * parseFloat(item.weight) // Tính tổng điểm của các nhóm
          totalWeight += parseFloat(item.weight)
        }
      })

      // Cập nhật điểm cho sinh viên vào hàng "Total"
      dataItem?.dataTeamMember.map((member, index) => {
        const studentMarks = totalStudentMarks[index]
        totalRow[`studentMarks${index}`] = (studentMarks / totalWeight).toFixed(2)
      })

      // Cập nhật điểm cho nhóm vào hàng "Total"
      totalRow.groupMark = (totalGroupMark / totalWeight).toFixed(2)
    }
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }
  const columns = defaultColumns.map((col, columnIndex) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave
      }),
      render: (text, record, index) => {
        if (record.classCode === "TOTAL" && index === dataSource.length - 1 && columnIndex === defaultColumns.length - 1) {
          return {}
        }
        if (record.classCode === "TOTAL") {
          const totalMark = parseFloat(text)
          const color = totalMark < 5 ? "red" : "green"
          let status = ""
          totalMark < 5 ? status = "Not Pass" : status = "Passed"
          return {
            props: {
              style: { color }
            },
            children: (
              <div>
                {text} <span>({status})</span>
              </div>
            )
          }
        }
        return text
      }
    }
  })


  const datasStudent = []
  if (dataItem?.dataTeamMember) {
    dataItem?.dataTeamMember.map((member, index) => {
      const student_id = `studentMarks${String(index)}`
      const student_data = { student_id: member.value }
      dataSource.slice(0, -1).forEach(item => {
        const class_code = item.classCode.toLowerCase().replace(/\s+/g, '_')
        student_data[class_code] = parseFloat(item[student_id] || 0)
      })
      const total_marks = parseFloat(dataSource[dataSource.length - 1][student_id] || 0)
      student_data.total = total_marks
      student_data.status = member.status
      datasStudent.push(student_data)
    })
  }
  const groupMark = {
    project_introduction: 0,
    software_requirement: 0,
    software_design: 0,
    implementation: 0,
    question_and_answer: 0,
    total: 0
  }
  const comments = {
    project_introduction: null,
    software_requirement: null,
    software_design: null,
    implementation: null,
    question_and_answer: null
  }
  dataSource.slice(0, -1).forEach(item => {
    const class_code = item.classCode.toLowerCase().replace(/\s+/g, '_')
    groupMark[class_code] = parseFloat(item.groupMark ? item.groupMark : 0)
    comments[class_code] = item.comments ? item.comments : null
  })
  groupMark.total = parseFloat(dataSource[dataSource.length - 1].groupMark)

  const handleFormOpened = () => {
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
    setDataSource(initialDataSource);
  }
  //const validate = (data) => {
  //  let flag = true
  //  if (data.name.length === 0) {
  //    setError('name', {
  //      message: `${t('Please enter a valid')} ${t('Class Name')}`
  //    })
  //    flag = false
  //  }
  //  return flag
  //}

  const onSubmit = data => {
    if (typeModal === "Edit") {
      if (validate(data)) {
        // Tìm các phần tử mới được thêm vào
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
      api.finalEvaluationApi.gradeFinalApi(type === 0 ? { group_marks: groupMark, comments } : { datasStudents: datasStudent, comments }, campus, semester, dataItem.milestoneId, dataItem.classId, dataItem.teamId)
        .then(() => {
          handleLoadTable()
          handleModal()
          notificationSuccess(t('Grade success'))
          socket.emit('notifications')
        })
        .catch((e) => {
          if (e.response.data.statusCode === 400) {
            notificationError(e.response.data.error)
          } else if (e.response.data.statusCode === 404) {
            notificationError(e.response.data.error)
          } else {
            notificationError(t('Grade iteration final fail'))
          }
        })
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
        className='modal-dialog-centered modal-xl'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader typeModal={typeModal} handleModal={handleCancel} title={typeModal === 'Add' ? 'Grade final evaluation' : 'Edit final evaluation'} />
          <ModalBody>
            <Row>
              <Col xl={12} lg={12} md={12}>
                <div className='border p-1 mb-2' style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                  <div className='invoice-list-table-header w-100 me-1 ms-50 my-1 mb-75 d-flex justify-content-between flex-wrap px-1'>
                    < div className='d-flex align-items-centerm mx-50'>
                      <div className='d-flex align-items-center mx-50'>
                        <Col className='mb-1 d-flex me-1' md='12' sm='12'>
                          <Label className='form-label' style={{ fontSize: '14px', marginRight: '20px', display: 'flex', alignItems: 'center' }}>Selected type grade</Label>
                          <Controller
                            name='type'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Select
                                id='type'
                                value={optionTypeGrade.find((val) => val.value === value)}
                                onChange={(e) => {
                                  onChange(e.value)
                                  setType(e.value)
                                }}
                                theme={Utils}
                                className='react-select select-type-grade'
                                classNamePrefix='select'
                                options={optionTypeGrade}
                                isClearable={false}
                                styles={{
                                  control: (baseStyles) => ({
                                    ...baseStyles,
                                    width: '135px'
                                  })
                                }}

                              />
                            )}
                          />
                          {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

                        </Col>
                      </div>
                    </div>
                  </div >
                </div>
              </Col>
            </Row>
            <Table
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              scroll={{
                x: 'max-content',
                y: windowSize.innerHeight - 280
              }}
            />
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
