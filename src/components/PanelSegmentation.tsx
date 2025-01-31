import React from 'react'
import {Box, styled, Tab, TabProps, Tabs, Typography} from '@mui/material'
import CustomLabel from './CustomLabel'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const AntTabs = styled(Tabs)(({theme}) => ({
  border: 0,
  borderColor: theme.palette.divider,
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent',
  },
}))

const AntTab = styled((props) => <Tab disableRipple {...props} />)<TabProps>(
  ({theme}) => ({
    textTransform: 'capitalize',
    minWidth: 0,
    padding: 0,
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: ['Mulish, sans-serif'],
    // fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(3),

    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary,
      opacity: 1,
    },
    '&.Mui-selected': {
      color: theme.palette.primary,
      // fontWeight: theme.typography.fontWeightMedium,
    },
  }),
)

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            pt: 5,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

interface Props {
  panels
  teacher?
}

export default function PanelSegmentation({panels, teacher}: Props) {
  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <div className="flex justify-between">
        <div>
          <CustomLabel size="bigTitle">{panels[value].title}</CustomLabel>
          <CustomLabel size="normal">{panels[value].description}</CustomLabel>
        </div>
        {panels[value].button}
      </div>
      <Box sx={{width: '100%', pt: teacher ? 0 : 3}}>
        {panels.length > 1 && (
          <Box sx={{borderBottom: 0, borderColor: 'divider'}}>
            <AntTabs value={value} onChange={handleChange} aria-label="">
              {panels.map((panel, i) => {
                return <AntTab label={panel.title} {...a11yProps(i)} />
              })}
            </AntTabs>
          </Box>
        )}
        {panels.map((panel, i) => {
          return (
            <TabPanel value={value} index={i}>
              {panel.component}
            </TabPanel>
          )
        })}
      </Box>
    </>
  )
}
