import {Box, TextField, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'

import router, {useRouter} from 'next/router'

import React, {useEffect, useRef} from 'react'
import {branchApi} from 'lib/api/branch'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import {ticketsApi} from 'lib/api/tickets'
import {addDays, format} from 'date-fns'
import CustomButton from 'components/CustomButton'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import CustomSelect from 'components/CustomSelect'
import {departmentsApi} from 'lib/api/departments'
import TextInput from 'components/TextInput'
import {CiSearch} from 'react-icons/ci'
import {toSearchQuery} from 'lib/utils'
import useStore from 'lib/store/store'
import {userApi} from 'lib/api/user'
import TransferDialog from './components/TransferDialog'
import CompleteDialog from './components/CompleteDialog'

export default function ModelList() {
  const {
    query: {departmentId, userId},
    isReady,
  } = useRouter()

  const theme = useTheme()
  const {user} = useStore()
  const isSearchingRef = useRef(false)
  const filterOptionsRef = useRef<any>({
    department: departmentId || '',
    user: userId || '',
  })

  const [localLoading, setLocalLoading] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [transferDialogOpen, setTransferDialogOpen] = React.useState(null)
  const [completeDialogOpen, setCompleteDialogOpen] = React.useState(null)

  const [filter, setFilter] = React.useState({
    start_date: null,
    end_date: null,
    department: departmentId || '',
    user: userId || '',
    branches: '',
    ticket_title: '',
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
        ? allPages?.length + 1
        : undefined
    },
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const {data: departments, isLoading: isLoadingDepartments} = useQuery<any>({
    queryFn: () => departmentsApi.get(),
    queryKey: ['departments'],
    select: (data) => {
      if (data && user?.role === 1) {
        const departmentsId = data?.departments?.find(
          (e) => e?.user?._id === user?._id,
        )?._id
        isSearchingRef.current = true
        filterOptionsRef.current = {
          department: departmentsId,
        }
      }
      return data
    },
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () => {
      return ticketsApi.get(
        filterOptionsRef.current
          ? toSearchQuery({
              ...filterOptionsRef.current,
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            })
          : toSearchQuery({
              pageNumber: pagination.pageNumber + 1,
              pageSize: pagination.pageSize,
            }),
      )
    },
    queryKey: ['tickets' + JSON.stringify(filterOptionsRef.current)],
    select: (data) => {
      // isSearchingRef.current = false
      // filterOptionsRef.current = {}
      return data
    },
    enabled: !isLoadingBranch && !isLoadingDepartments,
  })

  const defaultRowConfig = {
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  useEffect(() => {
    refetch()
  }, [JSON.stringify(pagination)])

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'ticket_title',
      headerName: 'Ticket Title',
      width: 150,
      renderCell: ({row}) => `${row.ticket_title}`,
      valueGetter: ({row}) => row.ticket_title,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'user.name.en',
      headerName: 'User',
      width: 150,
      renderCell: ({row}) => `${row.user?.name?.en}`,
      valueGetter: ({row}) => row.user?.name?.en,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'branch.name.en',
      headerName: 'Branch',
      width: 150,
      renderCell: ({row}) => `${row.branch?.name?.en}`,
      valueGetter: ({row}) => row.branch?.name?.en,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'department.department_name.en',
      headerName: 'Department',
      width: 150,
      renderCell: ({row}) =>
        `${
          row.area_manager?.name?.en
            ? row.area_manager?.name?.en
            : row.department?.department_name?.en
        }`,
      valueGetter: ({row}) =>
        row.area_manager?.name?.en
          ? row.area_manager?.name?.en
          : row.department?.department_name?.en,
      sortComparator: (v1, v2, row1, row2) => {
        return (row1.value || '').localeCompare(row2.value || '')
      },
    },
    {
      ...defaultRowConfig,
      field: 'status',
      headerName: 'Status',
      sortable: true,

      width: 150,
      valueGetter: ({row}) =>
        row.status === 0
          ? 'In Progress'
          : row.status === 2
          ? 'Transfer'
          : 'Completed',
      renderCell: ({row}) => (
        <span
          style={{
            backgroundColor:
              row.status === 0
                ? '#5F6EB9'
                : row.status === 2
                ? '#FFA500'
                : '#00BF29',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            paddingRight: '10px',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          {row.status === 0
            ? 'In Progress'
            : row.status === 2
            ? 'Transfered'
            : 'Completed'}
        </span>
      ),
    },

    {
      ...defaultRowConfig,
      field: 'created_at',
      headerName: 'Date',
      width: 100,
      renderCell: ({row}) =>
        `${format(new Date(row.created_at), 'dd/MM/yyyy')}`,
      valueGetter: ({row}) =>
        `${format(new Date(row.created_at), 'dd/MM/yyyy')}`,
      sortComparator: (v1, v2) =>
        new Date(v1 || 0).getDate() - new Date(v2 || 0).getDate(),
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
      disableExport: true,
      width: 250,
      renderCell: ({row}) => (
        <TableActionCell
          onEdit={() => {
            router.push({
              pathname: '/tickets/form/[model_id]',
              query: {model_id: row.id},
            })
          }}
          onDelete={() => {
            setDeleteDialogOpen(row.id)
          }}
          onTransfer={() => {
            setTransferDialogOpen(row.id)
          }}
          onComplete={() => {
            setCompleteDialogOpen(row.id)
          }}
        />
      ),
    },
  ]
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
            await ticketsApi.delete(id)
            await refetch()
          } catch (e) {
            console.error(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <TransferDialog
        isOpen={!!transferDialogOpen}
        handleClose={() => setTransferDialogOpen(null)}
        departments={departments}
        id={transferDialogOpen}
        refetch={refetch}
      />
      <CompleteDialog
        isOpen={!!completeDialogOpen}
        handleClose={() => setCompleteDialogOpen(null)}
        id={completeDialogOpen}
        refetch={refetch}
      />
      <Table
        rows={
          (data?.tickets &&
            data?.tickets?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        exportButton
        columns={columns}
        excelColumns={columns.filter((col) => col.field !== 'id')}
        loading={
          localLoading || isLoading || isLoadingBranch || isLoadingDepartments
        }
        pagination={pagination}
        tableSize="tabbed"
        onPaginationChange={(page, pageSize) =>
          setPagination({pageNumber: page, pageSize})
        }
        totalRowCount={data?.count}
        headerComponent={
          <Box
            flexDirection="row"
            display="flex"
            justifyContent={{xs: 'center', md: 'flex-end'}}
            gap="20px"
            alignItems="center"
            flexWrap={{xs: 'wrap', md: 'nowrap'}}
          >
            <Box
              flexDirection="row"
              display="flex"
              justifyContent={{xs: 'center', md: 'flex-end'}}
              gap="20px"
              alignItems="center"
            >
              <DesktopDatePicker
                label="From"
                value={filter.start_date}
                onChange={(value) => setFilter({...filter, start_date: value})}
                renderInput={(props) => <TextField {...props} />}
              />
              <DesktopDatePicker
                label="To"
                value={filter.end_date}
                onChange={(value) => setFilter({...filter, end_date: value})}
                renderInput={(props) => <TextField {...props} />}
              />
            </Box>
            {user?.role === 0 && (
              <CustomSelect
                id="user-select"
                options={userOptions}
                hasEmpty
                label="User"
                placeholder="User Name"
                className="w-full"
                value={filter.user}
                onChange={({target: {name, value}}) =>
                  setFilter({...filter, user: value})
                }
                padding={2}
                multiple={false}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                isLoading={isLoadingUsers}
              />
            )}
            {user?.role === 0 && (
              <CustomSelect
                id="bootstrap"
                options={departments?.departments?.map((department) => ({
                  label: department?.department_name?.en,
                  value: department._id,
                }))}
                hasEmpty
                label="Department"
                placeholder="Department"
                className="w-full"
                value={filter.department}
                onChange={({target: {name, value}}) =>
                  setFilter({...filter, department: value})
                }
                padding={2}
              />
            )}
            {user?.role === 0 && (
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
                value={filter.branches}
                onChange={({target: {name, value}}) =>
                  setFilter({...filter, branches: value})
                }
                padding={2}
              />
            )}
            <TextInput
              label="Search by Name"
              className="w-full"
              value={filter.ticket_title}
              onChange={(value) => setFilter({...filter, ticket_title: value})}
              padding={2}
              query={true}
            />
            <CustomButton
              onClick={async () => {
                try {
                  setLocalLoading(true)
                  isSearchingRef.current = true
                  filterOptionsRef.current = {
                    ...(filterOptionsRef.current && filterOptionsRef.current),
                    ...filter,
                    start_date: filter?.start_date
                      ? format(filter?.start_date, 'yyyy/MM/dd') + 'Z'
                      : null,
                    end_date: filter.end_date
                      ? format(
                          addDays(new Date(filter.end_date), 1),
                          'yyyy/MM/dd',
                        ) + 'Z'
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
