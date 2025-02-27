import {Box, LinearProgress} from '@mui/material'
import {DataGrid, GridOverlay} from '@mui/x-data-grid'
import React from 'react'
import CustomButton from './CustomButton'
import CustomContainer from './CustomContainer'
import {FaDownload} from 'react-icons/fa'
import DownloadCsvButton from './DownloadCsvButton'

interface Props {
  columns
  rows
  tableSize?: 'regular' | 'tabbed'
  loading?
  headerComponent?
  exportButton?: boolean
}

const tableSizes = {
  regular: {
    tableHeight: 670,
    rowCount: 8,
  },
  tabbed: {
    tableHeight: 520,
    rowCount: 6,
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
}: Props) {
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
              Toolbar: () =>
                exportButton ? (
                  <DownloadCsvButton columns={columns} rows={rows} />
                ) : (
                  <></>
                ),
            }}
            loading={loading}
            pageSize={tableSizes[tableSize].rowCount}
            disableSelectionOnClick

            // initialState={{
            //   pagination: {
            //     paginationModel: {page: 0, pageSize: 5},
            //   },
            // }}
          />
        </div>
      </CustomContainer>
    </div>
  )
}
