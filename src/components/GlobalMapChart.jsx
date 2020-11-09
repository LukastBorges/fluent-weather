import PropTypes from 'prop-types'
import { memo, useLayoutEffect, useRef } from 'react'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import worldHigh from '@amcharts/amcharts4-geodata/worldLow'

import { CITY_BULLET, HOME_BUTTON, MAP_MARKER, MARKER_USER_CLASS } from '../utils/constants'
import { createChart, createMapSeries, getGeoData } from '../utils/chartFactory'

const setCitySeries = (chart, dispatch) => {
  const imageSeries = chart.series.push(new am4maps.MapImageSeries())
  const imageSeriesTemplate = imageSeries.mapImages.template
  const circle = imageSeriesTemplate.createChild(am4core.Sprite)

  imageSeries.id = 'citySeries'
  imageSeries.data = []

  circle.scale = 0.6
  circle.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground')
  circle.path = CITY_BULLET

  imageSeriesTemplate.propertyFields.latitude = 'lat'
  imageSeriesTemplate.propertyFields.longitude = 'lon'
  imageSeriesTemplate.horizontalCenter = 'middle'
  imageSeriesTemplate.verticalCenter = 'middle'
  imageSeriesTemplate.align = 'center'
  imageSeriesTemplate.valign = 'middle'
  imageSeriesTemplate.width = 10
  imageSeriesTemplate.height = 10
  imageSeriesTemplate.nonScaling = true
  imageSeriesTemplate.tooltipHTML = `<div>{name}</div><div>Current temperature: {temp}&deg;C</div>`
  imageSeriesTemplate.fill = am4core.color('#000')
  imageSeriesTemplate.background.fillOpacity = 0
  imageSeriesTemplate.background.fill = am4core.color('#fff')
  imageSeriesTemplate.setStateOnChildren = true
  imageSeriesTemplate.states.create('hover')
  imageSeriesTemplate.userClassName = 'city-bullet'
  imageSeriesTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
  imageSeriesTemplate.events.on('hit', (ev) => {
    chart.dummyData.marker.hide()
    chart.dummyData.activeCityBullet.strokeWidth = 0
    ev.target.strokeWidth = 1
    chart.dummyData.activeCityBullet = ev.target
    dispatch({ type: 'update', key: 'cityData', value: ev.target.dataItem.dataContext })
  })

  chart.dummyData.citySeries = imageSeries
}

const setHitEvent = (chart, sprite, drillDownSeries, dispatch) => {
  sprite.events.on('hit', (ev) => {
    const coords = chart.svgPointToGeo(ev.svgPoint)
    const map = ev.target.dataItem.dataContext.map

    chart.dummyData.citySeries.hide()
    chart.dummyData.marker.latitude = coords.latitude
    chart.dummyData.marker.longitude = coords.longitude
    chart.dummyData.marker.show()
    chart.zoomToMapObject(chart.dummyData.marker, 16)

    if (map) {
      ev.target.isHover = false
      drillDownSeries.geodataSource.url =
        'https://www.amcharts.com/lib/4/geodata/json/' + map + '.json'
      drillDownSeries.geodataSource.load()
    }

    dispatch({ type: 'update', key: 'searchData', value: coords })
  })
}

const setMarkerSeries = (chart) => {
  const imageSeries = chart.series.push(new am4maps.MapImageSeries())
  const mapImage = imageSeries.mapImages.template
  const mapMarker = mapImage.createChild(am4core.Sprite)

  mapMarker.path = MAP_MARKER
  mapMarker.width = 16
  mapMarker.height = 16
  mapMarker.nonScaling = true
  mapMarker.fill = am4core.color('#3F4B3B')
  mapMarker.fillOpacity = 0.8
  mapMarker.horizontalCenter = 'middle'
  mapMarker.verticalCenter = 'bottom'

  chart.dummyData.marker = imageSeries.mapImages.create()
  chart.dummyData.marker.userClassName = MARKER_USER_CLASS
  chart.dummyData.marker.hide()
}

const setZoom = (chart, worldSeries, countrySeries) => {
  const homeButton = chart.chartContainer.createChild(am4core.Button)

  chart.zoomControl = new am4maps.ZoomControl()

  homeButton.icon = new am4core.Sprite()
  homeButton.padding(7, 5, 7, 5)
  homeButton.marginRight = 8
  homeButton.align = 'right'
  homeButton.width = 30
  homeButton.icon.path = HOME_BUTTON
  homeButton.tooltipText = 'Reset zoom'
  homeButton.tooltip.dy = 24
  homeButton.events.on('hit', () => {
    worldSeries.show()
    countrySeries.hide()
    chart.goHome()
  })
}

const GlobalMapChart = ({ data, dispatch }) => {
  const chart = useRef({})

  useLayoutEffect(() => {
    // Create map instance
    chart.current = createChart('worldMap', 'MapChart')
    chart.current.projection = new am4maps.projections.Miller()
    chart.current.dummyData.activeCityBullet = {}

    const [worldSeries, worldPolygon] = createMapSeries(chart.current, worldHigh)
    const [countrySeries, countryPolygon] = createMapSeries(chart.current)

    worldSeries.exclude = ['AQ']

    countrySeries.hide()
    countrySeries.geodataSource.events.on('done', (ev) => {
      worldSeries.hide()
      countrySeries.show()
    })

    // Set the map marjer series
    setMarkerSeries(chart.current)

    // Set geo data
    worldSeries.data = getGeoData(chart.current)

    setCitySeries(chart.current, dispatch)

    // Set click events
    setHitEvent(chart.current, worldPolygon, countrySeries, dispatch)
    setHitEvent(chart.current, countryPolygon, countrySeries, dispatch)

    // Zoom control
    setZoom(chart.current, worldSeries, countrySeries)

    return () => chart.current.dispose()
  }, [dispatch])

  useLayoutEffect(() => {
    chart.current.dummyData.citySeries.data = data
    chart.current.dummyData.citySeries.show()
  }, [data])

  return <div id="worldMap" className="App-world-map" />
}

GlobalMapChart.propTypes = {
  data: PropTypes.array,
  dispatch: PropTypes.func,
}

export default memo(GlobalMapChart)
