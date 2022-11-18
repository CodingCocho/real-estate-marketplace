import {Spinner} from '../components/Spinner';
import {getAuth} from 'firebase/auth';
import {dataBase} from '../firebase.config';
import {getDoc, doc, DocumentData} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Background from '../assets/profile-background.jpg';
import shareIcon from '../assets/svg/shareIcon.svg';



export const Listing = (): JSX.Element =>
{
  const [listing, setListing] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => 
  {
    fetchListing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const copyLink = () =>
  {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => 
    {
      setShareLinkCopied(false)
    }, 2000)
  }

  const fetchListing = async () =>
  {
    if(params.listingId)
    {
      const docRef = doc(dataBase, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists())
      {
        setListing(docSnap.data())
        setLoading(false);
      }
      else
      {
        toast.error('Listing does not exist', {theme: 'colored'})
      }
    }    
  }

  if(loading)
  {
    return <Spinner/>
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
        className="text-neutral-content h-full w-full py-8 px-12"
        >
        
          {/* Hold the daisyui avatar component for the GoogleAuth icon */}
          <div 
          className="avatar absolute right-[3rem] z-10"
          >
            <div 
            className="w-10 rounded-full bg-neutral-content !flex !items-center !justify-center cursor-pointer duration-300 hover:-translate-y-1 shadow-md"
            onClick={copyLink}
            >

              {/* Hold the GoogleAuth icon */}
              <img 
              alt="google-icon"
              className="!h-6 !w-6"
              src={shareIcon} 
              />
            </div>
          </div>
          {shareLinkCopied &&
            <>
              <p
              className="text-[18px] absolute right-[.75rem] top-[4.5rem] z-10"
              >
                LINK COPIED!
              </p>
            </>
          }
          <div 
          className="w-full h-[30vh] overflow-x-hidden relative z-0 mb-[3rem]"
          >
            {listing &&
            <>
              <MapContainer
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              className="!w-full !h-full"
              zoom={13}
              scrollWheelZoom={false}
         
              >
                <TileLayer
                attribution='&copy; <a  href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                />

                <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup
                  >
                    {listing.location}
                  </Popup>
                </Marker>
              </MapContainer>
            </>
            }
          </div>
          <button
          className="btn btn-primary mx-auto block"
          onClick={() => navigate(`/contact/${listing?.userRef}?listingName=${listing?.location}`)}
          >
            Contact Landlord
          </button>
        </div>
      </div>
    </>
  )
}