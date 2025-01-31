import {Button, Card, IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import TableLocationCell from 'components/TableLocationCell'
import TableToggleSwitch from 'components/TableToggleSwitch'
import TableUserCell from 'components/TableUserCell'
import request from 'lib/api'
import {categoriesApi} from 'lib/api/categories'
import {staffApi} from 'lib/api/staff'
import {venuesApi} from 'lib/api/venues'
import {useStore} from 'lib/store/store'
import {get} from 'lodash'
import router, {useRouter} from 'next/router'
import {initializeRequest, redirectGuest} from 'pages/_app'
import React, {useState} from 'react'
import {
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiMap2Fill,
  RiUserLocationFill,
} from 'react-icons/ri'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'
import cookiecutter from 'cookie-cutter'
import CustomButton from 'components/CustomButton'
import ResetPassDialog from 'components/ResetPassDialog'
import TextInput from 'components/TextInput'
import CustomContainer from 'components/CustomContainer'
import _ from 'lodash'

export default function ModelList({query, setLoading}) {
  console.log('MODELIST STAFF QUERY', query)
  // const { mainCategories: dataModel, rehydrateMainCategories: rehydrater } = useStore(({ mainCategories, rehydrateMainCategories }) => ({ mainCategories, rehydrateMainCategories }), shallow)

  const [dataModel, setDataModel] = useState<any>(null)

  const rehydrater = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true)
        let company = cookiecutter.get('company')
        let token = cookiecutter.get('token')
        await initializeRequest({company, token})
        let {teachersWithSpecialNeeds} =
          (await staffApi.specialneedsStaff()) as any
        setDataModel(teachersWithSpecialNeeds)
        resolve(teachersWithSpecialNeeds)
      } catch (e) {
        reject(e)
      } finally {
        setLoading(false)
      }
    })
  }

  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const [resetPassDialogOpen, setResetPassDialogOpen] = React.useState(null)

  const rehydrateData = async () => {
    try {
      await rehydrater()
    } catch (e) {
      console.log('ERROR', e)
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
      flex: 0.5,
      headerName: 'Image',
      renderCell: ({row}) => (
        <div className="rounded-full h-12 w-12 overflow-hidden flex justify-center items-center">
          {get(row, 'image', false) ? (
            <div className="h-full w-full">
              <img
                style={{
                  objectFit: 'cover',
                }}
                className="h-full w-full"
                src={get(row, `${'image'}`)}
              />
            </div>
          ) : (
            <div>N/A</div>
          )}
        </div>
      ),
    },
    // {
    //   ...defaultRowConfig,
    //   field: 'title.en',
    //   headerName: 'English Name',
    //   renderCell: ({row}) => `${row.title?.en}`,
    // },
    {
      ...defaultRowConfig,
      field: 'title.ar',
      headerName: 'Arabic Name',
      renderCell: ({row}) => `${row.title?.ar}`,
    },
    // {
    //   ...defaultRowConfig,
    //   field: 'description.en',
    //   headerName: 'English Position',
    //   renderCell: ({row}) => `${row.description?.en}`,
    // },
    {
      ...defaultRowConfig,
      field: 'description.ar',
      headerName: 'Arabic Position',
      renderCell: ({row}) => `${row.description?.ar}`,
    },
    {
      ...defaultRowConfig,
      field: 'has_special_needs',
      headerName: 'Special Needs Ability',
      flex: 0.75,
      renderCell: ({row}) => `${row.has_special_needs}`,
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
              pathname: '/staff/form/[model_id]',
              query: {
                model_id: query + '___' + row.id,
              },
            })
          }}
          onReset={() => {
            setResetPassDialogOpen(row.id)
          }}
          onDelete={() => {
            setDeleteDialogOpen(row.id)
          }}
        />
      ),
    },
    {
      ...defaultRowConfig,
      field: 'open',
      headerName: '',
      description: '',
      sortable: false,
      flex: 1.5,
      renderCell: ({row}) => (
        <div className="flex">
          <TableUserCell
            onBookingPress={() =>
              router.push({
                pathname: '/bookings/[entity]',
                query: {entity: row.id},
              })
            }
            onPress={() =>
              router.push({
                pathname: '/staff/[venue]',
                query: {venue: row.id},
              })
            }
            onAccountingPress={() =>
              router.push({
                pathname: '/account/[venue]',
                query: {venue: row.id},
              })
            }
          />
          <div className="ml-4">
            <TableLocationCell
              onPress={() => {
                row?.user_location
                  ? window.open(
                      'https://maps.google.com/?q=' +
                        row?.user_location?.lat +
                        ',' +
                        row?.user_location?.lng,
                    )
                  : null
              }}
            />
          </div>
        </div>
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
            await staffApi.delete(id)
            await rehydrater()
          } catch (e) {
            console.log(e)
          } finally {
            setLocalLoading(false)
          }
        }}
      />
      <ResetPassDialog
        isOpen={!!resetPassDialogOpen}
        handleClose={() => setResetPassDialogOpen(null)}
        deleteCallback={async () => {
          try {
            setLocalLoading(true)
            let id = resetPassDialogOpen
            setResetPassDialogOpen(null)
            await staffApi.resetPassword(id)
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
