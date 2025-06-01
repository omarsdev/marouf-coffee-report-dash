import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import useStore from 'lib/store/store'
import router from 'next/router'
import React from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import SendNotificationForm from './form'

export default function SendNotifications(props) {
  return <SendNotificationForm />
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
