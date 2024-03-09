import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { notify } from '../constants';
import validator from 'email-validator';
import { SERVER_DOMAIN } from '../constants';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email){
            notify('Please fill all required fields', 'error');
        }
        else if(!validator.validate(email)){
            notify('Invalid Email', 'error');
        }
        else{

            const response = await fetch(`${SERVER_DOMAIN}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            const data = await response.json();

            if(data.error){
                notify(data.error, 'error');
            }
            else{
                notify('Reset password link sent to your email. Also check your spam folder', 'success');
            }

        }

    }

  return (
    <div className='w-full mt-[125px] flex flex-col items-center'>
        <form 
            className='flex flex-col gap-4 w-[350px]'
        >   

            <h1 className='text-lg font-semibold mb-4'>
                Forgot password
            </h1>

            <p className='text-sm font-medium mb-8'>
                Please provide your email and we will send you the reset password link.
            </p>

            <label className='font-semibold text-sm'>
                <div className='flex gap-[3px]'> 
                    <p> Email </p> 
                    <p className='text-red-500 items-start'> * </p> 
                </div>
            </label>
            <TextField 
                size='small' 
                id="filled-basic" 
                label="Email" 
                variant="filled" 
                onChange={(e) => setEmail(e.target.value)}
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
            
            <div className='flex gap-[6px]'>
                <p className='text-sm font-medium'> Back to </p>  
                <Link to='/auth/signin' className='text-[#2074d4] text-sm font-medium'>
                    Signin
                </Link> 
            </div>

        </form>
    </div>
  )
}

export default ForgotPassword;