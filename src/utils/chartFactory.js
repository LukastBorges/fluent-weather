import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import countries from '@amcharts/amcharts4-geodata/data/countries2'
import { SharedColors } from '@fluentui/theme'

import { CONTINENTS } from './constants'

am4core.useTheme(am4themesAnimated)

export const createChart = (id, type) => {
  const chart = am4core.create(id, am4maps[type])

  chart.id = id
  chart.dummyData = {}

  return chart
}

export const createMapSeries = (chart, geoData) => {
  const series = chart.series.push(new am4maps.MapPolygonSeries())
  const polygons = series.mapPolygons.template
  const hoverState = polygons.states.create('hover')

  series.useGeodata = true
  series.geodata = geoData

  polygons.tooltipText = '{name}'
  polygons.nonScalingStroke = true
  polygons.strokeWidth = 0.75
  polygons.fill = am4core.color('#eee')
  polygons.propertyFields.fill = 'color'
  polygons.cursorOverStyle = am4core.MouseCursorStyle.pointer

  hoverState.properties.fill = am4core.color(SharedColors.gray10)

  return [series, polygons]
}

export const getGeoData = (chart) => {
  const mapData = []

  Object.keys(countries).forEach((key) => {
    const country = countries[key]

    country.maps.length &&
      mapData.push({
        id: key,
        color: chart.colors.getIndex(CONTINENTS[country.continent_code]),
        map: country.maps[0],
      })
  })

  return mapData
}
