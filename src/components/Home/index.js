import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import StatesList from '../StatesData'
import Header from '../Header'
import Footer from '../Footer'
import SearchResultItem from '../SearchResultItem'
import StateTableItem from '../StateTableItem'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const homePage = {
  success: 'SUCCESS',
  progress: 'PROGRESS',
}

class Home extends Component {
  state = {
    status: homePage.progress,
    searchValue: '',
    displaySearchResults: false,
    countryCasesData: [],
    totalCases: {},
  }

  componentDidMount() {
    this.getCountryWideCases()
  }

  getCountryWideCases = async () => {
    const stateUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(stateUrl)
    let totalConfirmed = 0
    let totalDeceased = 0
    let totalRecovered = 0

    if (response.ok) {
      const covidStateData = await response.json()
      const keyNames = Object.keys(covidStateData)
      const covidList = []
      keyNames.forEach(keyName => {
        if (covidStateData[keyName]) {
          const {total, meta} = covidStateData[keyName]
          const confirmed = total.confirmed ? total.confirmed : 0
          const deceased = total.deceased ? total.deceased : 0
          const recovered = total.recovered ? total.recovered : 0
          const population = meta.population ? meta.population : 0
          const nameStatus = StatesList.find(
            state => state.state_code === keyName,
          )

          if (nameStatus !== undefined) {
            totalConfirmed += confirmed
            totalRecovered += recovered
            totalDeceased += deceased
            covidList.push({
              confirmed,
              active: confirmed - (recovered + deceased),
              deceased,
              recovered,
              name: nameStatus.state_name,
              population,
              stateCode: keyName,
            })
          }
        }
      })
      this.setState({
        status: homePage.success,
        countryCasesData: covidList,
        totalCases: {
          totalConfirmed,
          totalDeceased,
          totalRecovered,
          totalActive: totalConfirmed - (totalDeceased + totalRecovered),
        },
      })
    }
  }

  ascendingSort = () => {
    const {countryCasesData} = this.state
    const ascendingSort = countryCasesData.sort((a, b) =>
      a.name < b.name ? -1 : 1,
    )
    this.setState({countryCasesData: ascendingSort})
  }

  descendingSort = () => {
    const {countryCasesData} = this.state
    const ascendingSort = countryCasesData.sort((a, b) =>
      a.name > b.name ? -1 : 1,
    )
    this.setState({countryCasesData: ascendingSort})
  }

  //   onBlurSearchValue = () => {
  //     this.setState({displaySearchResults: false})
  //   }

  onChangeSearchValue = event => {
    if (event.target.value === '') {
      this.setState({
        displaySearchResults: false,
        searchValue: event.target.value,
      })
    } else {
      this.setState({
        searchValue: event.target.value,
        displaySearchResults: true,
      })
    }
  }

  renderStateSearchResults = () => {
    const {searchValue} = this.state
    const filterSearchResults = StatesList.filter(eachState =>
      eachState.state_name.toLowerCase().includes(searchValue.toLowerCase()),
    )

    return (
      <ul
        testid="searchResultsUnorderedList"
        className="search-result-list-container"
      >
        {filterSearchResults.map(eachState => (
          <SearchResultItem key={eachState.state_code} stateItem={eachState} />
        ))}
      </ul>
    )
  }

  renderCountryCovidResults = () => {
    const {countryCasesData, totalCases} = this.state
    const {
      totalConfirmed,
      totalActive,
      totalRecovered,
      totalDeceased,
    } = totalCases
    return (
      <>
        <div className="country-wide-cases-con">
          <div
            testid="countryWideConfirmedCases"
            className="country-wide-confirmed-cases home-covid-cases"
          >
            <p className="home-stat-heading">Confirmed</p>
            <img
              src="https://res.cloudinary.com/dnddnchcm/image/upload/v1673075705/check-mark_1_lxucvn.png"
              alt="country wide confirmed cases pic"
            />
            <p>{totalConfirmed}</p>
          </div>
          <div
            testid="countryWideActiveCases"
            className="country-wide-active-cases home-covid-cases"
          >
            <p className="home-stat-heading">Active</p>
            <img
              src="https://res.cloudinary.com/dnddnchcm/image/upload/v1673075705/protection_1_etorhj.png"
              alt="country wide active cases pic"
            />
            <p>{totalActive}</p>
          </div>
          <div
            testid="countryWideRecoveredCases"
            className="country-wide-recovered-cases home-covid-cases"
          >
            <p className="home-stat-heading">Recovered</p>
            <img
              src="https://res.cloudinary.com/dnddnchcm/image/upload/v1673075705/recovered_1_ovzx0p.png"
              alt="country wide recovered cases pic"
            />
            <p>{totalRecovered}</p>
          </div>
          <div
            testid="countryWideDeceasedCases"
            className="country-wide-deceased-cases home-covid-cases"
          >
            <p className="home-stat-heading">Deceased</p>
            <img
              src="https://res.cloudinary.com/dnddnchcm/image/upload/v1673075705/breathing_1_v6kzbi.png"
              alt="country wide deceased cases pic"
            />
            <p>{totalDeceased}</p>
          </div>
        </div>
        <div className="state-list-table-con">
          <div
            testid="stateWiseCovidDataTable"
            className="state-wise-covid-data-table-con"
          >
            <div className="state-wise-table-header">
              <div className="table-state-con">
                <h3>States/UT</h3>
                <button
                  testid="ascendingSort"
                  type="button"
                  onClick={this.ascendingSort}
                >
                  <FcGenericSortingAsc className="state-wise-table-icon" />
                </button>
                <button
                  testid="descendingSort"
                  type="button"
                  onClick={this.descendingSort}
                >
                  <FcGenericSortingDesc className="state-wise-table-icon" />
                </button>
              </div>
              <p>Confirmed</p>
              <p>Active</p>
              <p>Recovered</p>
              <p>Deceased</p>
              <p>Population</p>
            </div>
            <ul className="state-wise-table-list">
              {countryCasesData.map(eachItem => (
                <StateTableItem
                  stateTableItem={eachItem}
                  key={eachItem.stateCode}
                />
              ))}
            </ul>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  renderNationalPage = () => {
    const {searchValue, displaySearchResults} = this.state
    return (
      <div className="home-page-container">
        <div className="home-search-input-container">
          <form className="form-input-container">
            <button type="button">
              <BsSearch className="search-icon" />
            </button>
            <input
              onBlur={this.onBlurSearchValue}
              onChange={this.onChangeSearchValue}
              type="search"
              placeholder="Enter the State"
              value={searchValue}
            />
          </form>
          {displaySearchResults && this.renderStateSearchResults()}
        </div>
        {!displaySearchResults && this.renderHomeSwitchPage()}
      </div>
    )
  }

  renderLoader = () => (
    <div testid="homeRouteLoader" className="loader-container home-loader">
      <Loader color="#007BFF" type="TailSpin" height="50" width="50" />
    </div>
  )

  renderHomeSwitchPage = () => {
    const {status} = this.state
    switch (status) {
      case homePage.progress:
        return this.renderLoader()
      case homePage.success:
        return this.renderCountryCovidResults()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header activePage="home" />
        {this.renderNationalPage()}
      </>
    )
  }
}
export default Home
