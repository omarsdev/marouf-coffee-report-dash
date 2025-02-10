import {useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router, {useRouter} from 'next/router'
import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {checklistApi} from 'lib/api/checklist'
import {submissionsApi} from 'lib/api/submissions'
import Image from 'next/image'

export default function ModelList() {
  const {
    query: {model_id},
  } = useRouter()

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () => submissionsApi.getById(String(model_id)),
    queryKey: ['submissionsById' + model_id],
    select: (data) => {
      return data
    },
  })

  const getNoteValue = (props) => {
    if (props === 'Empty') {
      return {note: '', image: ''}
    } else {
      try {
        const data = JSON.parse(props)
        return data
      } catch (error) {
        return {note: '', image: ''}
      }
    }
  }

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'questionId.text',
      headerName: 'Title',
      renderCell: ({row}) => `${row?.questionId?.text}`,
    },
    {
      ...defaultRowConfig,
      field: 'answer',
      headerName: 'Answer',
      renderCell: ({row}) => {
        return row.answer
      },
    },
    {
      ...defaultRowConfig,
      field: 'note',
      headerName: 'Note',
      renderCell: ({row}) => {
        return getNoteValue(row.note).note
      },
    },
    {
      ...defaultRowConfig,
      field: 'image',
      headerName: 'Image',
      renderCell: ({row}) => {
        return getNoteValue(row.note).image ? (
          <div
            className="h-full w-full"
            onClick={() => {
              window.open(
                getNoteValue(row.note).image,
                '_blank',
                'noopener,noreferrer',
              )
            }}
          >
            <img
              style={{
                objectFit: 'contain',
              }}
              className="h-full w-full"
              src={getNoteValue(row.note).image}
            />
          </div>
        ) : (
          <div>N/A</div>
        )
      },
    },
  ]

  return (
    <div>
      <Table
        rows={
          (data?.submission?.answers &&
            data?.submission?.answers?.map((model) => ({
              ...model,
              id: model._id,
            }))) ||
          []
        }
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
