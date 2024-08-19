"use client"
import FormUi from '@/app/edit-form/_components/FormUi';
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema';
import { eq } from 'drizzle-orm'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const LiveAiForm = ({params}) => {
    const [jsonForm, setJsonForm] = useState([]);
    const [record, setRecord] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [selectedBackground, setSelectedBackground] = useState();

    useEffect(()=>{
        // console.log(params);
        params&&GetFormData();
    },[params])

    const GetFormData=async()=>{
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.id, params?.formid))

        // console.log(result);
        setRecord(result[0])
        setJsonForm(JSON.parse(result[0].jsonform))
        setSelectedTheme(result[0].theme)
        setSelectedBackground(result[0].background)
    }
  return (
    <div style={{backgroundImage:selectedBackground}} className='p-10 flex items-center justify-center' >
        {record&&<FormUi
            jsonForm={jsonForm}
            selectedStyle={record?.style}
            selectedTheme={record?.theme}
            onFieldUpdate={()=>console.log}
            deleteField={()=>console.log}
            editable={false}
            formId={record.id}
            enabledSignIn={record?.enabledSignIn}
        />}
        <Link href={process.env.NEXT_PUBLIC_BASE_URL} className='flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer'>
            <Image src={'/logo.svg'} width={40} height={40}/>
            Build your Own AI Form
        </Link>
    </div>
  )
}

export default LiveAiForm