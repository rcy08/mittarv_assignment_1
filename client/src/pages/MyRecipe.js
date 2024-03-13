import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const MyRecipe = () => {

  const { signedin, user } = useAuthContext();
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);
  
  useEffect(() => {
    if(user){
      console.log(user.user);
    }
  }, [user]);




  return (
    <div>
        
    </div>
  )
}

export default MyRecipe;