import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAuthContext } from '../hooks/useAuthContext';
import { notify } from '../constants';
import { SERVER_DOMAIN } from '../constants';

const Recipe = () => {

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const { id } = useParams();
    const { signedin, user, dispatch } = useAuthContext();
    const [userDetails, setUserDetails] = useState({});
    const [recipe, setRecipe] = useState('');
    const [tags, setTags] = useState('');

    console.log('recipe:', recipe);

    useEffect(() => {

        const getRecipe = async () => {

            try {
              const response = await fetch(`https://low-carb-recipes.p.rapidapi.com/recipes/${id}`, {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': '03004c32c1msh9f7d3f2279e45e8p160c4ajsn8082e1e96616',
                  'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
                }
              });
              const result = await response.text();
              console.log(result);
              setRecipe(JSON.parse(result));

            } catch (error) {
              console.error(error);
            }
            
        };

        if(!recipe){
          getRecipe();
        } 

    }, []);

    setTimeout(() => {

      if(recipe){
        let tagss = '';
        recipe.tags.forEach((tag, index) => (
          tagss += tag,
          tagss += (index !== recipe.tags.length - 1 ? ',  ' : '') 
        ))  
        setTags(tagss);
      }
      if(user) setUserDetails(user.user);
      
    }, 3000);

    const handleBookmark = async (e) => {
      e.preventDefault();

      if(!signedin){
        searchParams.set('redirect_uri', currentUrl);
        window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`; return;
      }

      if(userDetails.bookmarks && userDetails.bookmarks.length > 0 && userDetails.bookmarks.includes(recipe.id)){
        notify('Already bookmarked', 'success');
        return;
      } 

      const response = await fetch(`${SERVER_DOMAIN}/auth/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          username: userDetails.username,
          recipeId: recipe.id
        })
      });

      const data = await response.json();

      if(data.error){
        notify('Error occured', 'error');
      }
      else{

        const token = user.token, newUser = data.user;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify({
          token,
          user: newUser
        }));
        dispatch({ type: 'SIGNIN', payload: {
          token,
          user: newUser
        }});

        notify('Bookmarked successfully', 'success');
      }

    }

  return (
    <div className='max-w-[1800px] mt-[125px] w-full'>

      <div className='w-full max-h-[100vh] grid grid-cols-1 lg:grid-cols-3'>

        <div className='col-span-1 w-full h-full flex justify-center items-start'>
          <img 
            src={recipe.image} 
            alt='Recipe image'
            width={350}
            height={350}
          />  
        </div>
        
        <div className='lg:col-span-2 flex flex-col px-8 mt-16 lg:mt-0'>

          <div className='flex justify-between items-center mb-16'>
            <h1 className='text-xl sm:text-2xl font-bold'>
              {recipe.name}
            </h1>  

            <button 
              className='w-fit h-fit'
              onClick={handleBookmark}
            >
              { userDetails.bookmarks && userDetails.bookmarks.length > 0 && userDetails.bookmarks.includes(recipe.id) ? <BookmarkIcon /> : <BookmarkBorderIcon /> }   
            </button>
          </div>
          

          <div className='flex flex-col gap-2 mb-8'>
            <h3 className='text-lg font-medium'>
                Tags
            </h3>

            <div className='flex flex-row gap-2'>
              {tags}
            </div>
          </div>

          <div className='text-sm mb-4 flex flex-col gap-2'>
            <div className='text-lg font-medium' > Description </div> {recipe.description}
          </div>

          <div className='text-lg mb-4 flex flex-col gap-2'>
            <div className='font-medium'> Prepare time </div> {recipe.prepareTime}
          </div>

          <div className='text-lg mb-4 flex flex-col gap-2'>
            <div className='font-medium'> Cook time </div> {recipe.cookTime}
          </div>

          <div className='flex flex-col gap-2 mb-8'>
            <h3 className='text-lg font-medium'>
                Ingredients
            </h3>

            <ul className='flex flex-col gap-2'>
              {
                recipe && recipe?.ingredients?.map((ingredient, index) => (
                  <li key={index} className='flex flex-row gap-2 ml-4'>
                    {<span className='font-medium'> {`${index + 1}. `} </span> }
                    <div className='flex flex-col'>
                      <div className=''> Name: <span className='text-[15px]'> {ingredient.name} </span> </div>
                      <div className=''> 
                        <p className='mb-1'> Serving Size: </p>  
                        <div className='flex flex-col ml-4 text-[15px]'>
                          <div className=''> Units: {ingredient.servingSize.units} </div>
                          <div className=''> Description: {ingredient.servingSize.desc} </div>
                          <div className=''> Quantity: {ingredient.servingSize.qty} </div>
                          {ingredient.servingSize.grams && <div className=''> Grams: {ingredient.servingSize.grams} </div>} 
                          <div className=''> Scale: {ingredient.servingSize.scale} </div>
                        </div>
                      </div>  
                    </div>
                    
                  </li>
                ))
              }
            </ul>
             
          </div>

          <div className='flex flex-col gap-2 mb-8'>
              <h3 className='text-lg font-medium'>
                  Steps
              </h3>

              <div className='flex flex-col gap-2'>
                {
                  recipe && recipe?.steps?.map((step, index) => (
                    <div key={index} className=''>
                      {<span className='font-medium'> {`${index + 1}. `} </span> } {step}
                    </div>
                  ))
                }
              </div>
              
          </div>

        </div>

      </div>

    </div>
  )
}

export default Recipe;