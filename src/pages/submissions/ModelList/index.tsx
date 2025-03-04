import {useTheme} from '@mui/material'
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid'
import Table from 'components/Table'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {submissionsApi} from 'lib/api/submissions'
import CustomLabel from 'components/CustomLabel'
import {format} from 'date-fns'
import {toSearchQuery} from 'lib/utils'

export default function ModelList() {
  const {query} = useRouter()

  const model_id = query.model_id as string
  const submittedAt = query.submittedAt as string
  const time_start = query.time_start as string
  const time_end = query.time_end as string

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      submissionsApi.getById(
        String(model_id),
        toSearchQuery({
          pageNumber: pagination.pageNumber + 1,
          pageSize: pagination.pageSize,
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
      valueGetter: (params) => params.row.questionId?.text || '',
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
      valueGetter: ({row}) => getNoteValue(row.note).image || 'N/A',
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
      <div className="-mt-10 mb-6 flex-col gap-y-2">
        <CustomLabel type="primary" size="normal">
          {data?.submission?.reportCopy?.title}{' '}
          {data?.submission?.reportCopy?._id}
        </CustomLabel>
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            Date:
          </CustomLabel>
          {submittedAt ? (
            format(new Date(submittedAt), 'yyyy/MM/dd')
          ) : (
            <span>Invalid time</span>
          )}
        </CustomLabel>
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            Location/Branch:
          </CustomLabel>
          {data?.submission?.check?.branch?.lng},
          {data?.submission?.check?.branch?.lat} /{' '}
          {data?.submission?.check?.branch?.name?.en}
        </CustomLabel>
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            Inside/Outside Branch:
          </CustomLabel>
          {data?.submission?.check?.in_range
            ? 'Inside locaiton'
            : 'Outside locaiton'}
        </CustomLabel>
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            CheckIn/Checkout:
          </CustomLabel>
          {time_start && typeof time_end ? (
            <>
              {format(new Date(time_start), 'p')} /{' '}
              {format(new Date(time_end), 'p')}
            </>
          ) : (
            <span>Invalid time</span>
          )}
        </CustomLabel>
      </div>
      <Table
        rows={
          (data?.submission?.answers &&
            data?.submission?.answers?.map((model) => ({
              ...model,
              id: model._id,
            }))) ||
          []
        }
        onPaginationChange={(page, pageSize) =>
          setPagination({pageNumber: page, pageSize})
        }
        totalRowCount={data?.count}
        exportButton
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
