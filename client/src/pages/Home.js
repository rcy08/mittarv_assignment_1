import React from 'react';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

const Home = () => {

  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState('');

  let url = `https://low-carb-recipes.p.rapidapi.com/search?limit=20`;

  const getRecipes = async () => {

    if(searchParams.get('q')){
      url += `name=${searchParams.get('q')}`;
    }

    // const url = 'https://low-carb-recipes.p.rapidapi.com/search?name=cake&tags=keto%3Bdairy-free&includeIngredients=egg%3Bbutter&excludeIngredients=cinnamon&maxPrepareTime=10&maxCookTime=20&maxCalories=500&maxNetCarbs=5&maxSugar=3&maxAddedSugar=0&limit=10';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '03004c32c1msh9f7d3f2279e45e8p160c4ajsn8082e1e96616',
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(JSON.parse(result));
      setRecipes(JSON.parse(result));
    } catch (error) {
      console.error(error);
    }  

  }

  useEffect(() => {

    getRecipes();

  }, []);

  console.log(recipes);

  const start = ((searchParams.get('page') || 1) - 1) * 4;
  const end = start + 4;

  return (

    <div className='mt-[125px] max-w-[1800px] flex flex-col items-center justify-center '>

      <div className='mb-24 flex flex-row gap-0 h-full'>
        <Button
          variant='outlined'
          onClick={() => {
            searchParams.set('q', search);
            window.location.href = `/home?${searchParams.toString()}${currentUrl.hash}`;
          }}
        >
          <SearchIcon className='scale-[125%]' />
        </Button>

        <TextField 
          size='small' 
          id="filled-basic" 
          label="Search recipes" 
          variant="filled" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            maxWidth: '300px'
          }}
        />  
      </div>

      
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16'>

        {
          !recipes || recipes.length === 0 ?

            <div className='text-md font-bold text-center col-span-4'>
              No recipes found
            </div>

          :

          recipes.slice(start, end).map((recipe, index) => (
            <Link key={index} to={`/recipe/${recipe.id}`} className={`flex flex-col gap-4 bg-blue-200 text-black mx-8 sm:mx-0 sm:w-[325px] p-6 rounded`}>
              <img 
                src={recipe.image}
                alt='RecipeImage'
                width={300}
                height={300}
              />
              <h1 className='text-md font-bold text-center'> {recipe.name} </h1>
            </Link>
          ))

        }

      </div>
      
      <div className={!recipes && 'hidden'}>
        <Pagination
          count={Math.ceil(recipes.length / 4)} 
          color="primary" 
          page={Number(searchParams.get('page')) || 1}
          onChange={(e, page) => {
            window.location.href = `/home?page=${page}`;
          }}
          showFirstButton
          showLastButton
        />  
      </div>
      

    </div>
  );
}

export default Home;