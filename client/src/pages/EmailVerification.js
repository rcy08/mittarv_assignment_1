import React from 'react';
import { useState, useEffect } from 'react';
import { notify } from '../constants';
import { SERVER_DOMAIN } from '../constants';

const EmailVerification = () => {

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    useEffect(() => {

        const token = searchParams.get('token');

        const verifyEmail = async () => {

            if(!token){
                notify('No token found', 'error'); return;
            }

            const response = await fetch(`${SERVER_DOMAIN}/auth/email-verification?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if(data.error){
                notify(data.error, 'error');
            }
            else{
                window.location.href = '/auth/signin';
                notify(data.message, 'success');
            }

        }

        verifyEmail();

    }, []);

  return (
    <div>
        
    </div>
  )
}

export default EmailVerification;