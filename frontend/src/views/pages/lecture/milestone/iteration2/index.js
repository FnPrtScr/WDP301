import { useTranslation } from 'react-i18next'
import { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { UserContext } from './useContext'
import TabIteration1 from './tab-iteration-1'
import ModalDeadlineComponent from './modal-deadline'
import ModalSettingComponent from './modal-setting'
import ModalGradeComponent from './modal-grade'
import ModalGradeDocumentComponent from './modal-grade-document'
import ModalPointFinal from './modal-point-final'

const HeadOfDepartmantPage = () => {

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [openModal, setOpenModal] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [loadTable, setLoadTable] = useState(false)
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
    setLoadTable(!loadTable)
  }

  const { t } = useTranslation()
  return (
    <Fragment>
      <Helmet>
        <title>{t('Lecture Management')} </title>
      </Helmet>
      <UserContext.Provider value={{
        openModal,
        windowSize,
        dataItem,
        setDataItem,
        typeModal,
        setTypeModal,
        loadTable,
        handleLoadTable,
        setLoadTable,
        handleModal,
        handleModalDetail,
        openModalDetail
      }} >
        <ModalDeadlineComponent />
        <TabIteration1 />
        <ModalSettingComponent />
        <ModalGradeComponent />
        <ModalGradeDocumentComponent />
        <ModalPointFinal />
      </UserContext.Provider>
    </Fragment>
  )
}

export default HeadOfDepartmantPage