import {Auth, getAuth, User} from 'firebase/auth';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Background from '../assets/profile-background.jpg';

export const Profile = (): JSX.Element =>
{

  // Hold the state of the user
  const [user, setUser] = useState<User | null>(null);

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Hold firebase's authentication middleware
  const auth: Auth = getAuth();

  // On mount retrieve the user from the authentication middleware
  useEffect(() => {

    // Set the user state using the authentication middleware
    setUser(auth.currentUser);
  }, [user, auth.currentUser])

  // Component functions

  /*
  Sign out the user using the firebase authentication middleware. Redirect
  the user back to the home page.
  @param none
  @return none
  */
 const signOut = (): void =>
 {

  // Sign out using the authentication middleware
  auth.signOut();

  // Navigate back to the home page
  navigate('/')
 }
  
  let hasListings = false;
  return (
    <>

      {/* Hold the hero daisyui component */}
      <div 
      className="hero h-full w-full" 
      style={{ backgroundImage: `url(${Background})` }}
      >

        {/* Hold the hero-overlay daisyui component for an added aesthetic */}
        <div 
        className="hero-overlay bg-opacity-60"
        >  
        </div>
        <div 
        className="text-neutral-content h-full w-full py-8 px-12"
        >
          <div 
          className="flex w-full justify-between"
          >
            <div
            id="container"
            >
              <p 
              className="text-xl"
              >
                Welcome,
              </p>
              
              {/* Display the user's name */}
              <p 
              className="text-xl"
              >
                {user?.displayName}
              </p>
            </div>

            {/* Hold the log out button */}
            <button 
            className="btn btn-primary font-normal"
            onClick={signOut}
            >
              Log Out
            </button>
          </div>

          {/* Conditional render the listing component */}
          {
            hasListings ?
            <>
              <p
              className="text-[1.5em] mt-8"
              >
                Your Listings
              </p>
              <div 
              className="card"
              >
                  <div 
                  className="card-body"
                  >
                  </div>
              </div>
            </>
            :
            <>
            </>
          }
          
          {/* Hold the button to edit a listing */}
          <button
          className="btn btn-primary font-normal mx-auto block mt-4"
          onClick={() => navigate('/new-listing')}
          >
            Add a listing
          </button>
        </div>
      </div>
    </>
  )
}