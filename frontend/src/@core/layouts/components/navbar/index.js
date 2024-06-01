// ** React Imports
import { Fragment } from 'react'
import ChangeRole from './ChangeRole'
// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'

const ThemeNavbar = props => {
  // ** Props
  //const { skin, setSkin, setMenuVisibility } = props
  const { skin, setSkin } = props

  return (
    <Fragment>
      {/*<div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>*/}
      <ChangeRole />
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
