import {Link} from 'react-router-dom'
import './index.css'

const Header = props => {
  const {activePage} = props
  const activeHome = activePage === 'home' ? 'active-home' : ''
  const activeAbout = activePage === 'about' ? 'active-about' : ''

  return (
    <div className="header-container">
      <Link to="/" className="header-link">
        <h1 className="header-heading">
          COVID19<span>INDIA</span>
        </h1>
      </Link>
      <ul>
        <li className="home-item-link">
          <Link to="/" className={`header-nav-link ${activeHome}`}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={`header-nav-link ${activeAbout}`}>
            About
          </Link>
        </li>
      </ul>
    </div>
  )
}
export default Header
