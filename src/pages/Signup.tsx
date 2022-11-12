import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {FormData} from '../interfaces/FormInterface';
import validator from 'validator'

export const Signup = (): JSX.Element =>
{

  // Hold the state of the form data
  const [formData, setFormData] = useState<FormData>(
    {
    email: '',
    password: ''
  })

  // Component functions

  /*
  Verifies the form data and creates a user
  through Firebase's authentication middleware.
  @param e the form submission event
  @return none
  */
  const signUp = (e: React.SyntheticEvent): void =>
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

    // Check if the user exists

    // Verify the password length
    if(password.length <= 6)
    {
      toast.error('Password must be at least 6 characters long', {theme: "colored"});
      return;
    }

    // Create the user using the middleware


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
              Sign up
            </h1>
          </div>

          {/* Hold the form */}
          <form 
          className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-2"
          onSubmit={signUp}
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
              </div>
              <div 
              className="form-control mt-4"
              >
                <button 
                className="btn btn-primary"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}