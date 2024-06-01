import React, { useEffect, useState } from 'react'
import '../../../styles/ChooseRole.css'
import logofpt from '../../../assets/images/logofpt.png'
import { Button, Select, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { useDispatch } from 'react-redux'
import { handleLogin, handleRole, handleSemester, handleChildrenData, handleDataProjectStudent } from '@store/authentication'
import { notificationError } from '../../../utility/notification'

const ChooseRole = () => {
    const [userdata, setUserdata] = useState({})
    const dispatch = useDispatch()
    // eslint-disable-next-line
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [showNotification, setShowNotification] = useState(false)

    const campus = window.localStorage.getItem('campus')
    const navigate = useNavigate()
    const getUser = async () => {
        await api.authApi.loginGoogleSuccessApi()
            .then((rs) => {
                setUserdata(rs)
                dispatch(handleLogin(rs))
            })
    }
    useEffect(() => {
        getUser()// eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (showNotification) {
            notification.info({
                message: 'Please select a semester and role',
                description: 'You need to select a semester and role before logging in.',
                placement: 'topRight'
            })
            setShowNotification(false)
        }
    }, [showNotification])
    const getRolesForSemester = () => {
        if (!selectedSemester) {
            return []
        }

        const semesterRoles = userdata.UserRoleSemesters.filter(
            (semesterItem) => semesterItem.Semester.semester_id === selectedSemester
        )

        // ** Function to fetch data and save to localStorage
        // ** Call fetchChildrenData on component mount
        // Empty dependency array means it will only run once on component mount
        return semesterRoles.map((roleItem) => ({
            value: roleItem.Role.role_id,
            label: roleItem.Role.name
        }))
    }

    const getUniqueSemesters = () => {
        const uniqueSemesters = new Set(userdata.UserRoleSemesters.map((semesterItem) => semesterItem.Semester.semester_id))
        return Array.from(uniqueSemesters).map((semesterId) => {
            const correspondingSemester = userdata.UserRoleSemesters.find((semesterItem) => semesterItem.Semester.semester_id === semesterId)
            return {
                value: semesterId,
                label: correspondingSemester.Semester.name
            }
        })
    }
    const handleChangeRole = async (value) => {
        try {
            if (value === 2 || value === 3) {
                const rs = await api.milestoneApi.getAllApi({}, campus, selectedSemester) // Gọi fetchData từ tệp fetchData.js
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
            } else if (value === 4) {
                const rs1 = await api.milestoneApi.getAllIterationApi({}, campus, selectedSemester) // Gọi fetchData từ tệp fetchData.js
                dispatch(handleDataProjectStudent(rs1.data))
                localStorage.setItem('dataProjectStudent', JSON.stringify(rs1.data))
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            if (error.response.status === 404) {
                notificationError(error.response.data.error)
            }
            console.error("Error fetching children data:", error)
            return [] // Trả về một mảng rỗng nếu có lỗi xảy ra
        }
        setSelectedRole(value)
    }
    const handleChangeSemester = (value) => {
        localStorage.removeItem('semester')
        localStorage.removeItem('dataProjectStudent')
        localStorage.removeItem('dataProject')
        dispatch(handleSemester(value))
        setSelectedSemester(value)
        setSelectedRole(null)
    }
    const handleContinueClick = () => {
        try {
            if (selectedRole && selectedSemester) {
                dispatch(handleRole(selectedRole))
                if (selectedRole === 1) {
                    navigate('/head-of-department/dashboard')
                } else if (selectedRole === 2) {
                    navigate('/lecture/class-manage')
                } else if (selectedRole === 3) {
                    navigate('/reviewer/iteration-final')
                } else if (selectedRole === 4) {
                    navigate('/student/project')
                }
            } else {
                setShowNotification(true)
            }
        } catch (error) {
            console.error('Error logging in with Google:', error)
        }
    }

    return (
        <div className="choose-role">
            <div className="div">
                <div className="overlap-group">
                    <Button
                        style={{ backgroundColor: '#7895ff', width: 300, color: '#fff' }}
                        size="large"
                        onClick={handleContinueClick}
                    >
                        Continue
                    </Button>
                </div>
                <div className="text-wrapper-2">SWP391 Course Management</div>
                <p className="this-is-the">This is the SWP391 project management platform, managing the team's work</p>
                <div className="overlap-semester">
                    {Object?.keys(userdata)?.length > 0 ? (
                        <Select

                            defaultValue={'--Select Semester--'}
                            style={{
                                width: 200
                            }}
                            onChange={handleChangeSemester}
                            options={getUniqueSemesters()}
                        />
                    ) : null}
                </div>
                <div className="overlap">
                    {Object?.keys(userdata)?.length > 0 ? (
                        <Select
                            value={selectedRole ? selectedRole : '--Select Role--'}
                            style={{
                                width: 200
                            }}
                            onChange={handleChangeRole}
                            options={getRolesForSemester()}
                        />
                    ) : null}
                </div>
                <img className="logo-FPT-education" alt="Logo FPT education" src={logofpt} />
            </div>
        </div>
    )
}

export default ChooseRole
