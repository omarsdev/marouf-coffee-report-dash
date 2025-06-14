import {Box, LinearProgress} from '@mui/material'
import {DataGrid, GridOverlay} from '@mui/x-data-grid'
import CustomContainer from 'components/CustomContainer'
import DownloadCsvButton from 'components/DownloadCsvButton'
import React from 'react'

interface Props {
  columns: any
  rows: any
  tableSize?: 'regular' | 'tabbed'
  loading?: boolean
  headerComponent?: React.ReactNode
  exportButton?: boolean
  onPaginationChange?: (page: number, pageSize: number) => void
  pagination?: {pageNumber: number; pageSize: number}
  totalRowCount?: number
  hideFooterPagination?: boolean
  excelColumns?: any
}

const tableSizes = {
  regular: {
    tableHeight: 670,
    rowCount: 8,
  },
  tabbed: {
    tableHeight: 520,
    rowCount: 10,
  },
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{position: 'absolute', top: 0, width: '100%'}}>
        <LinearProgress />
      </div>
    </GridOverlay>
  )
}

export default function Table({
  columns,
  rows,
  tableSize = 'regular',
  loading,
  headerComponent,
  exportButton,
  onPaginationChange,
  totalRowCount,
  hideFooterPagination = false,
  pagination,
  excelColumns,
}: Props) {
  const handlePageChange = (newPage: number) => {
    if (onPaginationChange) {
      onPaginationChange(
        newPage,
        pagination?.pageSize ?? tableSizes[tableSize].rowCount,
      )
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(0, newPageSize)
    }
  }

  return (
    <div>
      <Box
        className="w-full flex items-start justify-end"
        sx={{paddingY: '10px'}}
      >
        {/* <div>
                    <CustomLabel
                        size='bigTitle'
                    >
                        {title}
                    </CustomLabel>
                    <CustomLabel
                        padding={4}
                        size='normal'
                    >
                        {description}
                    </CustomLabel>
                </div> */}
        {exportButton ? (
          <DownloadCsvButton columns={excelColumns ?? columns} rows={rows} />
        ) : (
          <></>
        )}
      </Box>
      <CustomContainer
        style={{
          pt: 1,
          pl: 4,
          pr: 4,
          '& .MuiDataGrid-columnHeaders': {
            borderWidth: 0,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            // bgcolor: 'red',
            fontWeight: '600',
          },
          '& .MuiDataGrid-iconSeparator': {
            color: 'divider',
          },
          '& .datagridx-row': {
            bgcolor: (theme) =>
              theme.palette.mode == 'dark' ? '#292929' : 'background.default',
            mb: 2,
            borderWidth: 0,
            pl: 2,
            borderRadius: 2,
            '&:hover': {
              // bgcolor: 'red',
              borderWidth: 0,
            },
            '& .MuiDataGrid-cell': {
              // bgcolor: 'red',
              borderWidth: 0,
              '& ::focus': {
                border: 'none',
                outline: 'none',
              },
            },
          },
        }}
        className="w-full"
        radius="medium"
      >
        {headerComponent && headerComponent}
        <div
          className="w-full"
          style={{height: tableSizes[tableSize].tableHeight}}
        >
          <DataGrid
            rows={rows}
            sx={{
              borderWidth: 0,
            }}
            getRowClassName={() => 'datagridx-row'}
            className="w-full"
            disableExtendRowFullWidth
            columns={columns}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
            loading={loading}
            pageSize={pagination?.pageSize ?? tableSizes[tableSize].rowCount}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageSizeChange={handlePageSizeChange}
            initialState={{
              pagination: {
                page: 0,
                pageSize: 10,
              },
            }}
            onPageChange={handlePageChange}
            paginationMode="server"
            rowCount={totalRowCount}
            pagination
            hideFooterPagination={hideFooterPagination}
          />
        </div>
      </CustomContainer>
    </div>
  )
}
