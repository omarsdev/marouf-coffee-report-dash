import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import FormBottomWidget from 'components/FormBottomWidget'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import {checklistApi} from 'lib/api/checklist'
import {branchApi} from 'lib/api/branch'
import {schedulesApi} from 'lib/api/schedules'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import {eachDayOfInterval, format, parseISO} from 'date-fns'
import DateRangePicker from 'components/DateRangePicker'
import {DAYS_OF_WEEK} from 'lib/constants'
import DayToggleButton from 'components/DayToggleButton'
import {toSearchQuery} from 'lib/utils'
import CustomAutocomplete from 'components/CustomAutoComplete'

export default function SchedulesForm({setLoading}) {
  const [backendError, setBackendError] = React.useState<string>('')
  const [calenderData, setCalenderData] = React.useState<{
    fromDate: Date
    toDate: Date
    days: number[]
    repeat: boolean
    individueleDate: Date
  }>({
    fromDate: new Date(),
    toDate: new Date(),
    days: [],
    repeat: false,
    individueleDate: new Date(),
  })

  const {isReady} = useRouter()
  const selectedDays = React.useMemo(() => {
    const {fromDate, toDate, days, repeat, individueleDate} = calenderData
    const start = new Date(fromDate)
    const end = new Date(toDate)

    if (repeat && start < end) {
      return eachDayOfInterval({start, end})
        .filter((date) => days.includes(Number(date.getDay())))
        .map((date) => format(date, 'yyyy-MM-dd'))
    } else if (!repeat && individueleDate) {
      return [format(individueleDate, 'yyyy-MM-dd')]
    } else return []
  }, [calenderData])

  const {data: reports, isLoading: isLoadingReports} = useQuery<any>({
    queryFn: () => checklistApi.get(),
    queryKey: ['checklist'],
  })

  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    enabled: isReady,
    queryFn: async ({pageParam = 1}) => {
      try {
        const response: any = await userApi.get(
          toSearchQuery({pageNumber: pageParam, pageSize: 20}),
        )
        return response?.users ? response : {users: [], count: 0}
      } catch (error) {
        console.error('API Error:', error)
        return {users: [], count: 0}
      }
    },
    queryKey: ['users', isReady],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.users)) return undefined
      const totalFetched = allPages.reduce(
        (sum, page) => sum + (page?.users?.length || 0),
        0,
      )
      return totalFetched < (lastPage?.count || 0)
        ? allPages.length + 1
        : undefined
    },
  })

  const userOptions = React.useMemo(() => {
    return (
      usersData?.pages.flatMap((page: any) =>
        page.users.map((user) => ({
          label: user.name?.en,
          value: user._id,
        })),
      ) || []
    )
  }, [usersData])

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const submitCreate = async () => {
    const payload = {
      ...values,
      assignmentDates: selectedDays,
      from: undefined,
      to: undefined,
      branches: values?.branches?.map((i) => i.value),
    }
    try {
      setLoading(true)
      await schedulesApi.create(payload)
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeCalender = (path: string, value: any) => {
    setCalenderData({...calenderData, [path]: value})
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {},
    // validationSchema:
    onSubmit: submitCreate,
  })

  useEffect(() => {
    setLoading(isLoadingReports || isLoadingBranch)
  }, [isLoadingReports, isLoadingBranch])

  return (
    <Layout
      meta={{
        title: 'Add Schedules',
      }}
    >
      <CustomLabel size="bigTitle">{'Add Schedules'}</CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {'Create a new Schedules'}
      </CustomLabel>

      <CustomContainer
        style={{
          overflow: 'hidden',
        }}
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        <CustomSelect
          id="bootstrap"
          options={reports?.reports?.map((question) => ({
            label: question?.title,
            value: question?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          value={values.reports || []}
          label="reports"
          helperText="Choose reports"
          className="w-full"
          // onChange={({target: {name, value}}) =>
          //   handleChange('reportId', value)
          // }
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('reports', newValue)
          }}
          padding={3}
          multiple={true}
        />

        <CustomSelect
          id="user-select"
          options={userOptions}
          value={values.userId}
          label="User"
          helperText="Choose User"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('userId', value)}
          padding={2}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoadingUsers}
        />

        <CustomAutocomplete
          id="bootstrap"
          options={branches?.branches?.map((branch) => ({
            label: branch?.name?.en,
            value: branch?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          value={values.branches || []}
          label="Branch"
          helperText="Choose branch"
          className="w-full"
          // onChange={({target: {name, value}}) => handleChange('userId', value)}
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('branches', newValue)
          }}
          padding={2}
          multiple={true}
        />

        <Box mb={2}>
          <FormControlLabel
            control={
              <Switch
                checked={calenderData.repeat}
                onChange={() =>
                  handleChangeCalender('repeat', !calenderData.repeat)
                }
                name="repeat"
              />
            }
            label="Repeat"
          />
        </Box>

        {calenderData.repeat ? (
          <>
            <DateRangePicker
              values={calenderData}
              handleChange={handleChangeCalender}
            />
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Repeat on:
              </Typography>
              <ToggleButtonGroup
                value={calenderData.days}
                onChange={(_, days) => handleChangeCalender('days', days)}
                size="small"
                color="primary"
                className="flex gap-2"
              >
                {DAYS_OF_WEEK.map(({label, value}) => (
                  <DayToggleButton label={label} value={value} />
                ))}
              </ToggleButtonGroup>
            </Box>
          </>
        ) : (
          <DesktopDatePicker
            label="Individual Date"
            value={calenderData.individueleDate}
            onChange={(value) => handleChangeCalender('individueleDate', value)}
            renderInput={(props) => <TextField fullWidth {...props} />}
          />
        )}

        <Error backendError={backendError} />

        <FormBottomWidget
          isEdit={false}
          onSubmit={() => {
            handleSubmit()
          }}
        />
      </CustomContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
