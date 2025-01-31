import { cloneDeep, set } from 'lodash';
import React, { useEffect, useState } from 'react'

interface useFormInterface {
    initial;
    validationSchema?
    onSubmit
    oneError?;
}

export default function useForm({ initial, validationSchema, oneError, onSubmit }: useFormInterface) {

    const [errors, setErrors] = useState<typeof initial>({})
    const [vals, setVals] = useState<typeof initial>(initial || {})
    const handleChange = (path, value) => {
        setVals(prev => {
            let _obj = cloneDeep(prev);
            set(_obj, path, value)
            return { ...prev, ..._obj }
        })
        // setVals(prev => ({ ...prev, [path]: value }))
    }
    useEffect(() => { console.log("ERRORS", errors) }, [errors])
    const validate = () => {
        return new Promise(async (resolve, reject) => {
            let _localErrors = {}
            await validationSchema.validate(vals, { abortEarly: false }).then(() => resolve(null)).catch(err => {
                if (oneError) {
                    setErrors({ [err.path]: err.message })
                    reject(null)
                } else {
                    err.inner.map((item, i) => {
                        console.log(item.path, item.message)
                        if (!!!_localErrors[item.path]) {
                            _localErrors = { ..._localErrors, [item.path]: item.message }
                        }
                        if (i == err.inner.length - 1) {
                            setErrors(_localErrors)
                            reject(null)
                        }
                    })
                }
            })
        })
    }

    const handleSubmit = async () => {
        try {
            clearErrors()
            if (validationSchema) {
                await validate()
            }
            onSubmit()
        } catch (e) { }
    }

    const clearErrors = () => {
        setErrors({})
    }

    return {
        errors,
        values: vals,
        handleChange,
        handleSubmit,
        clearErrors
    } as IUseForm

    interface IUseForm {
        errors: any;
        values: any;
        handleChange: (path, value) => void
        handleSubmit: () => void
        clearErrors: () => void
    }
}


