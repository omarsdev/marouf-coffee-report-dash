import {useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import Table from 'components/Table'
import router, {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {submissionsApi} from 'lib/api/submissions'
import {toSearchQuery} from 'lib/utils'

export default function ModelList() {
  const {
    query: {model_id},
  } = useRouter()

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      submissionsApi.getAssignmentSubmission(
        toSearchQuery({
          assignmentId: model_id,
        }),
      ),
    queryKey: ['submissionsById' + model_id],
    select: (data) => {
      return data
    },
  })
  console.log({data})

  const getNoteValue = (props) => {
    if (props === 'Empty') {
      return {note: '', image: []}
    } else {
      const data = JSON.parse(props)
      return {note: data?.note ?? '', image: data?.image ?? []}
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
      valueGetter: ({row}) => row?.questionId?.text,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'answer',
      headerName: 'Answer',
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => {
        return row.answer
      },
    },
    {
      ...defaultRowConfig,
      field: 'note',
      headerName: 'Note',
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => {
        return getNoteValue(row.note).note
      },
    },
    {
      ...defaultRowConfig,
      field: 'image',
      headerName: 'Image',
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => {
        return getNoteValue(row.note).image.length > 0 ? (
          <div
            className="h-full w-full flex justify-start "
            style={{gap: '10px'}}
          >
            {getNoteValue(row.note).image?.map((image) => (
              <div
                onClick={() => {
                  window.open(image, '_blank', 'noopener,noreferrer')
                }}
              >
                <img
                  // style={{
                  //   objectFit: 'contain',
                  // }}
                  src={image}
                />
              </div>
            ))}
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
          (data?.submissions?.[0]?.answers &&
            data?.submissions?.[0]?.answers?.map((model) => ({
              ...model,
              id: model._id,
            }))) ||
          []
        }
        columns={columns}
        hideFooterPagination
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
