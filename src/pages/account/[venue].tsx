import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import {useStore} from 'lib/store/store'
import router, {useRouter} from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'

export default function Staff(props) {
  const {
    query: {venue: query},
  } = useRouter()
  const {user} = useStore()
  React.useEffect(() => {
    console.log('user', user)
  }, [])
  return <ModelList query={query} setLoading={props.setLoading} />
}
