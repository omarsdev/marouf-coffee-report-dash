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
  const areaMangerName = query.areaMangerName
  const answers = query.answers

  console.log({areaMangerName, answers})

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

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
        return {note: data?.note ?? '', image: data?.image ?? ''}
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

  const excelColumns: GridColDef[] = [
    ...columns,
    {
      field: 'answers',
      headerName: 'answers percentage',
      renderCell: () => answers + '%',
      valueGetter: () => answers + '%',
    },
    {
      field: 'name',
      headerName: 'area Manger Name',
      renderCell: () => areaMangerName,
      valueGetter: () => areaMangerName,
    },

    {
      field: 'date',
      headerName: 'Date',
      renderCell: () =>
        submittedAt
          ? format(new Date(submittedAt), 'yyyy/MM/dd')
          : 'Invalid time',
      valueGetter: () => areaMangerName,
    },
    {
      field: 'branch',
      headerName: 'Branch',
      renderCell: () => data?.submission?.check?.branch?.name?.en,
      valueGetter: () => data?.submission?.check?.branch?.name?.en,
    },
    {
      field: 'inside',
      headerName: ' Inside/Outside Branch:',
      renderCell: () =>
        data?.submission?.check?.in_range
          ? 'Inside locaiton'
          : 'Outside locaiton',
      valueGetter: () =>
        data?.submission?.check?.in_range
          ? 'Inside locaiton'
          : 'Outside locaiton',
    },
    {
      field: 'checkIn',
      headerName: 'checkIn',
      renderCell: () =>
        time_start ? format(new Date(time_start), 'p') : 'Invalid Date',
      valueGetter: () =>
        time_start ? format(new Date(time_start), 'p') : 'Invalid Date',
    },
    {
      field: 'checkOut',
      headerName: 'checkOut',
      renderCell: () =>
        time_end ? format(new Date(time_end), 'p') : 'Invalid Date',
      valueGetter: () =>
        time_end ? format(new Date(time_end), 'p') : 'Invalid Date',
    },
  ]

  return (
    <div>
      <div className="-mt-10 mb-6 flex-col gap-y-2">
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            Area Manger Name :
          </CustomLabel>
          {areaMangerName}
        </CustomLabel>
        <CustomLabel
          type="primary"
          size="normal"
          className="flex flex-row gap-2"
        >
          <CustomLabel type="primary" size="normal">
            Answers :
          </CustomLabel>
          {answers + '%'}
        </CustomLabel>
        <CustomLabel type="primary" size="normal">
          {data?.submission?.reportCopy?.title}
          {' : '}
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
          {time_start && time_end ? (
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
        excelColumns={excelColumns}
        hideFooterPagination
        exportButton
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
