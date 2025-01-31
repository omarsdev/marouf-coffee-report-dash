import {IconButton, useTheme} from '@mui/material'
import {GridColDef} from '@mui/x-data-grid'
import DeleteDialog from 'components/DeleteDialog'
import Table from 'components/Table'
import TableActionCell from 'components/TableActionCell'
import {categoriesApi} from 'lib/api/categories'
import {get} from 'lodash'
import router from 'next/router'
import {initializeRequest, redirectGuest} from 'pages/_app'
import React, {useState} from 'react'
import cookiecutter from 'cookie-cutter'
import {studentsApi} from 'lib/api/students'
import moment from 'moment'
import { CSVLink } from 'react-csv';

export default function ModelList({setLoading}) {
  const [dataModel, setDataModel] = useState<any>(null)
   const [excelData, setExcelData] = useState([]);

  const rehydrater = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true)
        let company = cookiecutter.get('company')
        let token = cookiecutter.get('token')
        await initializeRequest({company, token})
        let {users} = (await studentsApi.get()) as any
        setDataModel(users)

        // Prepare data for CSV
        const csvData = users.map((user) => ({
          Name: user.name,
          Email: user.email,
          Phone: user.phone,
          RegisteredAt: moment(user.created_at).format('DD/MM/YYYY')
        }))
        setExcelData(csvData)


        resolve(users)
      } catch (e) {
        reject(e)
      } finally {
        setLoading(false)
      }
    })
  }

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
    {
      ...defaultRowConfig,
      field: 'name',
      headerName: 'Name',
      renderCell: ({row}) => `${row.name}`,
    },
    {
      ...defaultRowConfig,
      field: 'email',
      headerName: 'Email Address',
      renderCell: ({row}) => `${row.email}`,
    },
    {
      ...defaultRowConfig,
      field: 'phone',
      headerName: 'Phone Number',
      renderCell: ({row}) => `${row.phone}`,
    },
    {
      ...defaultRowConfig,
      field: 'created_at',
      headerName: 'Registered At',
      renderCell: ({row}) => `${moment(row.created_at).format('DD/MM/YYYY')}`,
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
      <div className='flex w-full items-end justify-end mt-6 px-3'>
      <CSVLink
          className="downloadbtn"
          filename="students.csv"
          data={excelData}
        >
          Export to excel
        </CSVLink>
      </div>

    </div>
  )
}
