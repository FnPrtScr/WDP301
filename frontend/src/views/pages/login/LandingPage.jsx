import React, { useState, useEffect } from 'react'
import { Select, Button, notification } from 'antd'
import '../../../styles/LandingPage.css'
import landingpage from '../../../assets/images/landingpage.png'
import logofpt from '../../../assets/images/logofpt.png'
import googlesvg from '../../../assets/images/flat-color-icons_google.svg'
import api from '../../../api'
import { useDispatch } from 'react-redux'
import { handleCampus } from '../../../redux/authentication'
import { PUBLIC_URL_SERVER_API } from '../../../dataConfig'

const LandingPage = () => {
    const [campus, setCampus] = useState([])
    const [selectedCampus, setSelectedCampus] = useState(null)
    const [showNotification, setShowNotification] = useState(false)
    const dispatch = useDispatch()
    const handleLoginWithGoogle = async () => {
        try {
            if (selectedCampus) {
                dispatch(handleCampus(selectedCampus))
                const authUrl = `${PUBLIC_URL_SERVER_API}/auth/google?campus=${selectedCampus}`
                window.location.href = authUrl
            } else {
                setShowNotification(true)
            }
        } catch (error) {
            console.error('Error logging in with Google:', error)
        }
    }

    const getCampus = async () => {
        //setLoading(true)
        await api.campusApi.getAllCampusApi()
            .then((rs) => {
                setCampus(rs)
            })
    }
    useEffect(() => {
        getCampus()
    }, [])
    useEffect(() => {
        if (showNotification) {
            notification.info({
                message: 'Please select a campus',
                description: 'You need to select a campus before logging in.',
                placement: 'topRight'
            })
            setShowNotification(false)
        }
    }, [showNotification])

    const handleChange = (value) => {
        setSelectedCampus(value)
    }

    return (
        <div className="landing-page">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <img
                            className="reshot-illustration"
                            alt="Reshot illustration"
                            src={landingpage}
                        />
                        <div className="text-wrapper">WDP301 Course Management</div>
                    </div>
                    <div className="div">
                        <Button
                            style={{ backgroundColor: '#fc823c', width: 300, color: '#fff' }}
                            size={'large'}
                            onClick={handleLoginWithGoogle}
                        >
                            <img src={googlesvg} alt="logogoogle" style={{ marginRight: '7px' }} />
                            Login with @fpt.edu.vn
                        </Button>
                    </div>
                    <p className="this-is-the">This is the WDP301 project management platform, managing the team work</p>
                    <div className="overlap-2">
                        <Select
                            defaultValue={'--Select Campus--'}
                            style={{ width: 200 }}
                            onChange={handleChange}
                            options={campus?.map((campusItem) => ({
                                value: campusItem.campus_id,
                                label: campusItem.name
                            }))}
                        />
                    </div>
                    <img className="logo-FPT-education" alt="Logo FPT education" src={logofpt} />
                </div>
            </div>
        </div>
    )
}

export default LandingPage
