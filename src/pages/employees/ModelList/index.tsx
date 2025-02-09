import {Box, IconButton, useTheme} from '@mui/material'
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
import {userApi} from 'lib/api/user'
import CustomSelect from 'components/CustomSelect'
import CustomButton from 'components/CustomButton'
import {CiSearch} from 'react-icons/ci'
import {toSearchQuery} from 'lib/utils'

export default function ModelList() {
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const filterOptionsRef = useRef(null)

  const [filter, setFilter] = React.useState({
    role: null,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const {data, isLoading, isError, refetch} = useQuery<any>({
    queryFn: () =>
      userApi.get(
        filterOptionsRef.current ? toSearchQuery(filterOptionsRef.current) : '',
      ),
    queryKey: ['users'],
  })

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
      renderCell: ({row}) => `${row.name.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'name.ar',
      headerName: 'Arabic Name',
      renderCell: ({row}) => `${row.name.ar}`,
    },
    {
      ...defaultRowConfig,
      field: 'email',
      headerName: 'Email',
      renderCell: ({row}) => `${row.email}`,
    },
    {
      ...defaultRowConfig,
      field: 'phone',
      headerName: 'Phone',
      renderCell: ({row}) => `${row.phone}`,
    },
    {
      ...defaultRowConfig,
      field: 'active',
      headerName: 'Active',
      renderCell: ({row}) => `${row.active ? 'Active' : 'InActive'}`,
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
              ]}
              inputProps={{
                default: '1',
              }}
              hasEmpty
              label="Role"
              placeholder="Role"
              className="w-full"
              value={filter.role}
              onChange={({target: {name, value}}) =>
                setFilter({...filter, role: value})
              }
              padding={2}
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
