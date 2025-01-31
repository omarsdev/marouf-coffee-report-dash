import {IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
import {useStore} from 'lib/store/store'
import {get} from 'lodash'
import router from 'next/router'
import {redirectGuest} from 'pages/_app'
import React from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'

export default function ModelList() {
  const {
    mainCategories: dataModel,
    rehydrateMainCategories: rehydrater,
  } = useStore(
    ({mainCategories, rehydrateMainCategories}) => ({
      mainCategories,
      rehydrateMainCategories,
    }),
    shallow,
  )

  const rows = [
    {
      created_at: '2023-05-28T18:41:37.136Z',
      description: {
        ar: '(من الصف الاول للصف الخامس)',
        en: '(from grade 1 to 5)',
      },
      image: {
        dark:
          'https://darsi.s3.amazonaws.com/darsi/1685299171817Group%20181COMP.png',
        light:
          'https://darsi.s3.amazonaws.com/darsi/1685299292509Group%20177%20%282%29COMP.png',
      },
      is_main_category: true,
      name: {ar: 'مرحلة التأسيس', en: 'Foundation Phase'},
      priority: 18,
      status: 'ACTIVE',
      type: 0,
      verified: true,
      __v: 0,
      id: '6473a061d682e100148c0584',
    },
    {
      created_at: '2023-05-28T18:41:37.136Z',
      description: {
        ar: '(من الصف الاول للصف الخامس)',
        en: '(from grade 1 to 5)',
      },
      image: {
        dark:
          'https://darsi.s3.amazonaws.com/darsi/1685299171817Group%20181COMP.png',
        light:
          'https://darsi.s3.amazonaws.com/darsi/1685299292509Group%20177%20%282%29COMP.png',
      },
      is_main_category: true,
      name: {ar: 'مرحلة التأسيس', en: 'Foundation Phase'},
      priority: 18,
      status: 'ACTIVE',
      type: 0,
      verified: true,
      __v: 0,
      id: '6473a061d682e900148c0584',
    },
  ]

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
        <div className="rounded-xl h-12 w-12 overflow-hidden flex justify-center items-center">
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
      field: 'priority',
      flex: 0.25,
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
              pathname: '/categories/form/[model_id]',
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
            await categoriesApi.delete(id)
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
