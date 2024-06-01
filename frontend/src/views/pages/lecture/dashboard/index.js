import { useTranslation } from 'react-i18next'
import { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { UserContext } from './useContext'
import Table from './table'

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
        <title>{t('Statistic Management')} </title>
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

        {/*<ModalDetailComponent />
        <ModalComponent />*/}
        <Table />
      </UserContext.Provider>
    </Fragment>
  )
}

export default HeadOfDepartmantPage