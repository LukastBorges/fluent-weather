import PropTypes from 'prop-types'
import { memo, useState, useEffect } from 'react'
import { Panel, Icon } from '@fluentui/react/lib'

const WeatherPanel = ({ cityData }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    cityData.name && setOpen(true)
  }, [cityData])

  return (
    <Panel
      isLightDismiss
      isOpen={open}
      onDismiss={() => setOpen(false)}
      closeButtonAriaLabel="Close"
      headerText={cityData.name}
      className="App-weather-panel"
    >
      <p>
        <Icon iconName={'Frigid'} /> Temperatures:
      </p>
      <ul>
        <li>Current: {cityData.temp}&deg;C</li>
        <li>Feels like: {cityData.feels_like}&deg;C</li>
        <li>Maximum: {cityData.temp_max}&deg;C</li>
        <li>Minimum: {cityData.temp_min}&deg;C</li>
      </ul>
      <p>
        <Icon iconName={'Precipitation'} />
        Humidity: {cityData.humidity}%
      </p>
      <p>
        <Icon iconName={'Diagnostic'} />
        Pressure: {cityData.pressure} hPa
      </p>
    </Panel>
  )
}

WeatherPanel.propTypes = {
  cityData: PropTypes.object,
}

export default memo(WeatherPanel)
