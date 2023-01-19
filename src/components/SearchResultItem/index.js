import {Link} from 'react-router-dom'
import {BiChevronRightSquare} from 'react-icons/bi'
import './index.css'

const SearchResultItem = props => {
  const {stateItem} = props
  const stateDetails = {
    stateName: stateItem.state_name,
    stateCode: stateItem.state_code,
  }
  const {stateName, stateCode} = stateDetails
  return (
    <Link to={`/state/${stateCode}`} className="search-result-link">
      <li className="search-result-item-con">
        <span className="search-result-state-name">{stateName}</span>
        <button type="button">
          <span>{stateCode}</span>
          <BiChevronRightSquare className="search-result-button-icon" />
        </button>
      </li>
    </Link>
  )
}

export default SearchResultItem
