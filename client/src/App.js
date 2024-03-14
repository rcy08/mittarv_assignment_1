
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Signin from './pages/Signin';
import Home from './pages/Home';
import Loader from './Loader';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Recipe from './pages/Recipe';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';

import { useAuthContext } from './hooks/useAuthContext';
import { useLoadingContext } from './hooks/useLoadingContext';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';

import '@mantine/core/styles.css';
import MyRecipe from './pages/MyRecipe';

function App() {

  const { signedin, dispatch } = useAuthContext();
  const { loadingState, loadingDispatch } = useLoadingContext();

  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  setTimeout(() => {
    if(signedin){
      localStorage.removeItem('user');
      dispatch({ type: 'SIGNOUT' });
      searchParams.set('redirect_uri', currentUrl);
      for (const key of searchParams.keys()) {
        if(key !== 'redirect_uri') searchParams.delete(key);
      }
      window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
    }
  }, 24*60*60*1000);

  return (
    <div className="App">

      { loadingState && <Loader /> }
      
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <Routes>

        <Route
          path='/'
          element={<Navigate to='/home' />}
        />
        <Route
          path='/home'
          element={<Home />}
        />
        <Route
          path='/auth/signin'
          element={ signedin ? <Navigate to='/' /> : <Signin /> }
        />
        <Route
          path='/auth/email-verification'
          element={ signedin ? <Navigate to='/' /> : <EmailVerification /> }
        />
        <Route
          path='/auth/forgot-password'
          element={ signedin ? <Navigate to='/' /> : <ForgotPassword /> }
        />
        <Route
          path='/auth/reset-password'
          element={ signedin ? <Navigate to='/' /> : <ResetPassword /> }
        />
        <Route
          path='/recipe/:id'
          element={<Recipe />}
        />
        <Route
          path='/recipes/my'
          element={ <MyRecipe /> }
        />
        <Route
          path='*'
          element={<NotFound />}
        />
        
      </Routes>

    </div>
  );
}

export default App;








