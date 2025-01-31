import {InputLabel} from '@mui/material'
import {Box} from '@mui/system'
import {filesApi} from 'lib/api/fileApi'
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {RiAlbumFill, RiGalleryFill} from 'react-icons/ri'

interface Props {
  label?
  helperText?
  name?
  error?
  padding?
  onChange
  pr?
  square?
  value
  wfull?
  circle?
  height?
  width?
}

export default function DropZone(props: Props) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      setLoading(true)
      console.log('acceptedFiles', acceptedFiles)
      const {imageUrl} = (await filesApi.upload({
        file: acceptedFiles[0],
      })) as any
      props.onChange(props.name, imageUrl)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <Box
      sx={{
        pb: 2,
        pr: props.pr,
        width: props.wfull ? '100%' : props.width ? props.width : 'auto',
      }}
      className=" relative"
    >
      {props.label && (
        <InputLabel
          shrink
          error={!!props.error}
          htmlFor={'input_id=' + props.name}
        >
          {props.label}
        </InputLabel>
      )}
      <Box
        sx={{
          ...(props.square
            ? {
                height: props.height ? props.height : 400,
                width: 400,
              }
            : {
                height: props.height ? props.height : 265,
              }),
        }}
      >
        <div
          style={{
            ...(props.circle ? {borderRadius: 1000} : {}),
          }}
          className="h-full flex justify-center overflow-hidden relative items-center text-4xl rounded-3xl border-dashed border"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <RiGalleryFill />
          {!!props.value && (
            <div className="absolute inset-0 h-full w-full">
              <img
                style={
                  {
                    // objectFit:"contain"
                  }
                }
                // resizeMode="contain"
                className="h-full w-full"
                src={props.value}
              />
            </div>
          )}
        </div>
      </Box>
      {(props.error || props.helperText) && (
        <div className="pt-1">
          <InputLabel
            error={!!props.error}
            shrink
            htmlFor={'input_id=' + props.name}
          >
            {props.error ? props.error : props.helperText}
          </InputLabel>
        </div>
      )}
    </Box>
  )
}
