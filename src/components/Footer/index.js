import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'

import './index.css'

export default function Footer() {
  return (
    <div className="footer-container">
      <h2 className="footer-heading">
        COVID19<span>INDIA</span>
      </h2>
      <p className="footer-para">
        we stand with everyone fighting on the front lines
      </p>
      <div className="footer-icons-container">
        <VscGithubAlt className="footer-icon" />
        <FiInstagram className="footer-icon" />
        <FaTwitter className="footer-icon" />
      </div>
    </div>
  )
}
