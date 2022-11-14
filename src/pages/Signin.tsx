import {GoogleAuth} from '../components/GoogleAuth';
import {Auth, getAuth, signInWithEmailAndPassword, UserCredential} from 'firebase/auth'
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {SignInFormData} from '../interfaces/FormInterface';
import Background from '../assets/profile-background.jpg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import validator from 'validator'

export const Signin = (): JSX.Element =>
{

  // Hold the state of the form data
  const [formData, setFormData] = useState<SignInFormData>(
    {
    email: '',
    password: ''
  })

  // Hold the state for password visibility
  const [isPasswordVisible, setVisibility] = useState<boolean>(false);

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Component functions

  /*
  Verifies the form data and logins in the user
  through Firebase's authentication middleware.
  @param e the form submission event
  @return none
  */
  const signIn = async (e: React.SyntheticEvent): Promise<void> =>
  {

    // Prevent page refresh
    e.preventDefault();

    // Deconstruct the form data
    const {email, password} = formData;
    
    // Verify the email string
    if(!(validator.isEmail(email)))
    {
      toast.error('Not a valid email.', {theme: "colored"});
      return;
    }

    // Verify the password length
    if(password.length < 6)
    {
      toast.error('Password must be at least 6 characters long.', {theme: "colored"});
      return;
    }
    
    // Log in the user
    try
    {

      // Hold the authentication middleware 
      const auth: Auth = getAuth();

      // Hold the user's authenticated credentials
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    
      // Check if the credentials has a user
      if(userCredential.user)
      {

        // Navigate back to the home page
        navigate('/');
      }
    }

    // Catch the error from the failed promise
    catch(error)
    {
      toast.error('Invalid login email and password match does not exist.', {theme: "colored"});
      return;
    }
  }

  return(
    <>

      {/* Hold the daisyui hero component */}
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
        className="hero-content flex-col"
        >
          <div 
          className="text-center"
          >

            {/* Hold form title */}
            <h1 
            className="text-5xl font-bold text-neutral-content"
            >
              Sign in
            </h1>
          </div>

          {/* Hold the form */}
          <form 
          className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-2"
          onSubmit={signIn}
          >
            <div 
            className="card-body"
            >
              <div 
              className="form-control"
              >
                <label 
                className="label"
                >
                  <span 
                  className="label-text"
                  >
                    Email
                  </span>
                </label>
                
                {/* Hold the input for the user's email */}
                <input 
                className="input input-bordered" 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email" 
                type="text"
                value={formData.email} 
                />
              </div>
              <div 
              className="form-control"
              >
                <label 
                className="label"
                >
                  <span 
                  className="label-text"
                  >
                    Password
                  </span>
                </label>

                {/* Hold a custom flex container */}
                <div
                className='flex input input-bordered input-container'
                >
                  
                  {/* Hold the input for the user's password */}
                  <input 
                  className="border-none outline-none active:outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  placeholder="Password" 
                  type={isPasswordVisible ? 'text' : 'password'} 
                  value={formData.password}
                  />

                  {/* Hold the visibility icon */}
                  <img 
                  alt="visibility"
                  className="relative top-[12px] h-fit w-fit cursor-pointer"
                  onClick={() => setVisibility(!isPasswordVisible)}
                  src={VisibilityIcon}  
                  />
                </div>
                <label 
                className="label"
                >

                  {/* Hold the link to the forgot password route */}
                  <Link 
                  className="label-text-alt link link-hover"
                  to='/forgot-password'
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>
              
              {/* Hold the text for the user when they have no account */}
              <span
              className='pl-1 label-text-alt'
              >
                Don't have an account?{' '} 
                
                {/* Hold the link for the sign up route */}
                <Link 
                className="label-text-alt link link-hover"
                to='/sign-up'
                >
                  Sign up
                </Link>
              </span>
              <div 
              className="form-control mt-4"
              >
                <button 
                className="btn btn-primary"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <GoogleAuth />
        </div>
      </div>
    </>
  )
}