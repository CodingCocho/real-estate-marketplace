import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {Navbar} from '../components/Navbar';
import {Explore} from '../pages/Explore';
import {ForgotPassword} from '../pages/ForgotPassword';
import {Offers} from '../pages/Offers';
import {Profile} from '../pages/Profile';
import {Signin} from '../pages/Signin';
import {Signup} from '../pages/Signup';


function App(): JSX.Element {
  return (
    <>
    
      {/* Establish the route router for the application */}
      <Router>

        {/* Hold the main container for each page */}
        <main
        className='bg-base-200 flex items-center justify-center min-w-screen page'
        >

          {/* Hold the routes of the router*/}
          <Routes>

            {/* Hold the route for the explore page */}
            <Route 
            element={<Explore/>}
            path='/'
            >
            </Route>

            {/* Hold the route for the offers page */}
            <Route 
            element={<Offers/>}
            path='/offers'
            >
            </Route>

            {/* Hold the route for the profile page */}
            <Route 
            element={<Signin/>}
            path='/profile'
            >
            </Route>

            {/* Hold the route for the sign in page */}
            <Route 
            element={<Signin/>}
            path='/sign-in'
            >
            </Route>

            {/* Hold the route for the forgot password page */}
            <Route 
            element={<ForgotPassword/>}
            path='/forgot-password'
            >
            </Route>

            {/* Hold the route for the sign up page */}
            <Route 
            element={<Signup/>}
            path='/sign-up'
            >
            </Route>
          </Routes>
        </main>

        {/* Hold the Navbar component to navigate between routes */}
        <Navbar/>

        {/* Allow toasts to be used in the application */}
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
