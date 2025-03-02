import {Box, TextField, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'

import router, {useRouter} from 'next/router'

import React, {useEffect, useRef} from 'react'
import {branchApi} from 'lib/api/branch'
import {useQuery} from '@tanstack/react-query'
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

export default function ModelList() {
  const {
    query: {departmentId, userId},
  } = useRouter()

  const theme = useTheme()
  const {user} = useStore()
  const isSearchingRef = useRef(false)
  const filterOptionsRef = useRef<any>({
    department: departmentId || '',
    user: userId || '',
  })

  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [filter, setFilter] = React.useState({
    start_date: null,
    end_date: null,
    department: departmentId || '',
    user: userId || '',
    branch: '',
    ticket_title: '',
  })

  const {data: usersData, isLoading: isLoadingUser} = useQuery<any>({
    queryFn: () => userApi.get(),
    queryKey: ['users'],
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
        filterOptionsRef.current ? toSearchQuery(filterOptionsRef.current) : '',
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
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'ticket_title',
      headerName: 'Ticket Title',
      renderCell: ({row}) => `${row.ticket_title}`,
    },
    {
      ...defaultRowConfig,
      field: 'branch.name.en',
      headerName: 'Branch',
      renderCell: ({row}) => `${row.branch?.name?.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'department.department_name.en',
      headerName: 'Department',
      renderCell: ({row}) =>
        `${
          row.area_manager?.name?.en
            ? row.area_manager?.name?.en
            : row.department?.department_name?.en
        }`,
    },
    {
      ...defaultRowConfig,
      field: 'status',
      headerName: 'Status',
      renderCell: ({row}) => (
        <span
          style={{
            backgroundColor: row.status === 0 ? '#5F6EB9' : '#00BF29',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            paddingRight: '10px',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          {row.status === 0 ? 'In Progress' : 'Completed'}
        </span>
      ),
    },

    {
      ...defaultRowConfig,
      field: 'created_at',
      headerName: 'Date',
      renderCell: ({row}) =>
        `${format(new Date(row.created_at), 'dd/MM/yyyy')}`,
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
              pathname: '/tickets/form/[model_id]',
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
            await ticketsApi.delete(id)
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
          (data?.tickets &&
            data?.tickets?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={
          localLoading || isLoading || isLoadingBranch || isLoadingDepartments
        }
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
            <CustomSelect
              id="bootstrap"
              options={usersData?.users?.map((user) => ({
                label: user?.name?.en,
                value: user._id,
              }))}
              hasEmpty
              label="User"
              placeholder="User Name"
              className="w-full"
              value={filter.user}
              onChange={({target: {name, value}}) =>
                setFilter({...filter, user: value})
              }
              padding={2}
            />
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
                className="w-full"
                value={filter.branch}
                onChange={({target: {name, value}}) =>
                  setFilter({...filter, branch: value})
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
