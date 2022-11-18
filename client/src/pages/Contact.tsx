import {Spinner} from '../components/Spinner';
import {dataBase} from '../firebase.config';
import {doc, DocumentData, getDoc} from 'firebase/firestore';
import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Background from '../assets/profile-background.jpg';


export const Contact = (): JSX.Element =>
{

  const [message, setMessage] = useState<string>('');
  const [landlord, setLandlord] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => 
  {
    getLandlord();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const contactLandlord = (e: React.SyntheticEvent) =>
  {
    e.preventDefault();
    window.open(`mailto:${landlord?.email}?subject=${searchParams.get('listingName')}&body=${message}`);
    setMessage('');
  } 

  const getLandlord = async () =>
  {
    if(params.userId)
    {
      const docRef = doc(dataBase, 'users', params.userId);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists())
      {
        setLandlord(docSnap.data())
        console.log(docSnap.data());
      }
      else
      {
        toast.error('Landlord does not exist', {theme: 'colored'})
      }
    }
    setLoading(false);
  }

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
                <textarea 
                className="textarea textarea-primary text-neutral"
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Message"
                value={message}
                >
                </textarea>
              </div>
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