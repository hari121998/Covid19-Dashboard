import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class Header extends Component {
  state = {closeBtn: false}

  onClickNavBtn = () => {
    this.setState(prevState => ({closeBtn: !prevState.closeBtn}))
  }

  onClickCloseBtn = () => {
    this.setState({closeBtn: false})
  }

  renderPopupContainer = () => (
    <div className="popup-modal-container">
      <ul>
        <Link to="/" className="nav-link-popup-con">
          <li>Home</li>
        </Link>
        <Link to="/about" className="nav-link-popup-con">
          <li>About</li>
        </Link>
      </ul>
      <button
        className="trigger-button"
        type="button"
        onClick={this.onClickCloseBtn}
      >
        <img
          src="https://res.cloudinary.com/dnddnchcm/image/upload/v1674102787/close-icon_jeodi0.png"
          alt="close icon"
        />
      </button>
    </div>
  )

  render() {
    const {activePage} = this.props
    const {closeBtn} = this.state
    const activeHome = activePage === 'home' ? 'active-home' : ''
    const activeAbout = activePage === 'about' ? 'active-about' : ''

    return (
      <>
        <nav className="header-container">
          <Link to="/" className="header-link">
            <h1 className="header-heading">
              COVID19<span>INDIA</span>
            </h1>
          </Link>
          <ul>
            <li>
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
          <button
            type="button"
            onClick={this.onClickNavBtn}
            className="trigger-button nav-menu-icon"
          >
            <img
              src="https://res.cloudinary.com/dnddnchcm/image/upload/v1674102339/nav-link-icon_vnodif.png"
              alt="nav menu icon"
            />
          </button>
        </nav>
        {closeBtn && this.renderPopupContainer()}
      </>
    )
  }
}
export default Header
