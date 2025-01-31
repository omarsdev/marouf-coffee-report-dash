import { Button, InputLabel } from '@mui/material'
import React from 'react'
import { cloneDeep, omit, remove } from "lodash";
interface Props {
    onChange;
    value;
    name;
    Label;
    options;
    helperText?;
    padding;
    error?;
}
import _ from "lodash";

export default function MultiLineOptionSelector(props: Props) {

    const isSelected = (_id) => {
        return props.value && props.value.findIndex(id => id == _id) >= 0
    }

    return (
        <div
            style={{
                paddingBottom: props.padding ? props.padding * 10 : 0
            }}>
            {props.Label && (<InputLabel
                shrink
                error={!!props.error}
                htmlFor={"input_id=" + props.name}>
                {props.Label}
            </InputLabel>)}

            <div className="flex flex-wrap">
                {props.options && props.options.map(option => {
                    return (
                        <Button
                        className="mb-3"
                            onClick={() => {

                                let options = cloneDeep(props.value);
                                if (_.isNull(props.value) || _.isUndefined(props.value)) {
                                    options = [option._id]
                                }
                                if (options && options.findIndex(id => option._id == id) >= 0) {
                                    remove(options, (o) => {
                                        return o === option._id;
                                    })
                                } else {
                                    options = [...options, option._id]
                                }
                                props.onChange('categories', options)
                            }}
                            variant='outlined'
                            sx={{
                                mr: 2,
                                ...isSelected(option._id) ? {
                                    bgcolor: 'primary.main',
                                    color: 'white'
                                } : {}
                            }}
                        >
                            {option.name.en}
                        </Button>
                    )
                })}
            </div>

            {(props.error || props.helperText) && (
                <div className="pt-1">
                    <InputLabel
                        error={!!props.error}
                        shrink htmlFor={"input_id=" + props.name}>
                        {props.error ? props.error : props.helperText}
                    </InputLabel>
                </div>)
            }

        </div>
    )
}
