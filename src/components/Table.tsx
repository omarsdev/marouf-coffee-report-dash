import {LinearProgress} from '@mui/material'
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
  totalRowCount?: number
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
  totalRowCount, // Destructure totalRowCount
}: Props) {
  const handlePageChange = (newPage: number) => {
    if (onPaginationChange) {
      onPaginationChange(newPage, tableSizes[tableSize].rowCount)
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(0, newPageSize)
    }
  }

  return (
    <div>
      <div className="w-full flex items-start justify-between">
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
      </div>
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
            sx={{
              borderWidth: 0,
            }}
            rows={rows}
            getRowClassName={() => 'datagridx-row'}
            className="w-full"
            disableExtendRowFullWidth
            columns={columns}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
              Toolbar: () => (
                <>
                  {exportButton ? (
                    <DownloadCsvButton columns={columns} rows={rows} />
                  ) : (
                    []
                  )}
                </>
              ),
            }}
            loading={loading}
            pageSize={tableSizes[tableSize].rowCount}
            disableSelectionOnClick
            initialState={{
              pagination: {
                page: 0,
                pageSize: tableSizes[tableSize].rowCount,
              },
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            paginationMode="server"
            rowCount={totalRowCount}
            pagination
          />
        </div>
      </CustomContainer>
    </div>
  )
}
