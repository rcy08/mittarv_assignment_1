import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { useLoadingContext } from '../hooks/useLoadingContext';

import { recipeString, recipeTags, MenuProps, includeIngredients, excludeIngredients, maxPrepareTimeValues, maxCookTimeValues,maxCaloriesValues, maxNetCarbsValues } from '../constants';

const Home = () => {

  const currentUrl = new URL(window.location.href);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(currentUrl.search));

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [recipes, setRecipes] = useState('');

  const { loadingState, loadingDispatch } = useLoadingContext();

  let url = new URL(`https://low-carb-recipes.p.rapidapi.com/search`);
  const urlSearchParams = new URLSearchParams(url.search);

  const getRecipes = async () => {

    if(searchParams.get('q')) urlSearchParams.set('name', searchParams.get('q'));

    const queryParameters = ['tags', 'includeIngredients', 'excludeIngredients', 'maxPrepareTime', 'maxCookTime', 'maxCalories', 'maxNetCarbs', 'maxAddedSugar'];

    queryParameters.forEach((p) => {
      if(searchParams.get(p)){
        urlSearchParams.set(p, searchParams.get(p));
      }
    });

    urlSearchParams.set('limit', 20);
    url.search = urlSearchParams.toString();

    // const url = 'https://low-carb-recipes.p.rapidapi.com/search?name=cake&tags=keto%3Bdairy-free&includeIngredients=egg%3Bbutter&excludeIngredients=cinnamon&maxPrepareTime=10&maxCookTime=20&maxCalories=500&maxNetCarbs=5&maxSugar=3&maxAddedSugar=0&limit=10';
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a3f06cace0msh1f4f58ccd59d209p14e70fjsn93c39443cf95',
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url.toString(), options);
      const result = await response.text();
      console.log(JSON.parse(result));
      setRecipes(JSON.parse(result));

      loadingDispatch({ type: 'RESET' });
      
    } catch (error) {
      console.error(error);
    }  

  }

  useEffect(() => {

    loadingDispatch({ type: 'LOADING' });

    getRecipes();

  }, []);

  console.log(recipes);

  const start = ((searchParams.get('page') || 1) - 1) * 4;
  const end = start + 4;

  const [showFilter, setShowFilter] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setShowFilter(open);
  };

  const [tagName, setTagName] = useState(
    searchParams.get('tags') ? searchParams.get('tags').split(';') : []
  );
  const [includeIngredientName, setIncludeIngredientName] = useState(
    searchParams.get('includeIngredients') ? searchParams.get('includeIngredients').split(';') : []
  );
  const [excludeIngredientName, setExcludeIngredientName] = useState(
    searchParams.get('excludeIngredients') ? searchParams.get('excludeIngredients').split(';') : []
  );
  const [maxPrepareTime, setMaxPrepareTime] = useState(searchParams.get('maxPrepareTime') || '');
  const [maxCookTime, setMaxCookTime] = useState(searchParams.get('maxCookTime') || '');
  const [maxCalories, setMaxCalories] = useState(searchParams.get('maxCalories') || '');
  const [maxNetCarbs, setMaxNetCarbs] = useState(searchParams.get('maxNetCarbs') || '');

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleIncludeIngredientChange = (event) => {
    const {
      target: { value },
    } = event;
    setIncludeIngredientName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleExcludeIngredientChange = (event) => {
    const {
      target: { value },
    } = event;
    setExcludeIngredientName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleMaxPrepareTimeChange = (event) => {
    searchParams.set('maxPrepareTime', event.target.value);
    setMaxPrepareTime(event.target.value);
  };

  const handleMaxCookTimeChange = (event) => {
    searchParams.set('maxCookTime', event.target.value);
    setMaxCookTime(event.target.value);
  };

  const handleMaxCaloriesChange = (event) => {
    searchParams.set('maxCalories', event.target.value);
    setMaxCalories(event.target.value);
  };

  const handleMaxNetCarbsChange = (event) => {
    searchParams.set('maxNetCarbs', event.target.value);
    setMaxNetCarbs(event.target.value);
  };

  console.log(tagName);

  const list = () => (
    <div className='h-fit bg-[#c0dcfc]'>

    <Box
      sx={{ 
        width: Math.min(window.screen.width, 300),
        backgroundColor: '#c0dcfc',
        minHeight: '100vh',
        position: 'relative',
        padding: '8px',
        marginLeft: '20px' 
      }}
      role="presentation"
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      
      <button 
        className='absolute top-4 right-4 w-fit h-fit bg-white rounded-full'
        onClick={toggleDrawer(false)}
      >
        <CloseIcon />
      </button>

      <h1 className='text-2xl font-bold ml-2 mt-8'> Filter recipes </h1>

      <div className='mt-8'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Tags </h1>

        <FormControl sx={{ m: 1, width: 250, backgroundColor: '#b8ccec' }}>
          <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={tagName}
            onChange={handleTagChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {recipeTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox checked={tagName.indexOf(tag) > -1} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='mt-6'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Include ingredients </h1>

        <FormControl sx={{ m: 1, width: 250, backgroundColor: '#b8ccec' }}>
          <InputLabel id="demo-multiple-checkbox-label">Include ingredients</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={includeIngredientName}
            onChange={handleIncludeIngredientChange}
            input={<OutlinedInput label="Include ingredients" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {includeIngredients.map((ingredient) => (
              <MenuItem key={ingredient} value={ingredient}>
                <Checkbox checked={includeIngredientName.indexOf(ingredient) > -1} />
                <ListItemText primary={ingredient} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='mt-6'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Exclude ingredients </h1>

        <FormControl sx={{ m: 1, width: 250, backgroundColor: '#b8ccec' }}>
          <InputLabel id="demo-multiple-checkbox-label">Exclude ingredients</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={excludeIngredientName}
            onChange={handleExcludeIngredientChange}
            input={<OutlinedInput label="Include ingredients" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {excludeIngredients.map((ingredient) => (
              <MenuItem key={ingredient} value={ingredient}>
                <Checkbox checked={excludeIngredientName.indexOf(ingredient) > -1} />
                <ListItemText primary={ingredient} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='mt-6'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Max prepare time (minutes) </h1>

        <Box sx={{ my: 2, mx: 1, width: 250 }}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id="demo-simple-select-label">Max prepare time</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={maxPrepareTime}
              label="Max prepare time"
              onChange={handleMaxPrepareTimeChange}
            >
              {
                maxPrepareTimeValues.map((time) => (
                  <MenuItem value={time}>{time}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className='mt-8'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Max cook time (minutes) </h1>

        <Box sx={{ my: 2, mx: 1, width: 250 }}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id="demo-simple-select-label">Max cook time</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={maxCookTime}
              label="Max cook time"
              onChange={handleMaxCookTimeChange}
            >
              {
                maxCookTimeValues.map((time) => (
                  <MenuItem value={time}>{time}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className='mt-8'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Max calories (1 serving in KCal) </h1>

        <Box sx={{ my: 2, mx: 1, width: 250 }}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id="demo-simple-select-label">Max calories</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={maxCalories}
              label="Max calories"
              onChange={handleMaxCaloriesChange}
            >
              {
                maxCaloriesValues.map((calorie) => (
                  <MenuItem value={calorie}>{calorie}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className='mt-8'>
        <h1 className='font-semibold text-md ml-2 mb-1'> Max net carbs (total carbs subtract fiber and sugar alcohols) of 1 serving in grams. </h1>

        <Box sx={{ my: 2, mx: 1, width: 250 }}>
          <FormControl fullWidth variant='filled'>
            <InputLabel id="demo-simple-select-label">Max net carbs</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={maxNetCarbs}
              label="Max net carbs"
              onChange={handleMaxNetCarbsChange}
            >
              {
                maxNetCarbsValues.map((carb) => (
                  <MenuItem value={carb}>{carb}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className='w-[256px] flex flex-row items-center justify-between gap-8 pl-2 my-8'>

        <Button
          variant='contained'
          onClick={() => {
            if(tagName.length > 0) searchParams.set('tags', tagName.join(';'));
            if(includeIngredientName.length > 0) searchParams.set('includeIngredients', includeIngredientName.join(';'));
            if(excludeIngredientName.length > 0) searchParams.set('excludeIngredients', excludeIngredientName.join(';'));
            if(searchParams.toString()) window.location.href = `/home?${searchParams.toString()}${currentUrl.hash}`
          }}
          sx={{
            textTransform: 'none'
          }}
        >
          Apply
        </Button>

        <Button
          variant='contained'
          onClick={() => {
            let url = `/home`;
            if(searchParams.get('q')) url += `?q=${searchParams.get('q')}`;
            window.location.href = url;
          }}
          sx={{
            textTransform: 'none'
          }}
        >
          Reset
        </Button>  

      </div>

    </Box>
    
    </div>
  );

  return (
    <div className='mt-[125px] max-w-[1800px] flex flex-col items-center justify-center '>

      <React.Fragment>

        <div className='mb-24 flex flex-row gap-0 h-full'>

          <Button
            variant='outlined'
            onClick={() => {
              if(search){
                searchParams.set('q', search);
                searchParams.delete('page');
                window.location.href = `/home?${searchParams.toString()}${currentUrl.hash}`;  
              }
              else{
                searchParams.delete('q');
                if(searchParams.toString()) window.location.href = `/home?${searchParams.toString()}${currentUrl.hash}`;
                else window.location.href = '/home';
              }
            }}
          >
            <SearchIcon className='scale-[125%] text-black' />
          </Button>

          <TextField 
            size='small' 
            id="filled-basic" 
            label="Search recipes" 
            variant="filled" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: '300px',
              position: 'relative'
            }}
          />

          <button
            className='px-3 bg-[#f0ecec] border-[1px] border-gray-500'
            onClick={toggleDrawer(true)}
          >
            <TuneIcon />
          </button>
        
        </div>

    
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16'>

          {

            loadingState?
            
              <div className='text-md font-bold text-center col-span-4'>
                Loading...
              </div>

            :

            !recipes || recipes.length === 0 ?

              <div className='text-md font-bold text-center col-span-4'>
                No recipes found
              </div>

            :

            recipes.slice(start, end).map((recipe, index) => (
              <Link key={index} to={`/recipe/${recipe.id}`} target='_blank' className={`flex flex-col gap-4 bg-blue-200 text-black mx-8 sm:mx-0 sm:w-[325px] p-6 rounded`}>
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
    
        <div className={`${!recipes && 'hidden'} mb-16`}>
          <Pagination
            count={Math.ceil(recipes.length / 4)} 
            color="primary" 
            page={Number(searchParams.get('page')) || 1}
            onChange={(e, page) => {
              searchParams.set('page', page);
              window.location.href = `/home?${searchParams.toString()}${currentUrl.hash}`;
            }}
            showFirstButton
            showLastButton
          />  
        </div>

        <SwipeableDrawer
          anchor={'right'}
          open={showFilter}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list('right')}
        </SwipeableDrawer>

      </React.Fragment>

    </div>

  );

}

export default Home;