import { FormEvent, useState, ChangeEvent, useReducer, useEffect } from "react";
import axios from 'axios';

type useFormProps = {
   endpointUrl: string,
   additionalData?: object
};

const formReducer = (state: object, event: any) => {
   return {
      ...state,
      [event.name]: event.value
   }
}

export default function useForm(endpointUrl: string, additionalData: object) {
   const [submitting, setSubmitting] = useState(false);
   const [form, setForm] = useReducer(formReducer, {});
   const [errors, setErrors] = useState<any>({});
   const [successful, setSuccessful] = useState(false);
   const [message, setMessage] = useState('');

   const [response, setResponse] = useState({done: false});

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm({
         name: name,
         value: value,
      });

      errors[name] = '';
      setErrors({...errors});
   };

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      if (form) {
         event.preventDefault();
         setSubmitting(true);
         setSuccessful(false);
         setMessage('');
         setErrors({});
         setResponse({done: false});

         if (additionalData) {
            Object.assign(form, additionalData);
         }

         var config = {
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin': '*',
            },
            withCredentials: false
         };

         axios.post(endpointUrl, form, config).then((response) => {
            const data = response?.data;
            if (data['errors']) {
               setErrors(data['errors']);
            }else {
               setSuccessful(data['success']);
               setMessage(data['message']);
               if (data['response']) {
                  setResponse(data['response']);
               }
            }

            setSubmitting(false);
         }).catch(function (error) {
            setSubmitting(false);
            setSuccessful(false);
            setMessage('Unknown server error. Please try again.');
         });
      }
   };

   return { 
      successful, 
      handleSubmit,
      message, 
      submitting, 
      errors,
      handleChange,
      response
   };
}