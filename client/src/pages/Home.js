import React from 'react';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Button } from '@mui/material';

const Home = () => {

  const [search, setSearch] = useState('');

  let url = `https://low-carb-recipes.p.rapidapi.com/search?`;

  const getRecipes = async () => {

    url += `name=${search}`;

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
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error(error);
    }  

  }

  useEffect(() => {

    // getRecipes();

  }, []);

  return (
    <div className='mt-[125px] max-w-[1800px] flex justify-center'>

      <Button
        variant='outlined'
        onClick={getRecipes}
      >
        <SearchIcon />
      </Button>

      <TextField 
        size='small' 
        id="filled-basic" 
        label="Search Recipe" 
        variant="filled" 
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          maxWidth: '300px'
        }}
      />
      
      

    </div>
  );
}

export default Home;