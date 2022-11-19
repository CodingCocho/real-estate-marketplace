import {Spinner} from '../components/Spinner';
import {getAuth} from 'firebase/auth';
import {dataBase} from '../firebase.config';
import {getDoc, doc, DocumentData} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import SwiperCore, {A11y, Navigation, Pagination, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css';
import Background from '../assets/profile-background.jpg';
import shareIcon from '../assets/svg/shareIcon.svg';

export const Listing = (): JSX.Element =>
{

  // Hold the listing state
  const [listing, setListing] = useState<DocumentData | null>(null);

  // Hold the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Hold the state of when the link is copied
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Hold the useParams hook
  const params = useParams();

  // On mount fetch the listing
  useEffect(() => 
  {
    fetchListing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Component functions

  /*
  Add the link to the listing to the user's clipboard.
  @param none
  @return none
  */
  const copyLink = () =>
  {

    // Hold the link to the listing
    navigator.clipboard.writeText(window.location.href);

    // Set the share link state as true
    setShareLinkCopied(true);

    // Set a time out 
    setTimeout(() => 
    {

      // Set the share link to false after 2 seconds
      setShareLinkCopied(false)
    }, 2000)
  }

  /*
  Fetch the listing using the Firebase Firestore middleware.
  @param none 
  @return none
  */
  const fetchListing = async () =>
  {

    // Check if there is listingId
    if(params.listingId)
    {

      // Hold the reference to the document
      const docRef = doc(dataBase, 'listings', params.listingId);

      // Hold the snapshot of the document 
      const docSnap = await getDoc(docRef);
      
      // Check if the snapshot exists
      if(docSnap.exists())
      {

        // Set the listing with snapshot data
        setListing(docSnap.data())

        // Set the loading state to false
        setLoading(false);
      }

      // Else send an error to the user
      else
      {
        toast.error('Listing does not exist', {theme: 'colored'})
      }
    }    
  }

  // If the page is loading render the Spinner
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
        className="text-neutral-content h-full w-full"
        >
        
          {/* Hold the daisyui avatar component for the ShareLink icon */}
          <div 
          className="avatar absolute right-[3.5rem] z-10 top-[2rem]"
          >
            <div 
            className="w-10 rounded-full bg-neutral-content !flex !items-center !justify-center cursor-pointer duration-300 hover:-translate-y-1 shadow-md"
            onClick={copyLink}
            >

              {/* Hold the ShareLink icon */}
              <img 
              alt="share-icon"
              className="!h-6 !w-6"
              src={shareIcon} 
              />
            </div>
          </div>

          {/* Conditional render that the link was copied */}
          {shareLinkCopied &&
            <>
              <p
              className="text-[18px] absolute right-[.75rem] top-[4.5rem] z-10"
              >
                LINK COPIED!
              </p>
            </>
          }

          {/* Hold the Swiper component for the listing's images */}
          <Swiper
          className="w-screen h-[30vh]"
          pagination={{ clickable: true }} 
          slidesPerView={1} 
          >
            
            {/* Map the images of the listing for the Swiper */}
            {listing?.imageUrls.map((url: string, index: number) => (
              <SwiperSlide
              className="w-full h-full" 
              key={index}
              >
                <div
                className="w-full h-full"
                style={{
                  background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover',
                }} 
                >                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div 
          className="w-full px-12"
          >
            <div 
            className="w-full flex justify-between items-center" 
            id="row"
            >
              <div 
              id="column"
              >
                <p
                className="text-xl mt-4"
                >
                  {listing?.name} - ${listing?.offer
                  ? listing?.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : listing?.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                </p>
                <p 
                className="text-lg"
                >
                  {listing?.location}
                </p>
              </div>
              <div 
              className="rounded-[20px] py-1 px-3 bg-primary w-fit h-fit cursor-default text-md"
              >
                For {listing?.type}
              </div>
            </div>
            <p 
            className="text-md"
            >
              {listing?.bedrooms} Bedrooms
            </p>
            <p 
            className="text-md"
            >
              {listing?.bathrooms} Bathrooms
            </p>
            {listing?.furnished && 
            <p 
            className="text-md"
            >
              Furnished
            </p>
            }
            {listing?.parking && 
            <p 
            className="text-md"
            >
              Parking
            </p>
            }
            <p 
            className="text-xl"
            >
              Location
            </p>
            
            {/* Hold the container for the Leaflet map */}
            <div 
            className="w-full h-[30vh] overflow-x-hidden relative z-0 mb-[3rem] mt-4"
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

            {/* Hold the button to contact the landlord */}
            <button
            className="btn btn-primary mx-auto block"
            onClick={() => navigate(`/contact/${listing?.userRef}?listingName=${listing?.location}`)}
            >
              Contact Landlord
            </button>
          </div>
        </div>
      </div>
    </>
  )
}