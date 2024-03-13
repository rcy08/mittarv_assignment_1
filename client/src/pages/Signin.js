import React, { useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Button as MantineButton } from '@mantine/core';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { SERVER_DOMAIN, notify } from '../constants';
import { Link } from 'react-router-dom';
import validator from 'email-validator';
import { useAuthContext } from '../hooks/useAuthContext';

const Signin = () => {

    const [mode, SetMode] = useState('signin');
    const [formData, setFormData] = useState({});

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    const { signedin, dispatch } = useAuthContext();
    const [signinButtonState, setSigninButtonState] = useState('click');
    const [signupButtonState, setSignupButtonState] = useState('click');

    const handleSignin = async (e) => {

        e.preventDefault();

        if(!formData.email || !formData.password){
            notify('Please fill all required fields', 'error');
        }
        else{

            setSigninButtonState('loading');

            const response = await fetch(`${SERVER_DOMAIN}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameOrEmail: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            setSigninButtonState('click');

            if(data.error){
                notify(data.error, 'error');
            }
            else{
                notify(data.message, 'success');
                localStorage.setItem('user', JSON.stringify({
                    token: data.token,
                    user: data.user
                }))
                dispatch({ 
                    type: 'SIGNIN', 
                    payload: { 
                        token: data.token, 
                        user: data.user 
                    }
                });
                window.location.href = searchParams.get('redirect_uri') || '/';
            }  

        }

    }

    const handleSignup = async (e) => {

        e.preventDefault();

        if(!formData.email || !formData.username || !formData.password || !formData.confirmpassword){
            notify('Please fill all required fields', 'error');
        }
        else if(!validator.validate(formData.email)){
            notify('Invalid Email', 'error');
        }
        else if(formData.username.length < 4){
            notify('Minimum length of username is 4 characters', 'error');
        }
        else if(formData.password.length < 6){
            notify('Minimum length of password is 6 characters', 'error');
        }
        else if(formData.password !== formData.confirmpassword){
            notify("Password don't match", 'error');
        }
        else{

            setSignupButtonState('loading');

            const response = await fetch(`${SERVER_DOMAIN}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            setSignupButtonState('click');

            if(data.error){
                notify(data.error, 'error');
            }
            else{
                notify(data.message, 'success');
            }    

        }
        
    }

  return (

    <div className='w-full mt-[125px] flex flex-col items-center'>
        
        <ButtonGroup
            disableElevation
            aria-label="Disabled button group"
            className='mb-8'
        >
            <Button
                variant={mode === 'signin' ? 'contained' : 'outlined'}
                onClick={() => {
                    setFormData({});
                    SetMode('signin');
                }}
                style={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '17px'
                }}
            >
                Signin
            </Button>

            <Button
                variant={mode === 'signup' ? 'contained' : 'outlined'}
                onClick={() => {
                    setFormData({});
                    SetMode('signup');
                }}
                style={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '17px'
                }}
            >
                Signup
            </Button>

        </ButtonGroup>

        <div className=''>

            {
                mode === 'signin' ? 
                
                <>
                
                    <form 
                        className='flex flex-col gap-4 w-[350px]'
                    >
                        <label className='font-semibold text-sm'>
                            <div className='flex gap-[3px]'> 
                                <p> Username/Email </p> 
                                <p className='text-red-500 items-start'> * </p> 
                            </div>
                        </label>
                        <TextField 
                            size='small' 
                            id="filled-basic" 
                            label="Username/Email" 
                            variant="filled" 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

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

                        <Link to='/auth/forgot-password' className='text-[#2074d4] text-sm font-medium'>
                            Forgot password?
                        </Link>

                        <MantineButton 
                            style={{
                                textTransform: 'none',
                                fontSize: '15px',
                                marginTop: '15px'
                            }}
                            onClick={handleSignin}
                            loading={signinButtonState === 'click' ? false : true}
                        > 
                            Signin
                        </MantineButton>

                    </form>

                </>

                :


                <>

                    <form className='flex flex-col gap-4 w-[350px]'>
                            
                    <label className='font-semibold text-sm'>
                        <div className='flex gap-[3px]'> 
                            <p> Username </p> 
                            <p className='text-red-500 items-start'> * </p> 
                        </div>
                    </label>
                    <TextField 
                        size='small' 
                        id="filled-basic" 
                        label="Username" 
                        variant="filled" 
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />

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
                        type='email'
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

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

                    <MantineButton 
                        style={{
                            textTransform: 'none',
                            fontSize: '15px',
                            marginTop: '15px'
                        }}
                        onClick={handleSignup}
                        loading={signupButtonState === 'click' ? false : true}
                    > 
                        Signup
                    </MantineButton>

                    </form>
                
                </>

            }

        </div>

    </div>
  )
}

export default Signin;