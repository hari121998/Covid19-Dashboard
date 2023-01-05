import {Component} from 'react'
import Header from '../Header'
import FaqItem from '../FaqItem'
import './index.css'

class About extends Component {
  state = {faqsList: []}

  componentDidMount() {
    this.getAboutData()
  }

  getAboutData = async () => {
    const url = 'https://apis.ccbp.in/covid19-faqs'
    const option = {method: 'GET'}
    const response = await fetch(url, option)
    if (response.ok) {
      const faqsData = await response.json()
      const {faq} = faqsData
      this.setState({faqsList: faq})
    }
  }

  render() {
    const {faqsList} = this.state
    return (
      <>
        <Header activePage="about" />
        <div className="about-page-container">
          <h1>About</h1>
          <p className="update-para">Last update on march 28th 2021.</p>
          <h3>COVID-19 vaccines be ready for distribution</h3>
          <ul>
            {faqsList.map(eachFaq => (
              <FaqItem key={eachFaq.qno} faqItem={eachFaq} />
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default About
