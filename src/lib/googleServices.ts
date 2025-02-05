import axios from 'axios'
import {GOOGLE_API_KEY} from './api'

type Location = Array<String>

let corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
  'Access-Control-Allow-Headers':
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  'x-lang': undefined,
  'x-auth-token': undefined,
}

const GOOGLE_MAPS_API_TARGET = 'https://maps.googleapis.com/maps/api/place'
const cors = 'https://cors-anywhere.herokuapp.com/'
const API_KEY = GOOGLE_API_KEY

const buildUserLocation = (location: Location) => {
  if (!!location && location.length == 2) {
    return `${location[0]},${location[1]}`
  } else {
    return ''
  }
}
//types=[address,geocode]
const buildAutoCompleteUrl = (query: String, location: Location = null) => {
  return `${GOOGLE_MAPS_API_TARGET}/autocomplete/json?input=${query}&key=${API_KEY}&components=country:jo&location=${buildUserLocation(
    location,
  )}${!!location ? `&radius=35000&strictbounds=true` : ''}`
}

const buildPlacesUrl = (placeId) => {
  return `${GOOGLE_MAPS_API_TARGET}/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${API_KEY}`
}

const buildGeocodingURL = (location: Location) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${buildUserLocation(
    location,
  )}&key=${API_KEY}`
}

const buildGeocodingURLAR = (location: Location) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${buildUserLocation(
    location,
  )}&key=${API_KEY}&language=ar`
}

const autoComplete = (query: String, location: Location = null) => {
  let url = buildAutoCompleteUrl(query, location)
  return axios
    .get('', {
      baseURL: url,
      headers: {
        mode: 'no-cors',
      },
    })
    .then((response: any) => {
      return response.predictions
    })
}

const getPlace = async (placeId) => {
  if (!placeId) {
    return
  }
  let baseURL = buildPlacesUrl(placeId)
  return axios
    .get('', {
      baseURL,
      headers: {
        cors: '*',
        ...corsHeaders,
      },
    })
    .then((response: any) => {
      return response.result
    })
}

const getPlaceFromLatLng = async (location: Location) => {
  let baseURL = buildGeocodingURL(location)
  return await fetch(baseURL).then((response: any) => {
    return response.json()
  })
}

const getPlaceFromLatLngAR = async (location: Location) => {
  let baseURL = buildGeocodingURLAR(location)
  return await fetch(baseURL).then((response: any) => {
    return response.json()
  })
}

export const GooglePlacesService = {
  getPlace,
  autoComplete,
}

export const GoogleGeocodingService = {
  ToPlace: getPlaceFromLatLng,
  toPlaceARL: getPlaceFromLatLngAR,
}
