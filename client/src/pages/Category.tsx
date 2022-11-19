import {ListingItem} from '../components/ListingItem';
import {Logo} from '../components/Logo';
import {Spinner} from '../components/Spinner';
import {dataBase} from '../firebase.config';
import {collection, CollectionReference, getDocs, orderBy, Query, query, QuerySnapshot, where} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Background from '../assets/profile-background.jpg';


export const Category = (): JSX.Element =>
{

  // Hold the state of the listings
  const [listings, setListings] = useState<any[] | null>(null);

  // Hold the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Hold the useParams hook
  const params = useParams();

  // On mount fetch the listings
  useEffect(() => {
    
    // Call the fetch method
    fetchListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Component functions

  /*
  Fetch the listings from the firestore database using the firebase 
  middleware. Update the listing state with the listings.
  @param none
  @return none
  */
  const fetchListings = async (): Promise<void> =>
    {

      // Use firebase middleware to fetch the firestore data
      try
      {

        // Hold the reference to the listings collection from firestore
        const listingRef: CollectionReference = collection(dataBase, 'listings');

        // Set a query of the listings matching the corresponding type
        const myQuery: Query<any> = query(listingRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'));

        // Hold a snapshot of the query
        const querySnap: QuerySnapshot<any> = await getDocs(myQuery);

        // Hold the listings
        const listings: any[] = [];

        // Loop through the snapshot 
        querySnap.forEach((doc) =>
        {

          // Push a new listing
          listings.push(
            {
              id: doc.id,
              data: doc.data()
            }
          )
        })

        // Update the listing state
        setListings(listings);

        // Update the loading state
        setLoading(false);
      }

      // Catch the error 
      catch(error)
      {
        toast.error('Could not fetch listing', {theme: 'colored'})
        setLoading(false);
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
        className="h-full w-full py-8 px-4 sm:px-12"
        >
          <Logo/>
          <p
          className='text-neutral-content text-[18px] sm:text-[24px] text-center block mt-4'
          >
            PLACES FOR {params.categoryName?.toUpperCase()}
          </p>

          {/* Map out the listings from our state */}
          {listings?.map((listing) =>
          {
            
            // Return a ListingItem component with props
            return (
              <ListingItem
              bathrooms={listing.data.bathrooms}
              bedrooms={listing.data.bedrooms}
              discountedPrice={listing.data.discountedPrice}
              id={listing.id}
              images={listing.data.imageUrls} 
              key={listing.id}
              location={listing.data.location}
              offer={listing.data.offer}
              name={listing.data.name}
              regularPrice={listing.data.regularPrice}
              type={listing.data.type}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}