import {Button, Card, IconButton, Tooltip, useTheme} from '@mui/material'
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
import React, {useEffect, useState} from 'react'
import shallow from 'zustand/shallow'
import {branchesApi} from '../../../lib/api/branches'
import cookiecutter from 'cookie-cutter'
import CustomButton from 'components/CustomButton'
// import * as XLSX from 'xlsx'
import ResetPassDialog from 'components/ResetPassDialog'
import TextInput from 'components/TextInput'
import CustomContainer from 'components/CustomContainer'
import _ from 'lodash'
import {CSVLink} from 'react-csv'
import {MdOutlineVerifiedUser} from 'react-icons/md'
import {GoUnverified} from 'react-icons/go'

export default function ModelList({query, setLoading}) {
  console.log('MODELIST STAFF QUERY', query)
  // const { mainCategories: dataModel, rehydrateMainCategories: rehydrater } = useStore(({ mainCategories, rehydrateMainCategories }) => ({ mainCategories, rehydrateMainCategories }), shallow)

  const [dataModel, setDataModel] = useState<any>(null)
  const [search, setSearch] = useState<any>('')

  const rehydrater = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true)
        let company = cookiecutter.get('company')
        let token = cookiecutter.get('token')
        await initializeRequest({company, token})
        const verified = null
        const queryVerified = 'verified=' + verified
        let {staff} = (await staffApi.search(queryVerified)) as any
        setDataModel(staff)
        resolve(staff)
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
  const [excelData, setExcelData] = React.useState([])

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
      field: 'title.ar1',
      headerName: 'Actions',
      renderCell: ({row}) => (
        <div className="flex">
          <Tooltip title="Verified">
            <IconButton
              sx={{
                ml: 2,
              }}
              onClick={() => {
                // setLoading(true)
                // staffApi
                //   .verifyStaff(row.id, true)
                //   .finally(() =>
                //     rehydrateSearchResults.current({query: search}),
                //   )
                router.push({
                  pathname: '/pending-staff/form/[model_id]',
                  query: {
                    model_id: query + '___' + row.id,
                  },
                })
              }}
            >
              <MdOutlineVerifiedUser />
            </IconButton>
          </Tooltip>
          <Tooltip title="UnVerified">
            <IconButton
              sx={{
                ml: 2,
              }}
              onClick={() => {
                // setLoading(true)
                // staffApi
                //   .verifyStaff(row.id, false)
                //   .finally(() =>
                //     rehydrateSearchResults.current({query: search}),
                //   )
                router.push({
                  pathname: '/pending-staff/form/[model_id]',
                  query: {
                    model_id: query + '___' + row.id,
                  },
                })
              }}
            >
              <GoUnverified />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ]

  // const downloadExcel = (data) => {
  //   const worksheet = XLSX.utils.json_to_sheet(data)
  //   const workbook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  //   //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //   //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  //   XLSX.writeFile(workbook, 'DataSheet.xlsx')
  // }

  const extractData = (data) => {
    // return data?.map((item) => ({
    //   titleAr: item.title.ar,
    //   titleEn: item.title.en,
    //   descriptionAr: item.description.ar,
    //   descriptionEn: item.description.en,
    //   subject_types: item.subject_types.join(', '),
    //   business_phone: item.business_phone,
    //   district: item.district,
    //   email: item.user?.email,
    // }))
    return data?.map((item) => [
      item.title?.ar,
      item.title?.en,
      item.description?.ar,
      item.description?.en,
      item.subject_types?.join(', '),
      item.business_phone,
      item.district,
      item.user?.email,
    ])
  }

  useEffect(() => {
    if (dataModel) {
      const dataArray = [dataModel]

      // Contains the column headers and table data in the required format for CSV
      const csvData = [
        [
          'Title (Arabic)',
          'Title (English)',
          'Description (Arabic)',
          'Description (English)',
          'Subject Types',
          'Business Phone',
          'District',
          'Email',
        ],
        ...extractData(dataArray[0]),
      ]
      setExcelData(csvData)
    }
  }, [dataModel])

  //  const csvData = [
  //    [
  //      'Title (Arabic)',
  //      'Title (English)',
  //      'Description (Arabic)',
  //      'Description (English)',
  //      'Subject Types',
  //      'Business Phone',
  //      'District',
  //      'Email',
  //    ],
  //    ...data.map(({id, name, username, email, phone, website}) => [
  //      id,
  //      name,
  //      username,
  //      email,
  //      phone,
  //      website,
  //    ]),
  //  ]

  // function exportToExcel(data) {
  //   // Create a new workbook
  //   const workbook = XLSX.utils.book_new()

  //   // Convert the data into an array of objects
  //   const dataArray = [data]
  //   console.log('DATA ARRAY', dataArray[0])

  //   // Flatten the nested objects (title and description)
  //   let excelData = extractData(dataArray[0])

  //   // Convert the flattened data to a worksheet
  //   const worksheet = XLSX.utils.json_to_sheet(excelData)

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')

  //   // Write the workbook to a file
  //   XLSX.writeFile(workbook, 'DarsiSheet.xlsx')
  // }

  // const handleSearch = async (value) => {
  //   try {
  //     setLoading(true)
  //     let company = cookiecutter.get('company')
  //     let token = cookiecutter.get('token')
  //     await initializeRequest({company, token})
  //     // let {staff} = (await staffApi.get(query, value)) as any
  //     // setDataModel(staff)
  //   } catch (e) {
  //     console.log('ERROR', e)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  function classifyString(input) {
    if (/^\d+$/.test(input)) {
      return `phone=${input}`
    } else if (input.includes('@')) {
      return `email=${input}`
    } else {
      return `name=${input}`
    }
  }

  const rehydrateSearchResults = React.useRef(
    _.throttle(
      async ({query}) => {
        try {
          setLoading(true)

          console.log('ARE YOU HERE', classifyString(query))
          const theQuery = classifyString(query)
          const verified = null
          const queryVerified = '&verified=' + verified

          const {entities} = (await staffApi.search(
            theQuery + queryVerified,
          )) as any
          setDataModel(entities)
        } catch (e) {
          console.log(e, `ERROR`)
        } finally {
          setLoading(false)
        }
      },
      1000,
      {trailing: true, leading: false},
    ),
  )

  React.useEffect(() => {
    rehydrateSearchResults.current({query: search})
  }, [search])

  return (
    <div className="pb-8">
      <CustomContainer
        // className="w-full p-5 mb-4"
        radius="medium"
        style={{
          width: '100%',
          padding: '1.25rem',
          marginBottom: '1rem',
        }}
      >
        <TextInput
          value={search}
          name="search"
          label="Search by name, phone or email"
          onChange={(_, v) => setSearch(v)}
        />
      </CustomContainer>
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

      <div className="flex w-full items-end justify-end mt-6 px-3">
        {/* <CustomButton
          onClick={() => {
            // exportToExcel(dataModel)
          }}
          mainButton
          title={'Export to Excel'}
        /> */}
        <CSVLink
          className="downloadbtn"
          filename="teachers.csv"
          data={excelData}
        >
          Export to excel
        </CSVLink>
      </div>
    </div>
  )
}
