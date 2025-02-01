import {IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
import {useStore} from 'lib/store/store'
import {get} from 'lodash'
import router from 'next/router'
import {redirectGuest} from 'pages/_app'
import React from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'
import {branchApi} from 'lib/api/branch'
import {useQuery} from '@tanstack/react-query'
import {questionsApi} from 'lib/api/questions'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery({
    queryFn: () => questionsApi.get(),
    queryKey: ['questions'],
  })

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'text',
      headerName: 'Title',
      renderCell: ({row}) => `${row.text}`,
    },
    {
      ...defaultRowConfig,
      field: 'type',
      headerName: 'Type',
      renderCell: ({row}) => `${row.type}`,
    },
    {
      ...defaultRowConfig,
      field: 'required',
      headerName: 'Required',
      renderCell: ({row}) => `${row.required}`,
    },
    {
      ...defaultRowConfig,
      field: 'media_status',
      headerName: 'Media Status',
      renderCell: ({row}) => `${row.media_status}`,
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
              pathname: '/questions/form/[model_id]',
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
            await questionsApi.delete(id)
            await refetch()
          } catch (e) {
            console.log(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <Table
        rows={
          (data?.questions &&
            data?.questions?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
