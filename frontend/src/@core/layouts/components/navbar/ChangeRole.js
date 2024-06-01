import React, { useState } from 'react'
import '@styles/react/libs/react-select/_react-select.scss'
import Select from 'react-select'
import { getUserData, getSelectedRole, getSelectedSemester } from '../../../../utility/Utils'
import { useDispatch } from 'react-redux'
import { handleRole, handleSemester, handleChildrenData, handleDataProjectStudent } from '@store/authentication'
import { Col, Row } from 'reactstrap'
import api from '../../../../api'

const ChangeRole = () => {
  const dispatch = useDispatch()
  const userData = getUserData()
  const semester = getSelectedSemester()
  const campus = window.localStorage.getItem('campus')
  const role = getSelectedRole()
  const [reloadPage, setReloadPage] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState(semester)
  const getUniqueSemesters = () => {
    const uniqueSemesters = new Set(userData.UserRoleSemesters.map((semesterItem) => semesterItem.Semester.semester_id))
    return Array.from(uniqueSemesters).map((semesterId) => {
      const correspondingSemester = userData.UserRoleSemesters.find((semesterItem) => semesterItem.Semester.semester_id === semesterId)
      return {
        value: semesterId,
        label: correspondingSemester.Semester.name,
        semester_Id: semesterId // Lưu semester ID vào mỗi option
      }
    })
  }
  const getRolesForSemester = () => {
    const semesterId = selectedSemester.value === undefined ? selectedSemester : selectedSemester.value
    const semesterRoles = userData.UserRoleSemesters.filter(
      (semesterItem) => semesterItem.Semester.semester_id === parseInt(semesterId)
    )
    return semesterRoles.map((roleItem) => ({
      value: roleItem.Role.role_id,
      label: roleItem.Role.name,
      roleId: roleItem.Role.role_id // Lưu role ID vào mỗi option
    }))

  }

  const handleChangeSemester = (value) => {
    localStorage.removeItem('dataProjectStudent')
    localStorage.removeItem('dataProject')
    localStorage.removeItem('semester')
    dispatch(handleSemester(value.value))
    setSelectedSemester(value.value)
  }

  const handleChangeRole = async (selectedOption) => {

    const semesterId = selectedSemester.value === undefined ? selectedSemester : selectedSemester.value
    try {
      if (selectedOption.value === 2 || selectedOption.value === 3) {
        const rs = await api.milestoneApi.getAllApi({}, campus, semesterId) // Gọi fetchData từ tệp fetchData.js
        if (rs.data && rs.data.length > 0) {
          const formattedData = rs.data?.map((item, index) => ({
            id: (index + 10).toString(),
            title: item.name,
            icon: `icon`,
            navLink: `${item.milestone_id}`
          }))
          // Lưu data vào localStorage
          dispatch(handleChildrenData(formattedData))
          localStorage.setItem('dataProject', JSON.stringify(formattedData))
        }
      } else if (selectedOption.value === 4) {
        const rs1 = await api.milestoneApi.getAllIterationApi({}, campus, selectedSemester) // Gọi fetchData từ tệp fetchData.js
        dispatch(handleDataProjectStudent(rs1.data))
        localStorage.setItem('dataProjectStudent', JSON.stringify(rs1.data))
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error fetching children data:", error)
      return [] // Trả về một mảng rỗng nếu có lỗi xảy ra
    }

    dispatch(handleRole(selectedOption.value)) // Dispatch role ID thay vì chỉ số
    setReloadPage(true)
    //localStorage.removeItem('dataProject')
  }

  if (reloadPage) {
    let newUrl = ''
    if (parseInt(role) === 1) {
      newUrl = `${window.location.origin}/head-of-department/dashboard`
    } else if (parseInt(role) === 2) {
      newUrl = `${window.location.origin}/lecture/class-manage`
    } else if (parseInt(role) === 3) {
      newUrl = `${window.location.origin}/reviewer/iteration-final`
    } else if (parseInt(role) === 4) {
      newUrl = `${window.location.origin}/student/project`
    }
    window.history.pushState({ path: newUrl }, '', newUrl)
    window.location.reload()
  }

  return (
    <div className="col-md-5 ms-auto">
      <Row>
        <Col xl={6} lg={12} md={12}>
          {Object?.keys(userData)?.length > 0 ? (
            <Select
              value={getUniqueSemesters().find(option => option.semester_Id === parseInt(semester))}
              style={{
                width: 200
              }}
              onChange={handleChangeSemester}
              options={getUniqueSemesters()}
            />
          ) : null}
        </Col>
        <Col xl={6} lg={12} md={12}>
          {Object?.keys(userData)?.length > 0 ? (
            <Select
              value={getRolesForSemester().find(option => option.roleId === parseInt(role))}
              onChange={handleChangeRole}
              options={getRolesForSemester()}
            />
          ) : null}
        </Col>
      </Row>
    </div>
  )
}

export default ChangeRole