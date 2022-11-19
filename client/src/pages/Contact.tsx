import {Spinner} from '../components/Spinner';
import {dataBase} from '../firebase.config';
import {doc, DocumentData, getDoc} from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Background from '../assets/profile-background.jpg';


export const Contact = (): JSX.Element =>
{

  // Hold the state of the message to send to the landlord
  const [message, setMessage] = useState<string>('');

  // Hold the state of the landlord's account
  const [landlord, setLandlord] = useState<DocumentData | null>(null);

  // Hold the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Hold the useSearchParams hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  // Hold the useParams hook
  const params = useParams();

  // On mount get the landlord
  useEffect(() => 
  {
    getLandlord();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  /*
  Submit the form and open the mail window with the state data.
  @param e the form submission event
  @return none
  */
  const contactLandlord = (e: React.SyntheticEvent) =>
  {

    // Prevent page refresh
    e.preventDefault();

    // Open the mail window the state data
    window.open(`mailto:${landlord?.email}?subject=${searchParams.get('listingName')}&body=${message}`);
    
    // Reset the message state
    setMessage('');
  } 

  /*
  Get the landlord using the Firebase middleware.
  @param none
  @return none
  */
  const getLandlord = async (): Promise<void> =>
  {

    // Check if we have params
    if(params.userId)
    {

      // Hold the reference to the user document 
      const docRef = doc(dataBase, 'users', params.userId);

      // Hold the snapshot of the document
      const docSnap = await getDoc(docRef);

      // Check if there is a snapshot of the document
      if(docSnap.exists())
      {

        // Set the landlord data
        setLandlord(docSnap.data())
      }

      // Else send an error
      else
      {
        toast.error('Landlord does not exist', {theme: 'colored'})
      }
    }

    // Set loading to false
    setLoading(false);
  }

  // If the page is loading render the Spinner
  if(loading)
  {
    return <Spinner />
  }

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
        className="text-neutral-content h-full w-full py-8 px-12 flex flex-col items-center justify-center"
        >

          {/* Hold form title */}
          <h1 
            className="text-3xl font-bold text-neutral-content text-center"
            >
              Contact Landlord
          </h1>

          {/* Hold the contact form */}
          <form
          className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-2"
          onSubmit={contactLandlord}
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
                    To: {landlord?.name}
                   </span>
                </label>
                
                {/* Hold the textarea for the contact form */}
                <textarea 
                className="textarea textarea-primary text-neutral"
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Message"
                value={message}
                >
                </textarea>
              </div>

              {/* Hold the submit button */}
              <button
              className="btn btn-primary"
              type="submit"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}