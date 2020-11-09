import { useReducer } from 'react'
import { Icon, initializeIcons } from '@fluentui/react/lib'

import GlobalMapChart from './components/GlobalMapChart'
import SearchWeather from './components/SearchWeather'
import WeatherPanel from './components/WeatherPanel'
import { commonReducer } from './reducers/commonReducer'

import './App.scss'

initializeIcons()

const initialState = {
  data: [],
  cityData: {},
  searchData: {},
}

const App = () => {
  const [state, dispatch] = useReducer(commonReducer, initialState)

  return (
    <div className="App">
      <header className="App-header">
        <span className="App-title">
          <a href="/">
            <Icon iconName={'PartlyCloudyDay'} />{' '}
          </a>
          Fluent Weather
        </span>
        <SearchWeather searchData={state.searchData} dispatch={dispatch} />
      </header>
      <section className="App-content">
        <GlobalMapChart data={state.data} dispatch={dispatch} />
        <WeatherPanel cityData={state.cityData} />
      </section>
    </div>
  )
}

export default App
