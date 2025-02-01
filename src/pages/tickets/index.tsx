import {GridAddIcon} from '@mui/x-data-grid'
import CustomButton from 'components/CustomButton'
import PanelSegmentation from 'components/PanelSegmentation'
import router from 'next/router'
import React, {useState} from 'react'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'
import ModelList from './ModelList'
import {DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {TextField} from '@mui/material'

export default function Employees(props) {
  return (
    <Layout
      meta={{
        title: 'Tickets',
      }}
    >
      <PanelSegmentation
        panels={[
          {
            title: 'Tickets',
            description: 'Get all the tickets here',
            component: <ModelList />,
            button: (
              <CustomButton
                onClick={() => {
                  router.push('/tickets/form/new')
                }}
                startIcon={<GridAddIcon />}
                width="10rem"
                title="Create"
              />
            ),
          },
        ]}
      />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
