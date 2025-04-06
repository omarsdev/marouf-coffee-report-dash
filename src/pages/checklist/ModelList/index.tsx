import {useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router from 'next/router'
import React, {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {checklistApi} from 'lib/api/checklist'
import {toSearchQuery} from 'lib/utils'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      checklistApi.get(
        toSearchQuery({
          pageNumber: pagination.pageNumber + 1,
          pageSize: pagination.pageSize,
        }),
      ),
    queryKey: ['checklist'],
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
      field: 'title',
      headerName: 'Title',
      renderCell: ({row}) => `${row.title}`,
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
              pathname: '/checklist/form/[model_id]',
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
            await checklistApi.delete(id)
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
          (data?.reports &&
            data?.reports?.map((model) => ({...model, id: model._id}))) ||
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
