import {Box, TextField, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router, {useRouter} from 'next/router'
import React, {useRef} from 'react'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import CustomSelect from 'components/CustomSelect'
import CustomButton from 'components/CustomButton'
import {CiSearch} from 'react-icons/ci'
import {calculateYesPercentage, toSearchQuery} from 'lib/utils'
import {differenceInMinutes, endOfDay, format, addDays} from 'date-fns'
import {assignmentsApi} from 'lib/api/assignments'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import useForm from 'lib/hooks/useForm'
import {submissionsApi} from 'lib/api/submissions'

const getTimeDifference = (startedDate, endedDate) => {
  const diffInMinutes = differenceInMinutes(endedDate, startedDate)

  if (diffInMinutes >= 60) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${String(hours).padStart(2, '0')}:00 hr`
  } else {
    return `${String(diffInMinutes).padStart(2, '0')}:00 m`
  }
}

export default function ModelList() {
  const {
    query: {model_id},
  } = useRouter()
  const [localLoading, setLocalLoading] = React.useState(false)
  const filterOptionsRef = useRef(null)

  const {data, isLoading, refetch} = useQuery<any>({
    queryFn: () => {
      return submissionsApi.get(
        filterOptionsRef.current
          ? toSearchQuery({...filterOptionsRef.current, userId: model_id})
          : toSearchQuery({userId: model_id}),
      )
    },
    queryKey: ['submissions' + model_id],
  })

  const {values, handleChange} = useForm({
    initial: {
      from: null,
      to: null,
    },
    onSubmit: () => {},
  })

  console.log('values', values)

  const defaultRowConfig = {
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'row.reportCopy.title',
      headerName: 'Title',
      renderCell: ({row}) => row?.reportCopy?.title,
    },
    {
      ...defaultRowConfig,
      field: 'row.submittedAt',
      headerName: 'Submitted Date',
      width: 200,

      renderCell: ({row}) => format(new Date(row?.submittedAt), 'yyyy/MM/dd'),
    },
    {
      ...defaultRowConfig,
      field: 'userId.time_started',
      headerName: 'Time Started',
      width: 100,

      renderCell: ({row}) =>
        row?.check?.time_start
          ? format(new Date(row?.check?.time_start), 'p')
          : '-',
    },
    {
      ...defaultRowConfig,
      field: 'userId.time_ended',
      headerName: 'Time Ended',
      width: 100,
      renderCell: ({row}) =>
        row?.check?.time_end
          ? format(new Date(row?.check?.time_end), 'p')
          : '-',
    },
    {
      ...defaultRowConfig,
      field: 'timespent',
      headerName: 'Time Spent',
      width: 100,

      renderCell: ({row}) =>
        row?.check?.time_start && row?.check?.time_end
          ? getTimeDifference(
              new Date(row?.check?.time_start),
              new Date(row?.check?.time_end),
            )
          : '-',
    },
    {
      ...defaultRowConfig,
      field: 'row.check.branch.name.en',
      headerName: 'Branch',
      width: 250,

      renderCell: ({row}) => row?.check?.branch?.name?.en,
    },
    {
      ...defaultRowConfig,
      flex: 1,
      field: 'answers',
      headerName: 'Answers',
      renderCell: ({row}) => <div>{calculateYesPercentage(row.answers)} %</div>,
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
      width: 50,
      flex: 1,

      renderCell: ({row}) => (
        <TableActionCell
          onView={() =>
            router.push({
              pathname: '/submissions/[model_id]',
              query: {
                model_id: row.id,
                submittedAt: row.submittedAt,
                time_start: row.check.time_start,
                time_end: row.check.time_end,
              },
            })
          }
        />
      ),
    },
  ]

  return (
    <div>
      <Table
        rows={
          (data?.submissions &&
            data?.submissions?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading || isLoading}
        tableSize="tabbed"
        headerComponent={
          <Box
            flexDirection="row"
            display="flex"
            justifyContent="flex-end"
            gap="20px"
            alignItems="center"
          >
            <DesktopDatePicker
              label="From"
              value={values.from}
              onChange={(value) =>
                handleChange('from', format(value, 'yyyy/MM/dd'))
              }
              renderInput={(props) => <TextField {...props} />}
            />

            <DesktopDatePicker
              label="To"
              value={values.to}
              onChange={(value) =>
                handleChange('to', format(value, 'yyyy/MM/dd'))
              }
              renderInput={(props) => <TextField {...props} />}
            />

            <CustomButton
              onClick={async () => {
                try {
                  setLocalLoading(true)
                  filterOptionsRef.current = {
                    ...(filterOptionsRef.current && filterOptionsRef.current),
                    from: values?.from ? values?.from + 'Z' : null,
                    to: values.to
                      ? format(addDays(new Date(values.to), 1), 'yyyy/MM/dd') +
                        'Z'
                      : null,
                  }
                  await refetch()
                } catch (e) {
                  console.error(e)
                } finally {
                  setLocalLoading(false)
                }
              }}
              startIcon={<CiSearch />}
              width="10rem"
              title="Search"
            />
          </Box>
        }
      />
    </div>
  )
}
