import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'

export default function Phone() {
   // `value` will be the parsed phone number in E.164 format.
   // Example: "+12133734253".
   const [value, setValue] = useState<any>('');
   return (
      <PhoneInput name='phone' placeholder="Enter phone number" value={value} onChange={setValue}/>
   )
}