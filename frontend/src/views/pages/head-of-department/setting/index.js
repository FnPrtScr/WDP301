import { useTranslation } from 'react-i18next'
import { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { UserContext } from './useContext'
import ModalComponent from './modal'
import Table from './table'

const SettingPage = () => {
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [openModal, setOpenModal] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [updateCounter, setUpdateCounter] = useState(0) // Thay đổi từ loadTable sang updateCounter
  const [dataItem, setDataItem] = useState({})
  const [typeModal, setTypeModal] = useState('')
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

  const handleModal = () => {
    setOpenModal(!openModal)
  }

  const handleModalDetail = () => {
    setOpenModalDetail(!openModalDetail)
  }

  const handleLoadTable = () => {
    setUpdateCounter(prevCounter => prevCounter + 1) 
  }

  const { t } = useTranslation()
  return (
    <Fragment>
      <Helmet>
        <title>{t('Setting Management')} </title>
      </Helmet>
      <UserContext.Provider
        value={{
          openModal,
          windowSize,
          dataItem,
          setDataItem,
          typeModal,
          setTypeModal,
          updateCounter, // Thay đổi từ loadTable sang updateCounter
          handleLoadTable,
          handleModal,
          handleModalDetail,
          openModalDetail
        }}
      >
        <ModalComponent />
        <Table />
      </UserContext.Provider>
    </Fragment>
  )
}

export default SettingPage
