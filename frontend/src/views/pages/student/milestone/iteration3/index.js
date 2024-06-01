import { useTranslation } from 'react-i18next'
import { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { SubmitContext } from './useContext'
import Table from './table'
import ModalComponent from './modal'

const HeadOfDepartmantPage = () => {

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [openModal, setOpenModal] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [openModalFunction, setOpenModalFunction] = useState(false)
  const [loadTable, setLoadTable] = useState(false)
  const [loadTableDetail, setLoadTableDetail] = useState(false)
  const [dataItem, setDataItem] = useState({})
  const [dataDetail, setDataDetail] = useState({})
  const [typeModal, setTypeModal] = useState('')
  const [typeModalFunction, setTypeModalFunction] = useState('')

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

  const handleModalFunction = () => {
    setOpenModalFunction(!openModalFunction)
  }

  const handleLoadTable = () => {
    setLoadTable(!loadTable)
  }
  const handleLoadTableDetail = () => {
    setLoadTableDetail(!loadTableDetail)
  }

  const { t } = useTranslation()
  return (
    <Fragment>
      <Helmet>
        <title>{t('Function Requirement')} </title>
      </Helmet>
      <SubmitContext.Provider value={{
        openModal,
        windowSize,
        dataItem,
        setDataItem,
        typeModal,
        setTypeModal,
        typeModalFunction,
        setTypeModalFunction,
        loadTable,
        handleLoadTable,
        handleLoadTableDetail,
        setLoadTable,
        handleModal,
        handleModalDetail,
        handleModalFunction,
        openModalDetail,
        openModalFunction,
        dataDetail, 
        setDataDetail
      }} >

        <ModalComponent />
        <Table />
      </SubmitContext.Provider>
    </Fragment>
  )
}

export default HeadOfDepartmantPage