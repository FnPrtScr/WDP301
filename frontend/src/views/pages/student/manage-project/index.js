import { useTranslation } from 'react-i18next'
import { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { ProjectContext } from './useContext'
import ModalComponent from './modal'
import ModalAddprojectComponent from './modal-add-project'
import ModalLinkComponent from './modal-link'
import ModalDetailComponent from './modal-detail'
import TabProject from './tab-project'

const HeadOfDepartmantPage = () => {

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [openModal, setOpenModal] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [openModalAsign, setOpenModalAsign] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalLink, setOpenModalLink] = useState(false)
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
  const handleModalAsign = () => {
    setOpenModalAsign(!openModalAsign)
  }

  const handleModalEdit = () => {
    setOpenModalEdit(!openModalEdit)
  }

  const handleModalLink = () => {
    setOpenModalLink(!openModalLink)
  }

  const handleLoadTable = () => {
    setLoadTable(!loadTable)
  }

  const { t } = useTranslation()
  return (
    <Fragment>
      <Helmet>
        <title>{t('Project Management')} </title>
      </Helmet>
      <ProjectContext.Provider value={{
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
        handleModalAsign,
        handleModalEdit,
        handleModalLink,
        openModalAsign,
        openModalEdit,
        openModalLink,
        openModalDetail
      }} >
        <TabProject />
        <ModalAddprojectComponent />
        <ModalComponent />
        <ModalLinkComponent/>
        <ModalDetailComponent />
      </ProjectContext.Provider>
    </Fragment>
  )
}

export default HeadOfDepartmantPage