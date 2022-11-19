import {Auth, getAuth, signInWithPopup, GoogleAuthProvider, UserCredential, User} from 'firebase/auth';
import {dataBase} from '../firebase.config';
import {doc, setDoc, getDoc, DocumentSnapshot, serverTimestamp} from 'firebase/firestore';
import { useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import GoogleLogo from '../assets/svg/googleIcon.svg';

export const GoogleAuth = (): JSX.Element =>
{
  
  // Hold the useLocation hook
  const location = useLocation();

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Component functions

  /*
  Uses firebase's Google authentication middleware to create or sign in the user.
  Create a new document for the user and navigate them to the home page.
  @param none
  @return none
  */
  const useGoogleAuth = async ():  Promise<void> =>
  {

    // Create the  user using the middle ware
    try
    {

      // Hold the authentication middleware
      const auth: Auth = getAuth();

      // Hold google's authentication middleware
      const provider: GoogleAuthProvider = new GoogleAuthProvider();

      // Hold the user authenticated credentials after sign in or sign up
      const result: UserCredential = await signInWithPopup(auth, provider);

      // Hold the user
      const user: User = result.user

      // Hold the document 
      const docRef = doc(dataBase, 'users', user.uid);

      // Hold the snapshot of the document
      const docSnap: DocumentSnapshot<any> = await getDoc(docRef);

      // Check if the snapshot exists
      if(!docSnap.exists())
      {

        // Set the user's document
        await setDoc(docRef,
        {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }

      // Navigate to the home page
      navigate('/');
    }

    // Catch the error from the failed promise
    catch(error)
    {
      toast.error('Could not authorize with Google', {theme: 'colored'});
      return;
    }
  }

  return (
    <>

      {/* Conditional render the GoogleAuth message */}
      <p
      className='text-neutral-content text-xl'
      >
        Sign {location.pathname === '/sign-up' ? 'up' : 'in'}  with 
      </p>

      {/* Hold the daisyui avatar component for the GoogleAuth icon */}
      <div 
      className="avatar"
      >
        <div 
        className="w-10 rounded-full bg-neutral-content !flex !items-center !justify-center cursor-pointer duration-300 hover:-translate-y-1 shadow-md"
        onClick={useGoogleAuth}
        >

          {/* Hold the GoogleAuth icon */}
          <img 
          alt="google-icon"
          className="!h-6 !w-6"
          src={GoogleLogo} 
          />
        </div>
      </div>
    </>
  )
}