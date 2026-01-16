import React from 'react'
import { Formik, Form, ErrorMessage, Field, useFormikContext } from "formik"
import { RegisterSchema } from '../../../Backend/Zod/Auth.js'
import { useState } from 'react'
import {Button} from "../Components/ui/button.jsx"
import {Toaster} from "../Components/ui/sonner"
import { toast } from 'sonner'
const Formikk = () => {
    const Validate = (values) => {
        const res = RegisterSchema.safeParse(values);
        // console.log(res);
        if (res.success) return {};
        const errorArr = JSON.parse(res.error.message);
        return errorArr.reduce((acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
        }, {})
    }
    const [error, seterror] = useState("")
    // const formikContext = useFormikContext();
    return (

        <div>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: ""
                }}
                onSubmit={(values, { setErrors }) => {
                    console.log("Form Submitted", values);
                    toast("Form Submitted")
                }}

                validate={Validate}
            >

                {
                    ({ values }) => {
                        return <Form>
                            <div className='flex flex-col gap-5 w-[700px] m-auto mt-20 shadow-2xl p-10 rounded-lg'>
                                <Field name="name" placeholder="Enter Name" className="border rounded-lg p-2" />
                                <ErrorMessage name='name' component={"div"} className='text-red-600 m-0' />

                                <Field name="email" placeholder="Enter Email" className="border rounded-lg p-2" />
                                <ErrorMessage name='email' component={"div"} className='text-red-600 m-0' />

                                <Field name="password" placeholder="Enter Password" className="border rounded-lg p-2" />
                                <ErrorMessage name='password' component={"div"} className='text-red-600 m-0' />
                                
                                <p className='text-red-600 my-3 text-center text-xl'>
                                    {error}
                                </p>

                                <div className='flex justify-center'>
                                    <button type='submit' className='bg-blue-500 p-2 rounded-lg text-white cursor-pointer'>Submit</button>
                                    <Toaster/>
                                </div>

                            </div>

                        </Form>

                    }
                }

            </Formik>
        </div>
    )
}

export default Formikk