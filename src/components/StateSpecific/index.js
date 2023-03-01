import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  LabelList,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import Header from '../Header'
import Footer from '../Footer'
import StatesList from '../StatesData'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const specificStatus = {
  success: 'SUCCESS',
  progress: 'PROGRESS',
}

const activeStats = {
  confirmed: 'CONFIRMED',
  active: 'ACTIVE',
  recovered: 'RECOVERED',
  deceased: 'DECEASED',
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

class StateSpecific extends Component {
  state = {
    stateStatus: specificStatus.progress,
    activeStat: activeStats.confirmed,
    statsData: {},
    stateTimelineData: [],
    timelineLoader: true,
  }

  componentDidMount() {
    this.getStateData()
    this.getTimelineData()
  }

  getDistrictWiseData = district => {
    const districtsKeyNames = Object.keys(district)
    const districtData = []
    districtsKeyNames.forEach(keyName => {
      const {total} = district[keyName]
      const confirmed = total.confirmed ? total.confirmed : 0
      const recovered = total.recovered ? total.recovered : 0
      const deceased = total.deceased ? total.deceased : 0
      const active = confirmed - (recovered + deceased)
      const districtStats = {
        districtName: keyName,
        confirmed,
        recovered,
        deceased,
        active,
      }

      districtData.push(districtStats)
    })

    return districtData
  }

  getTimelineData = async () => {
    this.setState({timelineLoader: true})
    const {match} = this.props
    const {stateCode} = match.params
    const timeLineUrl = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const timelineResponse = await fetch(timeLineUrl)
    const timelineData = await timelineResponse.json()
    const stateTimelineData = timelineData[stateCode]
    const dateKeyNames = Object.keys(stateTimelineData.dates)
    const dateWiseTimelineData = []
    dateKeyNames.forEach(eachDate => {
      const {total} = stateTimelineData.dates[eachDate]
      const {confirmed, recovered, tested, deceased} = total
      const active = confirmed - (recovered + deceased)
      dateWiseTimelineData.push({
        date: eachDate,
        confirmed,
        tested,
        recovered,
        deceased,
        active,
      })
    })
    this.setState({
      timelineLoader: false,
      stateTimelineData: dateWiseTimelineData,
    })
  }

  getStateData = async () => {
    const {history, match} = this.props
    const {params} = match
    const {stateCode} = params
    const stateItem = StatesList.find(
      eachItem => eachItem.state_code === stateCode,
    )

    if (stateItem) {
      const stateName = stateItem.state_name
      const stateImageUrl = stateItem.imageUrl
      const url = 'https://apis.ccbp.in/covid19-state-wise-data'
      const response = await fetch(url)
      if (response.ok) {
        const stateData = await response.json()
        const {total, meta, districts} = stateData[stateCode]

        const updatedDate = new Date(meta.last_updated)
        const getFullYear = updatedDate.getFullYear()
        const getDate = updatedDate.getDate()
        const getMonth = monthNames[updatedDate.getMonth()]
        const lastUpdatedDate = `${getMonth} ${getDate} ${getFullYear}`
        const confirmed = total.confirmed ? total.confirmed : 0
        const recovered = total.recovered ? total.recovered : 0
        const deceased = total.deceased ? total.deceased : 0
        const active = confirmed - (recovered + deceased)
        const totalCases = {
          confirmed,
          recovered,
          deceased,
          active,
        }
        const population = meta.population ? meta.population : 0
        const totalTested = total.tested ? total.tested : 0
        const districtWiseData = this.getDistrictWiseData(districts)
        const specificStateData = {
          totalCases,
          lastUpdatedDate,
          totalTested,
          districts: districtWiseData,
          stateName,
          stateImageUrl,
          statePopulation: population,
        }
        this.setState({
          statsData: specificStateData,
          stateStatus: specificStatus.success,
        })
      }
    } else {
      history.push('/not-found')
    }
  }

  renderStateSpecificLoader = () => (
    <div
      //  testid="stateDetailsLoader"
      className="loader-container"
    >
      <Loader color="#007BFF" type="TailSpin" height="50" width="50" />
    </div>
  )

  renderTimelineLoader = () => (
    <div
      // testid="timelinesDataLoader"
      className="loader-container"
    >
      <Loader color="#007BFF" type="TailSpin" height="50" width="50" />
    </div>
  )

  onClickConfirmed = () => this.setState({activeStat: activeStats.confirmed})

  onClickRecovered = () => this.setState({activeStat: activeStats.recovered})

  onClickActive = () => this.setState({activeStat: activeStats.active})

  onClickDeceased = () => this.setState({activeStat: activeStats.deceased})

  getActiveDistrictList = () => {
    const {statsData, activeStat} = this.state
    const {districts} = statsData
    const value = activeStat.toLowerCase()
    const sortedDistricts = districts.sort((a, b) =>
      a[value] > b[value] ? -1 : 1,
    )
    return sortedDistricts
  }

  renderRechartsContainer = () => {
    const {stateTimelineData, activeStat, timelineLoader} = this.state
    const topTenCovid19 = this.getTopTenCovid19()
    let barColor = ''
    switch (activeStat) {
      case activeStats.confirmed:
        barColor = '#9A0E31'
        break
      case activeStats.active:
        barColor = '#0A4FA0'
        break
      case activeStats.recovered:
        barColor = '#216837'
        break
      case activeStats.deceased:
        barColor = '#474C57'
        break

      default:
        break
    }
    if (timelineLoader) {
      return this.renderTimelineLoader()
    }
    return (
      <>
        <div className="specific-covid-bar-chart-con">
          <BarChart width={800} height={400} data={topTenCovid19}>
            <XAxis
              tick={{
                fill: `${barColor}`,
                fontFamily: 'Roboto',
                fontWeight: '500',
                fontSize: ' 16px',
              }}
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={date => {
                const newDate = new Date(date)
                const getDate = newDate.getDate()
                const getMonth = monthNames[newDate.getMonth()].slice(0, 3)
                const updatedNewDate = `${getDate} ${getMonth}`
                return updatedNewDate
              }}
            />
            <Bar
              dataKey={`${activeStat.toLowerCase()}`}
              barSize={50}
              fill={`${barColor}`}
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey={`${activeStat.toLowerCase()}`}
                position="top"
                fontWeight="500"
                fontSize="16"
                fill={`${barColor}`}
                formatter={number => {
                  if (number < 100000) {
                    return `${Math.round(number / 100) / 10} K`
                  }
                  return `${Math.round(number / 10000) / 10} L`
                }}
              />
            </Bar>
          </BarChart>
        </div>
        <div
          // testid="lineChartsContainer"
          className="line-charts-container"
        >
          <h3 className="daily-spread-heading">Daily Spread Trends</h3>
          <div className="confirmed-line-chart-con line-chart-con ">
            <LineChart
              width={800}
              height={250}
              data={stateTimelineData}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis
                dataKey="date"
                axisLine={{stroke: '#FF073A', strokeWidth: '2'}}
                minTickGap={10}
                tickLine={{stroke: '#FF073A', strokeWidth: '2'}}
                tick={{
                  fill: '#FF073A',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 14px',
                }}
              />
              <YAxis
                minTickGap={5}
                tickFormatter={number => `${number / 1000}k`}
                dataKey="confirmed"
                axisLine={{stroke: '#FF073A', strokeWidth: '2'}}
                tickLine={{stroke: '#FF073A', strokeWidth: '2'}}
                tick={{
                  fill: '#FF073A',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 16px',
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Line
                dot={{fill: '#FF073A'}}
                type="monotone"
                name="Confirmed"
                dataKey="confirmed"
                stroke="#FF073A"
              />
            </LineChart>
          </div>
          <div className="active-line-chart-con line-chart-con ">
            <LineChart
              width={800}
              height={250}
              data={stateTimelineData}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis
                dataKey="date"
                axisLine={{stroke: '#007BFF', strokeWidth: '2'}}
                minTickGap={10}
                tickLine={{stroke: '#007BFF', strokeWidth: '2'}}
                tick={{
                  fill: '#007BFF',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 14px',
                }}
              />
              <YAxis
                minTickGap={5}
                tickFormatter={number => `${number / 1000}k`}
                dataKey="active"
                axisLine={{stroke: '#007BFF', strokeWidth: '2'}}
                tickLine={{stroke: '#007BFF', strokeWidth: '2'}}
                tick={{
                  fill: '#007BFF',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 16px',
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Line
                dot={{fill: '#007BFF'}}
                type="monotone"
                name="Total Active"
                dataKey="active"
                stroke="#007BFF"
              />
            </LineChart>
          </div>
          <div className="recovered-line-chart-con line-chart-con ">
            <LineChart
              width={800}
              height={250}
              data={stateTimelineData}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis
                dataKey="date"
                axisLine={{stroke: '#27A243', strokeWidth: '2'}}
                minTickGap={10}
                tickLine={{stroke: '#27A243', strokeWidth: '2'}}
                tick={{
                  fill: '#27A243',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 14px',
                }}
              />
              <YAxis
                minTickGap={5}
                tickFormatter={number => `${number / 1000}k`}
                dataKey="recovered"
                axisLine={{stroke: '#27A243', strokeWidth: '2'}}
                tickLine={{stroke: '#27A243', strokeWidth: '2'}}
                tick={{
                  fill: '#27A243',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 16px',
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Line
                dot={{fill: '#27A243'}}
                type="monotone"
                name="Recovered"
                dataKey="recovered"
                stroke="#27A243"
              />
            </LineChart>
          </div>
          <div className="deceased-line-chart-con line-chart-con ">
            <LineChart
              width={800}
              height={250}
              data={stateTimelineData}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis
                dataKey="date"
                axisLine={{stroke: '#6C757D', strokeWidth: '2'}}
                minTickGap={10}
                tickLine={{stroke: '#6C757D', strokeWidth: '2'}}
                tick={{
                  fill: '#6C757D',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 14px',
                }}
              />
              <YAxis
                minTickGap={5}
                tickFormatter={number => `${number / 1000}k`}
                dataKey="deceased"
                axisLine={{stroke: '#6C757D', strokeWidth: '2'}}
                tickLine={{stroke: '#6C757D', strokeWidth: '2'}}
                tick={{
                  fill: '#6C757D',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 16px',
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Line
                dot={{fill: '#6C757D'}}
                type="monotone"
                name="Deceased"
                dataKey="deceased"
                stroke="#6C757D"
              />
            </LineChart>
          </div>
          <div className="tested-line-chart-con line-chart-con ">
            <LineChart
              width={800}
              height={250}
              data={stateTimelineData}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis
                dataKey="date"
                axisLine={{stroke: '#9673B9', strokeWidth: '2'}}
                minTickGap={10}
                tickLine={{stroke: '#9673B9', strokeWidth: '2'}}
                tick={{
                  fill: '#9673B9',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 14px',
                }}
              />
              <YAxis
                minTickGap={5}
                tickFormatter={number => `${number / 1000}k`}
                dataKey="tested"
                axisLine={{stroke: '#9673B9', strokeWidth: '2'}}
                tickLine={{stroke: '#9673B9', strokeWidth: '2'}}
                tick={{
                  fill: '#9673B9',
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  fontSize: ' 16px',
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Line
                dot={{fill: '#9673B9'}}
                type="monotone"
                name="Tested"
                dataKey="tested"
                stroke="#9673B9"
              />
            </LineChart>
          </div>
        </div>
      </>
    )
  }

  getTopTenCovid19 = () => {
    const {stateTimelineData} = this.state
    const topIndexValue = stateTimelineData.length
    const newTimelineData = stateTimelineData.slice(
      topIndexValue - 10,
      topIndexValue,
    )

    return newTimelineData
  }

  getTopDistricstColor = () => {
    const {activeStat} = this.state
    switch (activeStat) {
      case activeStats.confirmed:
        return 'confirmed-color'
      case activeStats.recovered:
        return 'recovered-color'
      case activeStats.deceased:
        return 'deceased-color'
      case activeStats.active:
        return 'active-color'
      default:
        return null
    }
  }

  renderStateSpecificData = () => {
    const {statsData, activeStat} = this.state
    const {
      lastUpdatedDate,
      stateName,
      totalTested,
      totalCases,
      statePopulation,
      stateImageUrl,
    } = statsData
    const confirmedClass =
      activeStat === activeStats.confirmed ? 'active-confirmed' : ''
    const activeClass = activeStat === activeStats.active ? 'active-active' : ''
    const recoveredClass =
      activeStat === activeStats.recovered ? 'active-recovered' : ''
    const deceasedClass =
      activeStat === activeStats.deceased ? 'active-deceased' : ''

    const activeDistrictList = this.getActiveDistrictList()
    const topDistrictsColor = this.getTopDistricstColor()
    console.log(topDistrictsColor)
    return (
      <div className="state-specific-route-container">
        <>
          <div className="state-specific-state-name-tested">
            <div className="state-specific-heading-update">
              <h2>{stateName}</h2>
              <p>{`Last Update on ${lastUpdatedDate}.`}</p>
            </div>

            <div>
              <p className="state-tested-name">Tested</p>
              <p className="state-tested-count">{totalTested}</p>
            </div>
          </div>
          <ul className="state-specific-stats-list-container">
            <li
              //   testid="stateSpecificConfirmedCasesContainer"
              className={`state-specific-confirmed-cases ${confirmedClass}`}
              onClick={this.onClickConfirmed}
            >
              <p>Confirmed</p>
              <img
                src="https://res.cloudinary.com/dnddnchcm/image/upload/v1675998597/covid19/confirmed_h2sw0x.png"
                alt="state specific confirmed cases pic"
              />
              <p>{totalCases.confirmed}</p>
            </li>
            <li
              //   testid="stateSpecificActiveCasesContainer"
              className={`state-specific-active-cases ${activeClass}`}
              onClick={this.onClickActive}
            >
              <p>Active</p>
              <img
                src="https://res.cloudinary.com/dnddnchcm/image/upload/v1675998597/covid19/active_klnlbx.png"
                alt="state specific active cases pic"
              />
              <p>{totalCases.active}</p>
            </li>
            <li
              //   testid="stateSpecificRecoveredCasesContainer"
              className={`state-specific-recovered-cases ${recoveredClass}`}
              onClick={this.onClickRecovered}
            >
              <p>Recovered</p>
              <img
                src="https://res.cloudinary.com/dnddnchcm/image/upload/v1675998597/covid19/recovered_utaw9i.png"
                alt="state specific recovered cases pic"
              />
              <p>{totalCases.recovered}</p>
            </li>
            <li
              //   testid="stateSpecificDeceasedCasesContainer"
              className={`state-specific-deceased-cases ${deceasedClass}`}
              onClick={this.onClickDeceased}
            >
              <p>Deceased</p>
              <img
                src="https://res.cloudinary.com/dnddnchcm/image/upload/v1675998597/covid19/deceased_xuqaom.png"
                alt="state specific deceased cases pic"
              />
              <p>{totalCases.deceased}</p>
            </li>
          </ul>
          <div className="state-map-report-container">
            <img src={stateImageUrl} alt={`${stateName} Map`} />
            <div>
              <p className="report">NCP report </p>
              <div className="map-report-con">
                <div>
                  <p className="map-headings">Population</p>
                  <p className="report">{statePopulation}</p>
                </div>
                <div>
                  <p className="map-headings">Tested</p>
                  <p className="report">{totalTested}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="top-districts-container">
            <h1 className={`top-districts ${topDistrictsColor}`}>
              Top Districts
            </h1>
            <ul
            // testid="topDistrictsUnorderedList"
            >
              {activeDistrictList.map(eachItem => (
                <li key={eachItem.districtName}>
                  <span className="top-district-count">
                    {eachItem[activeStat.toLowerCase()]}
                  </span>
                  <span className="top-district-name">
                    {eachItem.districtName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
        {this.renderRechartsContainer()}
        <Footer />
      </div>
    )
  }

  renderStateSpecificSwitch = () => {
    const {stateStatus} = this.state
    switch (stateStatus) {
      case specificStatus.progress:
        return this.renderStateSpecificLoader()
      case specificStatus.success:
        return this.renderStateSpecificData()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderStateSpecificSwitch()}
      </>
    )
  }
}

export default StateSpecific
