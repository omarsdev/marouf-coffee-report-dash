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
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      submissionsApi.getAssignmentSubmission(
        toSearchQuery({
          pageNumber: pagination.pageNumber + 1,
          pageSize: pagination.pageSize,
          assignmentId: model_id,
        }),
      ),
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
        return {note: data?.note ?? '', image: data?.image ?? ''}
      } catch (error) {
        return {note: '', image: ''}
      }
    }
  }
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
        return getNoteValue(row.note).image ? (
          <div
            className="h-full w-full flex justify-start"
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
          (data?.submissions?.[0]?.answers &&
            data?.submissions?.[0]?.answers?.map((model) => ({
              ...model,
              id: model._id,
            }))) ||
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
