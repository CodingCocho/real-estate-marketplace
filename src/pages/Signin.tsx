import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {FormData} from '../interfaces/FormInterface';
import validator from 'validator'

export const Signin = (): JSX.Element =>
{

  // Hold the state of the form data
  const [formData, setFormData] = useState<FormData>(
    {
    email: '',
    password: ''
  })

  // Component functions

  /*
  Verifies the form data and logins in the user
  through Firebase's authentication middleware.
  @param e the form submission event
  @return none
  */
  const signIn = (e: React.SyntheticEvent): void =>
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
    if(password.length <= 6)
    {
      toast.error('Password must be at least 6 characters long.', {theme: "colored"});
      return;
    }
    
    // Check if the user exists in the database


    // Log in the user

    
    // Navigate the user to their profile
    console.log(email);
    console.log(password);
  }

  return(
    <>

      {/* Hold the daisyui hero component */}
      <div 
      className="hero"
      >
        <div 
        className="hero-content flex-col"
        >
          <div 
          className="text-center"
          >

            {/* Hold form title */}
            <h1 
            className="text-5xl font-bold"
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
                placeholder="email" 
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

                {/* Hold the input for the user's password */}
                <input 
                className="input input-bordered"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder="password" 
                type="password" 
                value={formData.password}
                />
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
        </div>
      </div>
    </>
  )
}