import {IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {specialneedsApi} from 'lib/api/specialneeds'
import {venuesApi} from 'lib/api/venues'
import {useStore} from 'lib/store/store'
import {get} from 'lodash'
import router from 'next/router'
import {redirectGuest} from 'pages/_app'
import React from 'react'
import {
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiMap2Fill,
  RiUserLocationFill,
} from 'react-icons/ri'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'

export default function ModelList() {
  const {specialneeds: dataModel, rehydrateSpecialNeeds: rehydrater} = useStore(
    ({specialneeds, rehydrateSpecialNeeds}) => ({
      specialneeds,
      rehydrateSpecialNeeds,
    }),
    shallow,
  )

  console.log('mainCategories', dataModel)

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)

  const rehydrateData = async () => {
    try {
      await rehydrater()
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {
    rehydrateData()
  }, [])

  const defaultRowConfig = {
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  } as GridColDef

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', flex: 1, headerAlign: "left", align: "left", },

    {
      ...defaultRowConfig,
      field: 'image',
      headerName: 'Image',
      renderCell: ({row}) => (
        <div className="rounded-xl h-12 w-24 overflow-hidden flex justify-center items-center">
          {get(
            row,
            theme.palette.mode == 'dark' ? 'image.dark' : 'image.light',
            false,
          ) ? (
            <div className="h-full w-full">
              <img
                style={{
                  objectFit: 'cover',
                }}
                className="h-full w-full"
                src={get(
                  row,
                  `${
                    theme.palette.mode == 'dark' ? 'image.dark' : 'image.light'
                  }`,
                )}
              />
            </div>
          ) : (
            <div>N/A</div>
          )}
        </div>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'name',
      //   flex: 0.4,
      //h-12 w-24 overflow-hidden flex justify-center items-center
      headerName: 'Name',
      renderCell: ({row}) => (
        <div className="">
          {get(row, 'name.en', false) ? (
            //h-full w-full justify-center items-center py-4
            <div className="">
              <p>{get(row, `${'name.en'}`)}</p>
            </div>
          ) : (
            <div>N/A</div>
          )}
        </div>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'priority',
      flex: 0.4,
      headerName: 'Priority',
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
              pathname: '/special-needs/form/[model_id]',
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
            await specialneedsApi.delete(id)
            await rehydrater()
          } catch (e) {
            console.log(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <Table
        rows={
          (dataModel &&
            dataModel.map((model) => ({...model, id: model._id}))) ||
          []
        }
        columns={columns}
        loading={localLoading}
        tableSize="tabbed"
      />
    </div>
  )
}
