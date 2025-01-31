import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
//@ts-ignore
import {  motion , AnimatePresence} from 'framer-motion'
import { useTheme } from '@mui/system';


interface Props {
    isVisible: Boolean;
}
export default function Backdrop({ isVisible }: Props) {
    const theme = useTheme();


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                // key={keyCounter}
                initial={{opacity: 0}}
                animate={{opacity: 0.3}}
                exit={{opacity: 0}}
                style={{
                    backgroundColor: '#000',
                    zIndex: 1231231232
                }}
                className="h-screen w-screen flex absolute inset-0 justify-center items-center"
            >
                <CircularProgress color={'primary'} className="z-50" />
            </motion.div>)}
        </AnimatePresence>
    )
}
