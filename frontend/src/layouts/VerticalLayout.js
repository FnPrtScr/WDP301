// ** React Imports
import { Outlet } from 'react-router-dom'
//import { getSelectedRole } from '../utility/Utils'
import { useState, useEffect } from 'react'
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {
  const role = window.localStorage.getItem('role')
  const [menuData, setMenuData] = useState([])
  useEffect(() => {
    switch (role) {
      case '1':
        setMenuData(navigation.filter(item => item.id >= 1 && item.id <= 6))
        break
      case '2':
        setMenuData(navigation.filter(item => item.id >= 7 && item.id <= 14))
        break
      case '3':
        setMenuData(navigation.filter(item => item.id >= 15 && item.id <= 17))
        break
      case '4':
        setMenuData(navigation.filter(item => item.id >= 18 && item.id <= 26))
        break
      default:
        // Mặc định, nếu không có vai trò nào khớp
        setMenuData([])
        break
    }
  }, [role])
  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
