export const transformDataPoints = (data) => {
  const newData = []

  data &&
    data.forEach((item) => {
      newData.push({
        name: item.name,
        lat: item.coord.lat,
        lon: item.coord.lon,
        ...item.main,
      })
    })

  return newData
}