// [
//   {
//     "id":"2807982c-986a-4def-9e3a-153a3066af7a",
//     "name":"Ultimate Keto Blueberry Sponge Cake In A Mug",
//     "tags":[
//       "15-minute-meals",
//       "beef-free",
//       "breakfast",
//       "chicken-free",
//       "dairy-free",
//       "desserts",
//       "eggs",
//       "fish-free",
//       "gluten-free",
//       "keto",
//       "kid-friendly",
//       "low-carb",
//       "one-pot-meals",
//       "peanut-free",
//       "pescatarian",
//       "pork-free",
//       "quick-easy",
//       "shellfish-free",
//       "snacks",
//       "soy-free",
//       "tree-nut-free",
//       "vegetarian",
//       "wheat-free"
//     ],
//     "description":"Instead of making pancakes or waffles, make this easy Keto breakfast recipe that takes way less time to make. This blueberry sponge cake in a mug is soft and fluffy like a pancake but sweet like a cake. Don’t worry, you won’t be adding many carbs to your breakfast, as all sweetening products are replaced with Keto-friendly ingredients. You can assemble the recipe in under 5 minutes, so this is also a great Keto breakfast recipe for anyone who always ends up in a rush in the mornings. Even if you’re in a rush, you can still enjoy this sweet and delicious sponge cake breakfast! If you want to serve your sponge cake with a little whipped cream, you can whip heavy cream and liquid stevia together in a stand mixer or food processor.\n\n### Other ingredients to add\n\nLike to have a little more in your sponge cake? Try stirring in crushed nuts for more texture. Keto-friendly nuts include cashews, walnuts, pecan, hazelnuts, and even peanuts. Blueberries also happen to taste very good with lemon. Try mixing a little lemon zest in your dry ingredients!\n\n### Can other berries be used?\n\nBlueberries are one of the most Keto-friendly berries out there. If you don’t like blueberries, try raspberries or strawberries. If you’re using strawberries in the mug cake, make sure to chop them finely.\n\n### What type of mug should I use?\n\nA heat-safe mug or dish can easily be a coffee cup from your kitchen. Choose any type of ceramic mug to keep your hands safe as well as cook the sponge cake. If you own a ceramic ramekin, you can also cook your sponge cake in there.",
//     "prepareTime":3,
//     "cookTime":2,
//     "ingredients":[
//       {
//         "name":"Butter",
//         "servingSize":{
//           "units":"tablespoon",
//           "desc":"1 tablespoon",
//           "qty":1.0,
//           "grams":14.0,
//           "scale":1.0
//         }
//       },
//       {
//         "name":"Cream Cheese",
//         "servingSize":{
//           "units":"tablespoon",
//           "desc":"2 tablespoon",
//           "qty":2.0,
//           "grams":29.0,
//           "scale":2.0
//         }
//       },
//       {
//         "name":"Coconut Flour",
//         "servingSize":{
//           "units":"tablespoon",
//           "desc":"2 tablespoon",
//           "qty":2.0,
//           "grams":14.0,
//           "scale":0.125
//         }
//       },
//       {
//         "name":"The Ultimate Sugar Replacement Granular by Swerve",
//         "servingSize":{
//           "units":"tablespoon",
//           "desc":"1 tablespoon",
//           "qty":1.0,
//           "scale":3.0
//         }
//       },
//       {
//         "name":"Vanilla Extract",
//         "servingSize":{
//           "units":"teaspoon",
//           "desc":"1 teaspoon",
//           "qty":1.0,
//           "grams":4.0,
//           "scale":1.0
//         }
//       },
//       {
//         "name":"Baking Powder",
//         "servingSize":{
//           "units":"teaspoon",
//           "desc":"¼ teaspoon",
//           "qty":0.25,
//           "scale":0.25
//         }
//       },
//       {
//         "name":"Raw Egg",
//         "servingSize":{
//           "units":"large",
//           "desc":"1 large",
//           "qty":1.0,
//           "grams":50.0,
//           "scale":1.0
//         }
//       },
//       {
//         "name":"Blueberries, Frozen, Unsweetened",
//         "servingSize":{
//           "units":"tablespoon",
//           "desc":"1-½ tablespoon",
//           "qty":1.5,
//           "grams":22.0,
//           "scale":0.094
//         }
//       }
//     ],
//     "steps":[
//       "Combine the butter and cream cheese together in a heat-safe container. Microwave the ingredients on high heat for 20 seconds until they’re melted. Stir the butter and cream cheese together into one mixture.",
//       "Combine the butter and cream cheese mixture with coconut flour, brown sugar substitute, and vanilla extract in the heat-safe dish. You may also wish to add a small pinch of salt. If necessary, you can mix the ingredients in a separate mixing bowl before adding it to your heat-safe dish or mug.",
//       "Mix the egg into the batter. Follow by folding the blueberries into the batter. It may help you to freeze the blueberries beforehand so they don’t break up and bleed in the batter.",
//       "Microwave your mug of batter on high heat for 1 minute. The cake should puff considerably! Serve with whipped cream if desired."
//     ],
//     "servings":2,
//     "servingSizes":[
//       {
//         "scale":1.0,
//         "qty":1.0,
//         "grams":100.0,
//         "units":"servings",
//         "originalWeight":100.0,
//         "originalWeightUnits":"g"
//       }
//     ],
//     "nutrients":{
//       "caloriesKCal":185.437,
//       "caloriesKJ":763.317,
//       "totalCarbs":12.83,
//       "diabetesCarbsADA":9.83,
//       "netCarbs":4.032,
//       "diabetesCarbs":4.035,
//       "fiber":2.792,
//       "starch":1.213,
//       "sugar":2.514,
//       "addedSugar":0.0,
//       "sugarAlcohols":6.006,
//       "protein":5.145,
//       "fat":14.471,
//       "transFat":0.403,
//       "monousatFat":3.811,
//       "polyunsatFat":0.815,
//       "omega3Fat":0.075,
//       "omega6Fat":0.74,
//       "saturatedFat":8.398,
//       "cholesterol":123.147,
//       "vitaminA":130.784,
//       "vitaminC":0.27,
//       "vitaminD":0.562,
//       "vitaminE":0.605,
//       "vitaminK":2.651,
//       "vitaminB1":0.028,
//       "vitaminB2":0.177,
//       "vitaminB3":0.137,
//       "vitaminB5":0.498,
//       "vitaminB6":0.064,
//       "vitaminB12":0.322,
//       "potassium":96.907,
//       "magnesium":10.781,
//       "calcium":63.155,
//       "iron":0.49,
//       "zinc":0.482,
//       "copper":0.064,
//       "phosphorus":87.572,
//       "sodium":198.378,
//       "selenium":10.234,
//       "folate":13.833,
//       "choline":80.661,
//       "alcohol":0.746,
//       "caffeine":0.0,
//       "gluten":0.0,
//       "manganese":0.207,
//       "conjugatedLinoleicAcid":0.038,
//       "phyticAcid":74.205,
//       "xylitol":0.0,
//       "isomalt":0.0,
//       "sorbitol":0.0,
//       "maltitol":0.0,
//       "lactitol":0.0,
//       "erythritol":0.0,
//       "pinitol":0.0,
//       "inositol":0.006,
//       "mannitol":0.0
//     },
//     "image":"https://tinyurl.com/2p82zzca/2807982c-986a-4def-9e3a-153a3066af7a.png"
//   }
// ]
