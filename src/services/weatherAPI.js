import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/'
const API_KEY = '78df589f3d2e3293fde045e8099bd402'

export const getByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${BASE_URL}find?lat=${lat}&lon=${lon}&cnt=15&units=metric&appid=${API_KEY}`
    )

    return response.data
  } catch (error) {
    console.error(error)
  }
}
