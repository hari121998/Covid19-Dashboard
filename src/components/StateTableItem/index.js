import './index.css'

const StateTableItem = props => {
  const {stateTableItem} = props
  const {
    confirmed,
    active,
    recovered,
    deceased,
    population,
    name,
  } = stateTableItem
  return (
    <li className="table-item-container">
      <h3>{name}</h3>
      <p className="confirmed"> {confirmed}</p>
      <p className="active"> {active}</p>
      <p className="recovered"> {recovered}</p>
      <p className="deceased"> {deceased}</p>
      <p className="population"> {population}</p>
    </li>
  )
}

export default StateTableItem
