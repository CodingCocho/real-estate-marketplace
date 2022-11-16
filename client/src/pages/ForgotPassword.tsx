import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast}from 'react-toastify';
import Background from '../assets/profile-background.jpg';

export const ForgotPassword = (): JSX.Element =>
{

  // Hold the state of the recovery email
  const [email, setEmail] = useState<string>('');

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Component functions

  /*
  Use the firebase authentication middleware to send an email to the user
  so they can reset their password. Navigate the user to the sign
  in page after.
  @param none
  @return none
  */
  const recoverPassword = async(): Promise<void> =>
  {

    // Send the reset link
    try
    {

      // Hold the authentication middleware
      const auth = getAuth();

      // Send the reset email using the middleware
      await sendPasswordResetEmail(auth, email);

      // Notify the user the email was sent
      toast.success('Email was sent.', {theme: 'colored'})

      // Navigate the user to the sign in page
      navigate('/sign-in');
    }
    catch(error)
    {
      toast.error('Email is invalid.', {theme: 'colored'});
    }
  }

  return(
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
        <div 
        className="text-neutral-content h-full w-full p-4 max-w-7x flex flex-col items-center justify-center"
        >
          <p
          className='text-xl'
          >
            Forgot Password?
          </p>
          <div 
          className="form-control mt-2"
          >

            {/* Hold the input for the recovery email */}
            <input 
            className="input input-bordered max-w-xs text-neutral" 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recovery email"
            type="text"  
            value={email}
            />
          </div>

          {/* Hold the button to send the reset password link */}
          <button
          className='btn btn-primary mt-2'
          onClick={recoverPassword}
          >
            Send reset password link
          </button>
        </div>  
        </div>
      </div>
    </>
  )
}