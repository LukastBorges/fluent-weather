import { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ActionButton, Callout } from '@fluentui/react/lib'

import { getByCoordinates } from '../services/weatherAPI'
import { transformDataPoints } from '../utils/utils'
import { MARKER_USER_CLASS } from '../utils/constants'

const SearchWeather = ({ searchData, dispatch }) => {
  const [popup, setPopup] = useState('')
  const [searchBtn, setSearchBtn] = useState(false)

  const onClick = async () => {
    const response = await getByCoordinates(searchData.latitude, searchData.longitude)
    const data = transformDataPoints(response && response.list)

    dispatch({ type: 'update', key: 'data', value: data })
    !data.length && setPopup(`.${MARKER_USER_CLASS}`)
  }

  useEffect(() => {
    setSearchBtn(!searchData)
  }, [searchData])

  return (
    <>
      <ActionButton
        id="searchCitiesWeather"
        iconProps={{ iconName: 'Search' }}
        onClick={onClick}
        disabled={searchBtn}
      >
        Search cities
      </ActionButton>
      <Callout
        ariaLabelledBy="searchCitiesWeather"
        ariaDescribedBy="searchCitiesWeather"
        role="alertdialog"
        gapSpace={0}
        target={popup}
        onDismiss={() => setPopup('')}
        hidden={!popup}
        setInitialFocus
      >
        <p className="App-tooltip-not-found">No cities found around this area.</p>
      </Callout>
    </>
  )
}

SearchWeather.propTypes = {
  searchData: PropTypes.object,
  dispatch: PropTypes.func,
}

export default memo(SearchWeather)
