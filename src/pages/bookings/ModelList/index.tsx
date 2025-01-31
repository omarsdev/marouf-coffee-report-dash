import {IconButton, useTheme} from '@mui/material'
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
import {booksApi} from 'lib/api/books'
import moment from 'moment'
import {MOMENT_JORDAN} from 'lib/timezone'

export const BOOK_STATUSES = [
  'Pending',
  'Confirmed',
  'Checked In',
  'In Progress',
  'Completed',
  'Cancelled',
  'Blocked',
]

export const BOOK_STATUSES_COLORS = [
  'blue',
  'green',
  'violet',
  'blue',
  'green',
  'red',
  'cyan',
] as Array<string>

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
        let {book} = (await booksApi.getByEntity({entity: query})) as any
        setDataModel(book)
        resolve(book)
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
      field: 'booking_number',
      headerName: 'Booking No.',
      renderCell: ({row}) => (
        <div className="tracking-widest">{`${row.booking_number}`}</div>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'status',
      headerName: 'Status',
      renderCell: ({row}) => (
        <div
          className="px-2 py-1 rounded-md"
          style={{
            backgroundColor: BOOK_STATUSES_COLORS[row.status],
            color: 'white',
          }}
        >
          {BOOK_STATUSES[row.status]}
        </div>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'time_start',
      headerName: 'Booking Date & Time',
      flex: 2,
      renderCell: ({row}) => (
        <div>
          {MOMENT_JORDAN(row.time_start).format('LL')} |{' '}
          {MOMENT_JORDAN(row.time_start).format('hh:mm A')} -{' '}
          {MOMENT_JORDAN(row.time_end).format('hh:mm A')}
        </div>
      ),
    },
    {
      ...defaultRowConfig,
      field: 'service',
      headerName: 'English Position',
      renderCell: ({row}) => `${row.entity?.description?.en ?? 'N/A'}`,
    },
    {
      ...defaultRowConfig,
      field: 'entity',
      headerName: 'Staff',
      renderCell: ({row}) => `${row.entity?.title?.en}`,
    },
    {
      ...defaultRowConfig,
      field: 'total_price',
      headerName: 'Total Price',
      renderCell: ({row}) => `${row.total_price}`,
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
