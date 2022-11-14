import {GoogleAuth} from '../components/GoogleAuth';
import {Auth, createUserWithEmailAndPassword, getAuth, updateProfile, User, UserCredential} from 'firebase/auth';
import {dataBase} from '../firebase.config';
import {doc, setDoc, serverTimestamp} from 'firebase/firestore';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {SignUpFormData} from '../interfaces/FormInterface';
import Background from '../assets/profile-background.jpg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import validator from 'validator'

export const Signup = (): JSX.Element =>
{

  // Hold the state of the form data
  const [formData, setFormData] = useState<SignUpFormData>(
    {
    email: '',
    name: '',
    password: ''
  })

  // Hold the state for password visibility
  const [isPasswordVisible, setVisibility] = useState<boolean>(false);

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Component functions

  /*
  Verifies the form data and creates a user
  through Firebase's authentication middleware.
  @param e the form submission event
  @return none
  */
  const signUp = async (e: React.SyntheticEvent): Promise<void> =>
  {

    // Prevent page refresh
    e.preventDefault();

    // Deconstruct the form data
    const {email, name, password} = formData;

    // Verify there is inputs
    if(!email || !name || !password)
    {
      toast.error('Make sure all fields are filled..', {theme: "colored"});
      return;
    }

    // Verify the email string
    if(!(validator.isEmail(email)))
    {
      toast.error('Not a valid email.', {theme: "colored"});
      return;
    }

    // Verify the password length
    if(password.length < 6)
    {
      toast.error('Password must be at least 6 characters long', {theme: "colored"});
      return;
    }

    // Create the user using the middleware
    try
    {

      // Hold the authentication middleware 
      const auth:Auth = getAuth();

      // Hold the user's authenticated credentials
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Hold the user
      const user: User = userCredential.user;

      // Add the name to the user's info properties
      updateProfile(user,
        {
          displayName: name
        })

        // Hold a copy of the form data
        const formDataCopy: SignUpFormData = {...formData};
        
        // Delete the password field
        delete formDataCopy.password;

        // Add the timestamp field
        formDataCopy.timestamp = serverTimestamp();

        // Create a document for the user in the database
        await setDoc(doc(dataBase, 'users', user.uid), formDataCopy);

        // Navigate the user to their profile
        navigate('/profile')
    }

    // Catch the error from the failed promise
    catch(error)
    {
      toast.error('User already exists', {theme: "colored"});
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
                    Name
                  </span>
                </label>
                
                {/* Hold the input for the user's name */}
                <input 
                className="input input-bordered" 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Name" 
                type="text"
                value={formData.name} 
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
          <GoogleAuth />
        </div>  
      </div>
    </>
  )
}