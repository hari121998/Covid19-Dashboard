import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import FaqItem from '../FaqItem'
import Footer from '../Footer'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const pageStatus = {
  success: 'SUCCESS',
  progress: 'PROGRESS',
}

class About extends Component {
  state = {faqsList: [], status: pageStatus.progress}

  componentDidMount() {
    this.getAboutData()
  }

  getAboutData = async () => {
    this.setState({status: pageStatus.progress})

    const url = 'https://apis.ccbp.in/covid19-faqs'
    const option = {method: 'GET'}
    const response = await fetch(url, option)
    if (response.ok) {
      const faqsData = await response.json()
      const {faq} = faqsData
      this.setState({faqsList: faq, status: pageStatus.success})
    }
  }

  renderFaqsListPage = () => {
    const {faqsList} = this.state
    return (
      <div className="about-page-container">
        <h1>About</h1>
        <p className="update-para">Last update on march 28th 2021.</p>
        <h3>COVID-19 vaccines be ready for distribution</h3>
        <ul
          // testid="faqsUnorderedList"
          className="faq-unordered-list-container"
        >
          {faqsList.map(eachFaq => (
            <FaqItem key={eachFaq.qno} faqItem={eachFaq} />
          ))}
        </ul>
        <Footer />
      </div>
    )
  }

  renderLoader = () => (
    <div
      className="loader-container"
      // testid="aboutRouteLoader"
    >
      <Loader color="#007BFF" type="TailSpin" height="50" width="50" />
    </div>
  )

  renderAboutSwitch = () => {
    const {status} = this.state
    switch (status) {
      case pageStatus.success:
        return this.renderFaqsListPage()
      case pageStatus.progress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header activePage="about" />
        {this.renderAboutSwitch()}
      </>
    )
  }
}

export default About
