import * as React from 'react'
import {useTheme} from 'next-themes'
import {RiMoonFill, RiMoonLine} from 'react-icons/ri'
import {Button, IconButton, Tooltip} from '@mui/material'
import {
  useTheme as MUIUseTheme,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles'
import {Box} from '@mui/system'
import {ColorModeContext} from 'pages/_app'
import {useCookies} from 'react-cookie'
// const DarkModeToggle: React.FC = () => {
//   const [mounted, setMounted] = React.useState(false)
//   const {theme, setTheme} = useTheme()
//   React.useEffect(() => setMounted(true), [])

//   return (
//     <button
//       type="button"
//       className=" rounded flex justify-center items-center focus:outline-none text-xl h-10 w-10 mr-2"
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//     >
//           {mounted ? theme == 'dark' ? (
//             <RiMoonLine />
//           ) : (
//             <RiMoonFill/>
//           ) : null}
//     </button>
//   )
// }

// export default DarkModeToggle

export default function DarkModeToggle() {
  const theme = MUIUseTheme()
  const colorMode = React.useContext(ColorModeContext)
  const [_, setCookies] = useCookies([]) as any
  return (
    <Tooltip title="Change Theme">
      <IconButton
        sx={{mr: 2, outline: 'none'}}
        onClick={() => {
          colorMode.toggleColorMode()
          setCookies('mode', theme.palette.mode !== 'dark' ? 'dark' : 'light')
        }}
        color="inherit"
      >
        {theme.palette.mode !== 'dark' ? <RiMoonLine /> : <RiMoonFill />}
      </IconButton>
    </Tooltip>
  )
}

{
  /* <Box
sx={{
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'background.default',
  color: 'text.primary',
  borderRadius: 1,
  p: 3,
}}
>
</Box> */
}
