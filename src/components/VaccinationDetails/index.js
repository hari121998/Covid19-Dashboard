import {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class VaccinationDetails extends Component {
  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    // const url = 'https://apis.ccbp.in/covid19-vaccination-data'
    const url = 'https://apis.ccbp.in/covid19-districts-data/2'
    // const url = 'https://apis.ccbp.in/covid19-state-ids'

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
  }

  render() {
    return (
      <div className="vaccination-container">
        <Header activePage="vaccination" />
        <div className="content-container">
          <h1>Hello,User</h1>
          <p>
            This is the Additional Route For covid 19 Route and It is Still On
            Construction
          </p>
          <p>Waiting for API URL for Vaccination Route</p>
          <p> Meanwhile You Can Check with Home Route And About Route</p>
        </div>

        <Footer />
      </div>
    )
  }
}
export default VaccinationDetails
