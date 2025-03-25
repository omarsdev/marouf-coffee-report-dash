import {Box, IconButton, TextField, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router, {useRouter} from 'next/router'
import React, {useEffect, useRef} from 'react'
import {branchApi} from 'lib/api/branch'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import {schedulesApi} from 'lib/api/schedules'
import {format} from 'date-fns'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import CustomButton from 'components/CustomButton'
import {CiSearch} from 'react-icons/ci'
import {calculateYesPercentage, toSearchQuery} from 'lib/utils'
import CustomSelect from 'components/CustomSelect'
import {userApi} from 'lib/api/user'

export default function ModelList() {
  const theme = useTheme()
  const isSearchingRef = useRef(false)
  const filterOptionsRef = useRef({})
  const router = useRouter()
  const isReady = router.isReady

  const [localLoading, setLocalLoading] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const [filter, setFilter] = React.useState({
    date: null,
    userId: null,
    branch: '',
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      schedulesApi.get(
        isSearchingRef.current
          ? toSearchQuery({
              ...filterOptionsRef.current,
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            })
          : toSearchQuery({
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            }),
      ),
    queryKey: ['schedules'],
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
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
      field: 'userId.name.en',
      headerName: 'Username',
      renderCell: ({row}) => `${row.userId?.name?.en}`,
      valueGetter: ({row}) => row.userId?.name?.en,

      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      flex: 0,
      field: 'branch.name.en',
      headerName: 'Branch',
      width: 250,
      renderCell: ({row}) => `${row.branch?.name?.en}`,
      valueGetter: ({row}) => row.branch?.name?.en,

      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'dueDate',
      headerName: 'Date',
      valueGetter: ({row}) => row.assignedAt,
      renderCell: ({row}) =>
        `${format(new Date(row.assignedAt), 'dd/MM/yyyy')}`,
      sortComparator: (v1, v2) =>
        new Date(v1 || 0).getDate() - new Date(v2 || 0).getDate(),
    },
    {
      ...defaultRowConfig,
      field: 'reportId.title',
      headerName: 'Report',
      renderCell: ({row}) => `${row.reportId?.title}`,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'completed',
      headerName: 'Status',
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => (
        <span
          style={{
            backgroundColor: !row.completed ? '#5F6EB9' : '#00BF29',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            paddingRight: '10px',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          {row.completed ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'answers',
      headerName: 'Answers',
      valueGetter: ({row}) => calculateYesPercentage(row?.submission?.answers),

      sortComparator: (v1, v2, row1, row2) => {
        return (v1 || 0) - (v2 || 0)
      },
      renderCell: ({row}) => (
        <div>
          {calculateYesPercentage(row?.submission?.answers ?? undefined)} %
        </div>
      ),
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
          // onEdit={() => {
          //   router.push({
          //     pathname: '/schedules/form/[model_id]',
          //     query: {model_id: row.id},
          //   })
          // }}
          onDelete={() => {
            setDeleteDialogOpen(row.id)
          }}
          onView={() => {
            router.push({
              pathname: '/schedules/info/[model_id]',
              query: {model_id: row.assignmentId},
            })
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
            await schedulesApi.delete(id)
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
          (data?.assignments &&
            data?.assignments?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading || isLoading || isLoadingBranch}
        pagination={pagination}
        onPaginationChange={(page, pageSize) =>
          setPagination({pageNumber: page, pageSize})
        }
        totalRowCount={data?.count}
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
              label="Date"
              value={filter.date}
              onChange={(value) => {
                setFilter((old) => ({
                  ...old,
                  date: format(value, 'yyyy/MM/dd'),
                }))
              }}
              renderInput={(props) => <TextField {...props} />}
            />
            <CustomSelect
              id="bootstrap"
              options={branches?.branches?.map((branch) => ({
                label: branch?.name?.en,
                value: branch._id,
              }))}
              inputProps={{
                default: '1',
              }}
              hasEmpty
              label="Branch"
              placeholder="Branch"
              className="w-full"
              value={filter.branch}
              onChange={({target: {name, value}}) =>
                setFilter((old) => ({...old, branch: value}))
              }
              padding={2}
            />
            <CustomSelect
              id="user-select"
              options={userOptions}
              label="User"
              className="w-full"
              onChange={({target: {value}}) =>
                setFilter((old) => ({...old, userId: value}))
              }
              value={filter.userId}
              padding={2}
              multiple={false}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              isLoading={isLoadingUsers}
              hasEmpty={true}
            />
            <CustomButton
              onClick={async () => {
                try {
                  setLocalLoading(true)
                  isSearchingRef.current = true
                  filterOptionsRef.current = {
                    ...(filterOptionsRef.current && filterOptionsRef.current),
                    ...filter,
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
