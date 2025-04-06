import {useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router from 'next/router'
import React, {useEffect} from 'react'
import {branchApi} from 'lib/api/branch'
import {useQuery} from '@tanstack/react-query'
import {toSearchQuery} from 'lib/utils'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      branchApi.get(
        toSearchQuery({
          pageNumber: pagination.pageNumber + 1,
          pageSize: pagination.pageSize,
        }),
      ),
    queryKey: ['branches'],
  })

  useEffect(() => {
    refetch()
  }, [JSON.stringify(pagination)])

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
      valueGetter: ({row}) => row.name.en,
      sortComparator: (v1, v2, row1, row2) =>
        (row1.value || '').localeCompare(row2.value || ''),
    },
    {
      ...defaultRowConfig,
      field: 'name.ar',
      headerName: 'Arabic Name',
      renderCell: ({row}) => `${row.name.ar}`,
      valueGetter: ({row}) => row.name.ar,
      sortComparator: (v1, v2, row1, row2) =>
        (row1.value || '').localeCompare(row2.value || ''),
    },
    {
      ...defaultRowConfig,
      headerName: 'Location',
      renderCell: ({row}) => `${row.lng},${row.lat}`,
      sortable: false,
      hideSortIcons: true,
    },
    {
      ...defaultRowConfig,
      field: 'miles',
      flex: 0.25,
      headerName: 'Miles',
      sortable: false,
      hideSortIcons: true,
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
              pathname: '/branches/form/[model_id]',
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
            await branchApi.delete(id)
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
          (data?.branches &&
            data?.branches?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        pagination={pagination}
        onPaginationChange={(page, pageSize) =>
          setPagination({pageNumber: page, pageSize})
        }
        totalRowCount={data?.count}
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
