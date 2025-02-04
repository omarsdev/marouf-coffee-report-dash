import React, {useRef, useCallback} from 'react'
const GOOGLEAPIKEY = 'AIzaSyD5OQ-RVhYfeYpBiD65zb7PdZkQpfOHWnA'
import {compose, withProps} from 'recompose'
import {GoogleMap, Marker, LoadScript} from '@react-google-maps/api'
//withScriptjs, withGoogleMap,
// import {  useLoadScript } from '@react-google-maps/api';
import {useTheme} from '@mui/material'
import {RiMapFill} from 'react-icons/ri'
import CustomLabel from './CustomLabel'
import {Box} from '@mui/system'
import {get} from 'lodash'
import TextInput from './TextInput'

interface Props {
  onChange
  name
  initial?
  location?
}

const MAPDAYSTYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
]

const MAPNIGHTSTYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
]

const MapWithAMarker = (props: any) => {
  const theme = useTheme()
  const [location, setLocation] = React.useState({
    lat: props.initial?.lat ? props.initial.lat : 31.956305,
    lng: props.initial?.lng ? props.initial.lng : 35.854405,
  })
  const mapRef = React.useRef<any>(null)

  React.useEffect(() => {
    setTimeout(() => {
      if (get(props, 'initial.type', false) == 'Point') {
        setLocation({
          lat: get(props, 'initial.lat'),
          lng: get(props, 'initial.lng'),
        })
      }
    }, 250)
  }, [props.initial])

  React.useEffect(() => {
    props.onChange(props.name, {
      lat: location.lat,
      lng: location.lng,
    })
  }, [location])

  return (
    <LoadScript googleMapsApiKey={`${GOOGLEAPIKEY}`}>
      <GoogleMap
        ref={mapRef}
        options={{
          styles: theme.palette.mode == 'dark' ? MAPNIGHTSTYLE : MAPDAYSTYLE,
        }}
        zoom={16}
        center={props.current ? props.current : location}
        // center={{lat: 31.972657, lng: 35.864801}}
        onDblClick={async (event) => {
          setLocation({lat: event.latLng.lat(), lng: event.latLng.lng()})
          // await mapRef.current.panTo(location)
          // props.onChange(props.name, { coordinates: [location.lat, location.lng] })
        }}
      >
        <Marker
          icon={{
            url: 'https://vuedalesmallapps.s3.us-east-2.amazonaws.com/map-pin-2-fill.png',
          }}
          position={props.current ? props.current : location}
        />
      </GoogleMap>
    </LoadScript>
  )
}

export default function MapFormPicker(props: Props) {
  return (
    <Box
      sx={{
        pb: 2,
        mt: 2,
      }}
    >
      <MapWithAMarker
        initial={props.initial}
        //@ts-ignore
        onChange={props.onChange}
        //@ts-ignore
        name={props.name}
        current={props.location}
        googleMapURL={
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=' +
          GOOGLEAPIKEY
        }
        loadingElement={<div style={{height: `100%`}} />}
        containerElement={<div style={{height: `400px`}} />}
        mapElement={<div style={{height: `100%`}} />}
      />

      <CustomLabel size="caption" className="mt-3">
        Double click on position to select it
      </CustomLabel>
    </Box>
  )
}
