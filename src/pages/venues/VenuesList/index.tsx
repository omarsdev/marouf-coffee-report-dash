import {IconButton} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import TableLocationCell from 'components/TableLocationCell'
import TableToggleSwitch from 'components/TableToggleSwitch'
import TableUserCell from 'components/TableUserCell'
import request from 'lib/api'
import {venuesApi} from 'lib/api/venues'
import {useStore} from 'lib/store/store'
import {get} from 'lodash'
import router, {Router} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'

export default function VenuesList() {
  const {venues, rehydrateVenues} = useStore(
    ({venues, rehydrateVenues}) => ({venues, rehydrateVenues}),
    shallow,
  )

  console.log('VENUES', venues)

  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  React.useEffect(() => {
    rehydrateVenues()
  }, [])

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', flex: 1, headerAlign: "left", align: "left", },
    // {
    //     ...defaultRowConfig,
    //     field: 'image',
    //     headerName: 'Banner',
    //     renderCell: ({ row }) =>
    //         <div>
    //             {get(row, 'image.en', false) ? (
    //                 <div className='p-2'>
    //                     <img
    //                         style={{
    //                             objectFit: 'contain'
    //                         }}
    //                         src={get(row, 'image.en')}
    //                     />
    //                 </div>
    //             ) : (
    //                 <div>
    //                     N/A
    //                 </div>
    //             )}
    //         </div>
    // },
    {
      ...defaultRowConfig,
      field: 'name.en',
      headerName: 'English Name',
      renderCell: ({row}) => `${row.name.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'top_rated',
      headerName: 'Top Rated',
      flex: 0.5,
      renderCell: ({row}) => {
        return (
          <TableToggleSwitch
            checked={row.top_rated}
            onStatusChange={async (status) => {
              try {
                setLocalLoading(true)
                if (status) {
                  await venuesApi.edit({top_rated: true}, row.id)
                } else {
                  await venuesApi.edit({top_rated: false}, row.id)
                }
                await rehydrateVenues()
              } catch (e) {
                console.log(e)
              } finally {
                setLocalLoading(false)
              }
            }}
          />
        )
      },
    },
    {
      ...defaultRowConfig,
      field: 'status',
      headerName: 'Ready',
      flex: 0.5,
      renderCell: ({row}) => {
        return (
          <TableToggleSwitch
            checked={row.status == 'ACTIVE'}
            onStatusChange={async (status) => {
              try {
                setLocalLoading(true)
                if (status) {
                  await venuesApi.edit({status: 'ACTIVE'}, row.id)
                } else {
                  await venuesApi.edit({status: 'UNDER_DEVELOPMENT'}, row.id)
                }
                await rehydrateVenues()
              } catch (e) {
                console.log(e)
              } finally {
                setLocalLoading(false)
              }
            }}
          />
        )
      },
    },
    // {
    //     ...defaultRowConfig,
    //     field: 'priority',
    //     flex: 0.5,
    //     headerName: 'Priority',
    // },
    {
      ...defaultRowConfig,
      field: 'open',
      headerName: '',
      description: '',
      sortable: false,
      flex: 1.5,
      renderCell: ({row}) => (
        <div className="flex">
          <TableUserCell
            staff
            onBookingPress={() =>
              router.push({
                pathname: '/bookings/[venue]',
                query: {venue: row.id},
              })
            }
            onPress={() =>
              router.push({
                pathname: '/staff/[venue]',
                query: {venue: row.id},
              })
            }
            onAccountingPress={() =>
              router.push({
                pathname: '/account/[venue]',
                query: {venue: row.id},
              })
            }
          />
          <div className="ml-4">
            <TableLocationCell
              onPress={() => {
                window.open(
                  'https://maps.google.com/?q=' + row.location.coordinates,
                )
              }}
            />
          </div>
        </div>
      ),
    },

    {
      ...defaultRowConfig,
      field: 'id',
      headerName: '',
      description: '',
      sortable: false,
      hideSortIcons: true,
      hideable: false,
      filterable: false,
      renderCell: ({row}) => (
        <TableActionCell
          onEdit={() => {
            router.push({
              pathname: '/venues/form/[venue_id]',
              query: {venue_id: row.id},
            })
          }}
          onDelete={() => {
            setDeleteDialogOpen(row.id)
          }}
        />
      ),
    },
  ]

  return (
    <div>
      <DeleteDialog
        isOpen={!!deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(null)}
        deleteCallback={async () => {
          try {
            setLocalLoading(true)
            let id = deleteDialogOpen
            setDeleteDialogOpen(null)
            await venuesApi.delete(id)
            await rehydrateVenues()
          } catch (e) {
            console.log(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <Table
        rows={
          (venues && venues.map((branch) => ({...branch, id: branch._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
