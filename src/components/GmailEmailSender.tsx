import React, {useEffect, useState} from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'
import CustomButton from './CustomButton'
import CustomLabel from './CustomLabel'

type Checklist = {
  title?: string
  'Submitted Date': string
  'Time Started': string
  'Time Ended': string
  'Time Spent': string
  Branch?: string
}

interface GmailExcelPopupProps {
  open: boolean
  onClose: () => void
  data: Checklist[]
}

export const GmailExcelPopup: React.FC<GmailExcelPopupProps> = ({
  open,
  onClose,
  data,
}) => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary')

    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'})
    saveAs(file, 'checklist-summary.xlsx')
  }

  const openGmailWithPrefill = () => {
    if (!email || !subject) {
      alert('Please enter both email and subject.')
      return
    }

    handleDownloadExcel()

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Hi,\n\nPlease find attached the checklist summary Excel file.\n\nRegards,\n`,
    )}`

    window.open(gmailUrl, '_blank')
  }
  useEffect(() => {
    setEmail('')
    setSubject('')
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: 'auto',
          mt: '10%',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{position: 'absolute', top: 8, right: 8}}
        >
          <CloseIcon />
        </IconButton>
        <Box mb={2}>
          <CustomLabel size="bigTitle">Send Excel Summary</CustomLabel>
        </Box>

        <TextField
          fullWidth
          label="Recipient Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{mb: 2}}
        />

        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{mb: 3}}
        />

        <CustomButton
          title="Download Excel & Open Gmail"
          fullWidth
          onClick={openGmailWithPrefill}
        />
      </Box>
    </Modal>
  )
}
