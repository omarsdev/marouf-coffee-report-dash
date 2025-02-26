import {Box} from '@mui/material'
import React from 'react'
import CustomButton from './CustomButton'
import {FaFileDownload} from 'react-icons/fa'

function exportCsv(rows, columns) {
  const csvContent = []
  csvContent.push(columns.map((col) => col.headerName).join(','))
  rows.forEach((row) => {
    const rowData = columns.map((col) => {
      const value = col.valueGetter ? col.valueGetter({row}) : row[col.field]
      return `"${value}"`
    })
    csvContent.push(rowData.join(','))
  })
  const csvString = '\uFEFF' + csvContent.join('\n')
  const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'})

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'exported_data.csv'
  link.click()
}

interface DownloadCsvButtonProps {
  rows: any
  columns: any
}
const DownloadCsvButton = ({columns, rows}: DownloadCsvButtonProps) => {
  return (
    <Box
      flexDirection="row"
      display="flex"
      justifyContent="flex-end"
      gap="20px"
      alignItems="center"
    >
      <CustomButton
        title={'Export Csv'}
        startIcon={<FaFileDownload />}
        onClick={() => exportCsv(rows, columns)}
      />
    </Box>
  )
}

export default DownloadCsvButton
