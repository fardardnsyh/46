import { Input } from '@/components/ui/input'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from './FieldEdit'
import { db } from '@/configs'
import { userResponses } from '@/configs/schema'
import { toast } from 'sonner'
import moment from 'moment'
import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

  

const FormUi = ({jsonForm, onFieldUpdate, deleteField, selectedTheme, selectedStyle, editable=true, formId=0, enabledSignIn=false}) => {
  const [formData, setFormData] = useState();
  let formRef = useRef();
  const {user, isSignedIn} = useUser();

  const handleInputChange=(e)=>{
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSelectChange=(name, value)=>{
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleCheckboxChange=(fieldName, itemName, value)=>{
    const list = formData?.[fieldName]?formData?.[fieldName]:[];
    // console.log(list);
    if(value){
      list.push({
        label:itemName,
        value:value
      })
      setFormData({
        ...formData,
        [fieldName]:list
      })
    }else{
      const result=list.filter((item)=>item.label==itemName)
      setFormData({
        ...formData,
        [fieldName]:result
      })
    }
    // console.log(formData);
  }

  const onFormSubmit=async(e)=>{
    e.preventDefault();
    // console.log(formData);
    const result = await db.insert(userResponses)
    .values({
      jsonResponse:formData,
      createdAt:moment().format('DD/MM/yyyy'),
      formRef:formId
    })

    if(result){
      formRef.reset();
      toast('Response Submitted Successfully!')
    }else{
      toast('Error while saving your form')
    }
  }
  return (
    <form 
      onSubmit={onFormSubmit} 
      className='border p-5 md:w-[600px] rounded-lg' 
      data-theme={selectedTheme} 
      style={{border:selectedStyle?.value}}
      ref={(e)=>formRef=e}
    >
        <h2 className='font-bold text-center text-2xl'>{jsonForm?.formTitle}</h2>
        <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.formHeading}</h2>
        {jsonForm && jsonForm.fields && jsonForm.fields.length > 0 && (
          jsonForm.fields.map((field, index) => (
            <div key={index}className='flex items-center gap-2' >
              {field?.fieldType=='select'?
                <div className='my-3 w-full'>
                  <label className='text-xs text-gray-600'>{field?.label}</label>
                  <Select required={field?.required} onValueChange={(value)=>handleSelectChange(field.fieldName, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field?.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field?.options.map((option,index)=>(
                        <SelectItem key={index} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                :
                field?.fieldType=='radio'?
                <div className='my-3 w-full'>
                  <label className='text-xs text-gray-600'>{field?.label}</label>
                  <RadioGroup required={field?.required}>
                    {field?.options.map((option,index)=>(
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={option?.label} id={option?.label} onClick={()=>handleSelectChange(field.fieldName, option.value)}/>
                        <Label htmlFor={option?.label}>{option?.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                </div>
                :
                field?.fieldType=='checkbox'?
                <div className='my-3 w-full'>
                  <label className='text-xs text-gray-600'>{field?.label}</label>
                    {field?.options?field?.options?.map((option,index)=>(
                      <div key={index} className='flex gap-2 items-center'>
                        <Checkbox onCheckedChange={(value)=>handleCheckboxChange(field?.label, option.label, value)}/>
                        <h2>{option.label}</h2>
                      </div>
                    ))
                    :
                    <div className='flex gap-2 items-center'>
                      <Checkbox/>
                      <h2>{field?.label}</h2>
                    </div>
                    }
                </div>
                :
                <div className='my-3 w-full'>
                  <label className='text-xs text-gray-600'>{field?.label}</label>
                  <Input
                    type={field?.fieldType}
                    placeholder={field?.placeholder}
                    name={field?.fieldName}
                    className='bg-transparent'
                    onChange={(e)=>handleInputChange(e)}
                    required={field?.required}
                  />
                </div>
              }
              {editable && 
              <div>
              <FieldEdit defaultValue={field} onUpdate={(value)=>onFieldUpdate(value,index)} deleteField={()=>deleteField(index)}/>
              </div>
              }
            </div>
          ))
        )}
        {!enabledSignIn?
          <button className='btn btn-primary' type='submit'>Submit</button>
          :
          isSignedIn?
            <button className='btn btn-primary' type='submit'>Submit</button>
            :
            <Button>
              <SignInButton mode='modal'>Sign In before Submit</SignInButton>
            </Button>
        }
    </form>
  )
}

export default FormUi