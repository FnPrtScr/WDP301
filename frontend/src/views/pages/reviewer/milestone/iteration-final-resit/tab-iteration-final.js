import React, { useContext, useEffect, useRef, useState } from "react"
import { Form, Input, Popconfirm, Table, InputNumber } from "antd" // Thêm TextArea vào imports
import { Button, Card, Col, Row, Label } from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import Select, { components } from 'react-select' // eslint-disable-line
import { useTranslation } from 'react-i18next'
import * as Utils from '@utils'
import api from '../../../../../api'
import { notificationError, notificationSuccess } from '../../../../../utility/notification'
/*eslint-disable */
import { getSocket } from '../../../../../serviceWorker'
const { TextArea } = Input
const EditableContext = React.createContext(null)
const defaultValues = {
  class_id: 0,
  team_id: 0,
  type: 0
}
// eslint-disable-next-line no-unused-vars
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
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
  const [inputValue, setInputValue] = useState(children);
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
    setInputValue(value); // Cập nhật giá trị của input khi có thay đổi
  };

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
      <Form.Item
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
      </Form.Item>
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

const App = () => {
  const { t } = useTranslation()
  const {
    control,
    //clearErrors,
    //handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange' })
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize())
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])
  const socket = getSocket()
  const campus = window.localStorage.getItem('campus')
  const semester = window.localStorage.getItem('semester')
  const [dataClass, setDataClass] = useState([])
  const [dataTeam, setDataTeam] = useState([])
  const [classId, setClassId] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [type, setType] = useState(0)
  const [dataTeamMember, setDataTeamMember] = useState([])
  const dataProject = JSON.parse(window.localStorage.getItem('dataProject'))
  const initialMilestoneId = dataProject && dataProject.length > 0 ? dataProject[3].navLink : null
  const [milestoneId, setMilestoneId] = useState(initialMilestoneId)
  useEffect(() => {
    const obj = dataProject && dataProject.length > 0 ? dataProject[3].navLink : null
    setMilestoneId(obj)
  }, [dataProject])
  const fetchDataClass = () => {
    api.projectApi.getAllReviewProjectApi({}, campus, semester, milestoneId)
      .then((rs) => {
        setDataClass(rs && rs.data ? rs.data.map(item => {
          const value = item.class_id
          const label = item.Class.name
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

  useEffect(() => {
    fetchDataClass()
  }, [])
  const getStudent = (id) => {
    api.projectApi.getAllReviewProjectApi({ filter: id }, campus, semester)
      .then((rs) => {
        const teams = rs && rs.data[0].Class.Teams
        teams.sort((a, b) => {
          // Extract the name from each team
          const nameA = a.name.toUpperCase() // ignore upper and lowercase
          const nameB = b.name.toUpperCase() // ignore upper and lowercase

          // Compare the names
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          // Names are equal
          return 0
        })
        setDataTeam(teams.map(item => {
          const value = item.team_id
          const label = item.name
          const classId = id
          const dataTeamUser = item.TeamUsers
          return {
            value,
            label,
            classId,
            dataTeamUser
          }
        }))
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    if (dataTeam && teamId) {
      setDataTeamMember(dataTeam && dataTeam.find(team => team.value === teamId).dataTeamUser.map((item, index) => ({
        key: index,
        label: item.User.email.split('@')[0],
        value: item.User.user_id
      })))
    }
  }, [dataTeam, teamId])

  const optionTypeGrade = [
    { value: 0, label: 'Group' },
    { value: 1, label: 'Individual' },
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
      title: "ClassCode / GroupName",
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
    ...(type === 0 ?
      [
        {
          title: "Group mark",
          dataIndex: "groupMark",
          key: "groupMark",
          width: 70,
          editable: true,
        }
      ] : []
    ),
    ...(type === 1 ?
      dataTeamMember.map((member, index) => ({
        title: dataTeamMember.length !== 0 ? member.label : `Student Name${index} mark /10`,
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
      const lengthStudent = dataTeamMember.length;
      let totalStudentMarks = Array.from({ length: lengthStudent }, () => 0);
      let totalGroupMark = 0
      let totalWeight = 0
      newData.forEach((item) => {
        if (item.classCode !== "TOTAL") {
          dataTeamMember.map((member, index) => {
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
      dataTeamMember.map((member, index) => {
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
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
      render: (text, record, index) => {
        if (record.classCode === "TOTAL" && index === dataSource.length - 1 && columnIndex === defaultColumns.length - 1) {
          return {};
        }
        if (record.classCode === "TOTAL") {
          const totalMark = parseFloat(text);
          const color = totalMark < 4 ? "red" : "green";
          let status = "";
          totalMark < 4 ? status = "Not Pass" : status = "Passed";
          return {
            props: {
              style: { color },
            },
            children: (
              <div>
                {text} <span>({status})</span>
              </div>
            ),
          };
        }
        return text;
      },
    };
  });


  const datasStudent = [];
  dataTeamMember.map((member, index) => {
    const student_id = "studentMarks" + String(index);
    const student_data = { "student_id": member.value };
    dataSource.slice(0, -1).forEach(item => {
      const class_code = item.classCode.toLowerCase().replace(/\s+/g, '_');
      student_data[class_code] = parseFloat(item[student_id] || 0);
    });
    const total_marks = parseFloat(dataSource[dataSource.length - 1][student_id] || 0);
    student_data.total = total_marks;
    datasStudent.push(student_data);
  })

  const groupMark = {
    "project_introduction": 0,
    "software_requirement": 0,
    "software_design": 0,
    "implementation": 0,
    "question_and_answer": 0,
    "total": 0
  };
  const comments = {
    "project_introduction": null,
    "software_requirement": null,
    "software_design": null,
    "implementation": null,
    "question_and_answer": null,
  }
  dataSource.slice(0, -1).forEach(item => {
    const class_code = item.classCode.toLowerCase().replace(/\s+/g, '_');
    groupMark[class_code] = parseFloat(item.groupMark ? item.groupMark : 0);
    comments[class_code] = item.comments ? item.comments : null;
  });
  groupMark.total = parseFloat(dataSource[dataSource.length - 1].groupMark);

  const handleGrade = () => {
    api.finalEvaluationApi.gradeFinalApi(type === 0 ? { "group_marks": groupMark, "comments": comments } : { "datasStudents": datasStudent, "comments": comments }, campus, semester, milestoneId, classId, teamId)
      .then(() => {
        socket.emit('notifications')
        notificationSuccess(t('Grade success'))
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

  return (
    <div>
      <h2 style={{ fontWeight: '700' }} className='mt-2'>{t('Final Project Presentation Evaluation')}</h2>

      <div className='react-dataTabs mt-2'>
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
                      onChange(e.value)
                      getStudent(e.value)
                      setValue('team_id', undefined)
                      setClassId(e.value)
                      setDataTeam([])
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
              {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

            </Col>
            <Col className='mb-1' md='12' sm='12'>
              <Label className='form-label'>Selected Team</Label>
              <Controller
                name='team_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    id='team_id'
                    value={dataTeam.find((val) => val.value === value) ?? ''}
                    onChange={(e) => {
                      onChange(e.value)
                      setTeamId(e.value)
                      setDataTeamMember([])
                      setDataSource(initialDataSource)
                    }}
                    placeholder={t('Select team')}
                    theme={Utils}
                    className='react-select'
                    classNamePrefix='select'
                    options={dataTeam}
                    isClearable={false}
                  />
                )}
              />
              {errors.team_id && <FormFeedback>{errors.team_id.message}</FormFeedback>}

            </Col>
          </Row>
        </div>
      </div>
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
                            }),
                          }}

                        />
                      )}
                    />
                    {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

                  </Col>
                </div>
              </div>
              <div className='d-flex justify-content-end mx-2'>
                <Button className='add-new-user mx-25 my-25' color='primary' onClick={handleGrade}>
                  {t('Grade Iteration Final')}
                </Button>
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
    </div >
  )
}
export default App
