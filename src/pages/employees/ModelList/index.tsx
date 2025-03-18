import {Box, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import router from 'next/router'
import React, {useEffect, useRef} from 'react'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import CustomSelect from 'components/CustomSelect'
import CustomButton from 'components/CustomButton'
import {CiSearch} from 'react-icons/ci'
import {toSearchQuery} from 'lib/utils'
import {format} from 'date-fns'
import {branchApi} from 'lib/api/branch'
import TextInput from 'components/TextInput'
import TruncatedText from 'components/TranchedText'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const filterOptionsRef = useRef(null)

  const [filter, setFilter] = React.useState({
    role: null,
    name: null,
    role_type: null,
  })

  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      userApi.get(
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
      ),
    queryKey: ['users'],
  })
  const {data: branchesData, isLoading: branchesLoading} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })
  const branches = Array.isArray(branchesData?.branches)
    ? branchesData.branches
    : []

  const branchesMap = branches.reduce(
    (acc: Record<string, string>, branch: any) => {
      acc[branch._id] = branch.name?.en || 'Unknown' // Ensure safe access to name.en
      return acc
    },
    {},
  )

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
      field: 'name.en',
      headerName: 'English Name',
      renderCell: ({row}) => <TruncatedText text={row.name.en} />,
      valueGetter: ({row}) => row.name.en,
      sortComparator: (v1, v2, row1, row2) =>
        (row1.value || '').localeCompare(row2.value || ''),
    },
    {
      ...defaultRowConfig,
      field: 'name.ar',
      headerName: 'Arabic Name',
      renderCell: ({row}) => <TruncatedText text={row.name.ar} />,
      valueGetter: ({row}) => row.name.ar,
      sortComparator: (v1, v2, row1, row2) =>
        (row1.value || '').localeCompare(row2.value || ''),
    },
    {
      ...defaultRowConfig,
      field: 'email',
      headerName: 'Email',
      renderCell: ({row}) => `${row.email}`,
      sortable: false,
      hideSortIcons: true,
    },
    {
      ...defaultRowConfig,
      field: 'phone',
      headerName: 'Phone',
      renderCell: ({row}) => `${row.phone}`,
      sortable: false,
      hideSortIcons: true,
    },
    {
      // ...defaultRowConfig,
      field: 'time_started',
      headerName: 'Time Started',
      sortable: false,
      hideSortIcons: true,
      width: 100,
      renderCell: ({row}) =>
        row.active
          ? `${row.time_started ? format(new Date(row.time_started), 'p') : ''}`
          : '-',
    },
    {
      ...defaultRowConfig,
      field: 'active',
      headerName: 'Active',
      width: 100,
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => (
        <span
          style={{
            background: row.active ? 'green' : 'red',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            paddingRight: '10px',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          {row.active ? 'online' : 'offline'}
        </span>
      ),
    },
    {
      // ...defaultRowConfig,
      field: 'current_branch',
      headerName: 'Current Branch',
      width: 250,
      sortable: false,
      hideSortIcons: true,
      renderCell: ({row}) => (
        <>{row.active ? <>{branchesMap[row.current_branch]}</> : <>{'-'}</>}</>
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
          onEdit={() => {
            router.push({
              pathname: '/employees/form/[model_id]',
              query: {model_id: row.id},
            })
          }}
          onView={() =>
            router.push({
              pathname: '/employees/details/[model_id]',
              query: {model_id: row.id},
            })
          }
          onDelete={
            !row.deleted
              ? () => {
                  setDeleteDialogOpen(row.id)
                }
              : undefined
          }
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
            await userApi.delete(id)
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
          (data?.users &&
            data?.users?.map((model) => ({...model, id: model._id}))) ||
          []
        }
        onPaginationChange={(page, pageSize) =>
          setPagination({pageNumber: page, pageSize})
        }
        totalRowCount={data?.count}
        columns={columns}
        loading={localLoading || isLoading || branchesLoading}
        tableSize="tabbed"
        headerComponent={
          <Box
            flexDirection="row"
            display="flex"
            justifyContent="flex-end"
            gap="20px"
            alignItems="center"
          >
            <CustomSelect
              id="bootstrap"
              options={[
                {
                  label: 'area manager',
                  value: '2',
                },
                {
                  label: 'branch manager',
                  value: '3',
                },
                {
                  label: 'Quality control',
                  value: 'QC',
                },
              ]}
              inputProps={{
                default: '1',
              }}
              hasEmpty
              label="Role"
              placeholder="Role"
              className="w-full"
              value={filter.role || filter.role_type}
              onChange={({target: {name, value}}) =>
                setFilter((old) => ({
                  ...old,
                  role_type: null,
                  role: null,
                  [value === 'QC' ? 'role_type' : 'role']: value,
                }))
              }
              padding={2}
            />
            <TextInput
              label="Search by Name"
              className="w-full"
              value={filter.name}
              onChange={(value) => setFilter((old) => ({...old, name: value}))}
              padding={2}
              query={true}
            />
            <CustomButton
              onClick={async () => {
                try {
                  setLocalLoading(true)
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
