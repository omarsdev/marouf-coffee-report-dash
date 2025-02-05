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
import {schedulesApi} from 'lib/api/schedules'
import {format} from 'date-fns'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () => schedulesApi.get(),
    queryKey: ['schedules'],
  })

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'branch.area_manager.name.en',
      headerName: 'Area Manager',
      renderCell: ({row}) => `${row.branch?.area_manager?.name?.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'branch.name.en',
      headerName: 'Branch',
      renderCell: ({row}) => `${row.branch?.name?.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'created_at',
      headerName: 'Date',
      renderCell: ({row}) =>
        `${format(new Date(row.created_at), 'dd/MM/yyyy')}`,
    },
    {
      ...defaultRowConfig,
      field: 'assignedAt',
      headerName: 'Time Started',
      renderCell: ({row}) =>
        `${format(new Date(row.assignedAt), 'dd/MM/yyyy')}`,
    },
    {
      ...defaultRowConfig,
      field: 'completed',
      headerName: 'Status',
      renderCell: ({row}) => `${row.completed ? 'Active' : 'Inactive'}`,
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
              pathname: '/schedules/form/[model_id]',
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
            await schedulesApi.delete(id)
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
          (data?.assignments &&
            data?.assignments?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
