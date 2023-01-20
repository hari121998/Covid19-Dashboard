import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-route-container">
    <img
      src="https://res.cloudinary.com/dnddnchcm/image/upload/v1672908837/coviderror_eiaox1.png"
      alt="not-found-pic"
    />
    <h1>PAGE NOT FOUND</h1>
    <p>
      we are sorry, the page you requested could not be found
      <br />
      Please go back to the homepage
    </p>
    <Link to="/">
      <button type="button">Home</button>
    </Link>
  </div>
)

export default NotFound
