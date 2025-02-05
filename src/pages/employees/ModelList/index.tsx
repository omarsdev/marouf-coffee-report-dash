import {IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
import useStore from 'lib/store/store'
import {get} from 'lodash'
import router from 'next/router'
import {redirectGuest} from 'pages/_app'
import React from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'
import {branchApi} from 'lib/api/branch'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () => userApi.get(),
    queryKey: ['users'],
  })

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'name.en',
      headerName: 'English Name',
      renderCell: ({row}) => `${row.name.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'name.ar',
      headerName: 'Arabic Name',
      renderCell: ({row}) => `${row.name.ar}`,
    },
    {
      ...defaultRowConfig,
      field: 'email',
      headerName: 'Email',
      renderCell: ({row}) => `${row.email}`,
    },
    {
      ...defaultRowConfig,
      field: 'phone',
      headerName: 'Phone',
      renderCell: ({row}) => `${row.phone}`,
    },
    {
      ...defaultRowConfig,
      field: 'active',
      headerName: 'Active',
      renderCell: ({row}) => `${row.active}`,
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
              pathname: '/employees/form/[model_id]',
              query: {model_id: row.id},
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
            await userApi.delete(id)
            await refetch()
          } catch (e) {
            console.error(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <Table
        rows={
          (data?.users &&
            data?.users?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
