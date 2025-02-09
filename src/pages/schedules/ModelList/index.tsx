import {Box, IconButton, TextField, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
import useStore from 'lib/store/store'
import {get} from 'lodash'
import router from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useRef} from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'
import {branchApi} from 'lib/api/branch'
import {useQuery} from '@tanstack/react-query'
import {schedulesApi} from 'lib/api/schedules'
import {format} from 'date-fns'
import {DesktopDatePicker} from '@mui/x-date-pickers'
import CustomButton from 'components/CustomButton'
import {CiSearch} from 'react-icons/ci'
import {toSearchQuery} from 'lib/utils'
import CustomSelect from 'components/CustomSelect'

export default function ModelList() {
  const theme = useTheme()
  const isSearchingRef = useRef(false)
  const filterOptionsRef = useRef({})

  const [localLoading, setLocalLoading] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [filter, setFilter] = React.useState({
    date: null,
    branch: '',
  })

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      schedulesApi.get(
        isSearchingRef.current ? toSearchQuery(filterOptionsRef.current) : '',
      ),
    queryKey: ['schedules'],
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    {
      ...defaultRowConfig,
      field: 'branch.area_manager.name.en',
      headerName: 'Username',
      renderCell: ({row}) => `${row.branch?.area_manager?.name?.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'branch.name.en',
      headerName: 'Branch',
      renderCell: ({row}) => `${row.branch?.name?.en}`,
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
      field: 'reportId.title',
      headerName: 'Report',
      renderCell: ({row}) => `${row.reportId?.title}`,
    },
    {
      ...defaultRowConfig,
      field: 'completed',
      headerName: 'Status',
      renderCell: ({row}) => `${row.completed ? 'Completed' : 'In Progress'}`,
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
              pathname: '/schedules/form/[model_id]',
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
                console.log(format(value, 'yyyy/MM/dd'))
                setFilter({
                  ...filter,
                  date: format(value, 'yyyy/MM/dd'),
                })
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
                setFilter({...filter, branch: value})
              }
              padding={2}
            />
            <CustomButton
              onClick={async () => {
                try {
                  setLocalLoading(true)
                  console.log(filter)
                  isSearchingRef.current = true
                  filterOptionsRef.current = {
                    ...filter,
                    ...filterOptionsRef.current,
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
