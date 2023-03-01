import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import StateSpecific from './components/StateSpecific'
import NotFound from './components/NotFound'
import VaccinationDetails from './components/VaccinationDetails'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/state/:stateCode" component={StateSpecific} />
    <Route exact path="/vaccination" component={VaccinationDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
