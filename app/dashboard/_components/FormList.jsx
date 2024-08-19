"use client"
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListItem from './FormListItem';

const FormList = () => {
    const {user} = useUser();
    const [formList, setFormList] = useState([]);
    useEffect(()=>{
        user&&GetFromList();
    },[user])
    const GetFromList=async()=>{
        const result =await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))

        setFormList(result);
        // console.log(result);
    }
  return (
    <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
        {formList.map((form, index)=>(
            <div key={index}>
                <FormListItem jsonForm={JSON.parse(form?.jsonform)} formRecord={form} refreshData={GetFromList}/>
            </div>
        ))}
    </div>
  )
}

export default FormList