import React, { useState } from 'react';
import { notify } from '../constants';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_DOMAIN } from '../constants';

const ResetPassword = () => {

    const [formData, setFormData] = useState({});
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
        
    const handleSubmit = async () => {

        const token = searchParams.get('token');

        if(!token){
            notify('No token found', 'error');
        }
        else if(!formData.password || !formData.confirmpassword){
            notify('Please fill all required fields', 'error');
        }
        else if(formData.password.length < 6){
            notify('Minimum length of password is 6 characters', 'error');
        }
        else if(formData.password !== formData.confirmpassword){
            notify("Password don't match", 'error');
        }
        else{

            const response = await fetch(`${SERVER_DOMAIN}/auth/reset-password?resetToken=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: formData.password
                })
            });

            const data = await response.json();

            if(data.error){
                notify(data.error, 'error');
            }
            else{
                notify(data.message, 'success');
                window.location.href = '/auth/signin';
            }

        }

    }

  return (
    <div className='w-full mt-[125px] flex flex-col items-center'>

        <h1 className='font-semibold text-sm mb-8'>
            Enter your new password here
        </h1>
        <form 
            className='flex flex-col gap-4 w-[350px]'
        >
            <label className='font-semibold text-sm'>
                <div className='flex gap-[3px]'> 
                    <p> Password </p> 
                    <p className='text-red-500 items-start'> * </p> 
                </div>
            </label>
            <TextField 
                size='small' 
                id="filled-basic" 
                label="Password" 
                variant="filled" 
                type='password'
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <label className='font-semibold text-sm'>
                <div className='flex gap-[3px]'> 
                    <p> Confirm password </p> 
                    <p className='text-red-500 items-start'> * </p> 
                </div>
            </label>
            <TextField 
                size='small' 
                id="filled-basic" 
                label="Confirm password" 
                variant="filled" 
                type='password'
                onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
            />

            <Button 
                variant="contained" 
                size="medium" 
                style={{
                    textTransform: 'none',
                    fontSize: '15px',
                    marginTop: '15px'
                }}
                onClick={handleSubmit}
            > 
                Submit
            </Button>

        </form>
    </div>
  )
}

export default ResetPassword