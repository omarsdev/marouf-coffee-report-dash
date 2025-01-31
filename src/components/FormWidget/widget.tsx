import { Button, IconButton, TextField, useTheme } from '@mui/material'
import { styled } from '@mui/system'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import TextInput from 'components/TextInput'
import Image from 'next/image'
import React from 'react'
import { RiCloseFill, RiMailFill, RiRestTimeFill, RiRestTimeLine, RiShareBoxLine, RiShareFill, RiTimeFill } from 'react-icons/ri'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { WidgetConfig } from './config'

interface Props {

}

export default function Widget(props: Props) {

    const data = {
        ...WidgetConfig,
        template_params: {
            'name': 'James',
            'message': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
            'date_time': ""
        }
    };

    const theme = useTheme();

    const ColorTextField = styled(TextField)(({ theme }) => ({
        '& .MuiOutlinedInput-root': {
            borderRadius: 7,
            backgroundColor: 'background.default',
            boxShadow: theme.palette.mode === 'dark' ? "11px 4px 39px #1e1e1e" : "11px 4px 39px #dee0e5",
            '& fieldset': {
                borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary,
            },
            '&.Mui-focused fieldset': {
                // borderColor: theme.palette.text.primary,
            },
        },
    }));



    return (
        <div style={{
            width: '25rem',
            borderRadius: 25,
            marginTop: -8
        }} className="overflow-hidden">
            <div className="linear_widget h-52 p-6">
                <div className="flex justify-between mb-5 items-start">
                    <div className="h-12 w-12 relative">
                        <Image
                            alt=''
                            layout='fill'
                            priority={true}
                            quality={100}
                            src={require('./assets/logo.png')}
                        />
                    </div>
                    <div
                        style={{
                            backgroundColor: "#2D19A0",
                            borderRadius: 2,
                        }}
                        className="h-7 w-7 text-white cursor-pointer hover:opacity-75 rounded-lg flex justify-center items-center relative">
                        <RiCloseFill />
                    </div>
                </div>
                <CustomLabel
                >
                    <div className="text-xl text-white">
                        Welcome, We're Vuedale
                    </div>
                </CustomLabel>
                <CustomLabel
                    size='normal'
                    className="text-gray-200"
                    padding={2}
                >
                    Please do not hesitate to contact us
                </CustomLabel>

            </div >

            <div
                className="-mt-14 p-6"
            >
                <CustomContainer
                    padding={2}
                    radius='medium'
                    noShadow
                    className="shadow-lg"
                    margin={4}
                >
                    <div className="flex items-center">
                        <div
                            style={{
                                backgroundColor: "#C5DDF4",
                                borderRadius: 2,
                            }}
                            className="p-1 rounded-lg text-primary-500 rounded-lg flex justify-center items-center relative">
                            <RiTimeFill
                                size="1.4rem"
                            />
                        </div>

                        <CustomLabel
                            size='normal'
                            className="ml-4"
                        >
                            We're outside our business hours
                        </CustomLabel>
                    </div>
                </CustomContainer>

                <ColorTextField
                    // padding={2}
                    fullWidth
                    sx={{
                        mb: 2,
                    }}
                    placeholder='Email Address'
                />

                <ColorTextField

                    // padding={2}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{
                        mb: 2,
                    }}
                    placeholder='Tell us what you need'
                />

                <CustomContainer
                    margin={4}
                    radius="medium"
                    style={{
                        border: 1,
                        borderColor: theme.palette.divider
                    }}
                >
                    <div className="flex items-center p-4">
                        <div
                            style={{
                                backgroundColor: "#C5DDF4",
                                borderRadius: 2,
                            }}
                            className="p-1 rounded-lg text-primary-500 rounded-lg flex justify-center items-center relative">
                            <RiMailFill
                                size="1.4rem"
                            />
                        </div>
                        <div className="pl-4">
                            <CustomLabel>
                                Want to attach documents?
                            </CustomLabel>
                            <CustomLabel
                                className="flex items-center hover:underline cursor-pointer"
                                size='normal'
                                type='secondary'
                            >
                                Send us an email <RiShareBoxLine className="ml-2" />
                            </CustomLabel>
                        </div>
                    </div>
                </CustomContainer>


                <Button
                    href='wow'
                    variant='contained'
                    size='large'
                    fullWidth
                    sx={{
                        borderRadius: 3
                    }}
                >
                    Send
                </Button>


            </div>
        </div >
    )
}
