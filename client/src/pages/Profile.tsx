import {ListingItem} from '../components/ListingItem';
import {Auth, getAuth, User} from 'firebase/auth';
import {dataBase} from '../firebase.config'
import {doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import Background from '../assets/profile-background.jpg';
import { Spinner } from '../components/Spinner';

export const Profile = (): JSX.Element =>
{

  // Hold the state of the user
  const [user, setUser] = useState<User | null>(null);

  // Hold the loading state
  const [loading, setLoading] = useState<boolean>(true)

  // Hold the state of the user's listings
  const [listings, setListings] = useState<any[] | null>(null)

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Hold firebase's authentication middleware
  const auth: Auth = getAuth();

  // On mount retrieve the user from the authentication middleware and 
  // the listing using the firestore middleware
  useEffect(() => {

    // Set the user state using the authentication middleware
    setUser(auth.currentUser);
    
    // Fetch the user's listings
    fetchUserListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, auth.currentUser])

  // Component functions

  /*
  Fetch the listings of the user using the firestore middleware.
  @param none
  @return none
  */
  const fetchUserListings = async (): Promise<void> =>
  {

    // Hold the reference to the listing collection
    const listingsRef = collection(dataBase, 'listings')

    // Hold a query of the listing collection
    const q = query(
      listingsRef,
      where('userRef', '==', auth.currentUser?.uid),
      orderBy('timestamp', 'desc')
    )

    // Hold the snapshot of the query
    const querySnap = await getDocs(q);

    // Hold the user's listings
    let listings: any = []

    // Loop through the documents and push the listing
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    // Set the listings
    setListings(listings)
    
    // Set the loading state to false
    setLoading(false)
  }

  /*
  Sign out the user using the firebase authentication middleware. Redirect
  the user back to the home page.
  @param none
  @return none
  */
 const signOut = (): void =>
 {

  // Sign out using the authentication middleware
  auth.signOut();

  // Navigate back to the home page
  navigate('/')
 }

 /*
 Delete the listing from the firestore.
 @param listingId the id of the listing
 @return none
 */
 const onDelete = async (listingId: string) => 
 {

    // Alert the user if they want to delete the listing
    if (window.confirm('Are you sure you want to delete?')) 
    {

      // Delete the document using the firestore middleware
      await deleteDoc(doc(dataBase, 'listings', listingId))

      // Update the user's listings
      const updatedListings = listings?.filter(
        (listing) => listing.id !== listingId
    )

    // Check if the listing's were updated
    if(updatedListings)
    {

      // Set the listings with the updated listings
      setListings(updatedListings)
    }

    // Send the user a message that the listing was deleted
    toast.success('Successfully deleted listing', {theme: 'colored'});
    }
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
      className="hero min-h-full w-full" 
      style={{ backgroundImage: `url(${Background})` }}
      >

        {/* Hold the hero-overlay daisyui component for an added aesthetic */}
        <div 
        className="hero-overlay bg-opacity-60"
        >  
        </div>
        <div 
        className="text-neutral-content h-full w-full py-8 px-12 pb-20"
        >
          <div 
          className="flex w-full justify-between"
          >
            <div
            id="container"
            >
              <p 
              className="text-xl"
              >
                Welcome,
              </p>
              
              {/* Display the user's name */}
              <p 
              className="text-xl"
              >
                {user?.displayName}
              </p>
            </div>

            {/* Hold the log out button */}
            <button 
            className="btn btn-primary font-normal"
            onClick={signOut}
            >
              Log Out
            </button>
          </div>

          {/* Conditional render the listing component */}
          {listings !== null && 
          <>
            <p 
            className="text-xl text-center"
            >
              Your Listings
            </p>
          </>
          }

          {/* Map through the listings and rending a ListingItem */}
          {listings?.map((listing) =>
            {
              
              // Return a ListingItem component with props
              return (
                <>
                  <div 
                  className="w-full flex flex-col justify-start"
                  >
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

                    {/* Hold the row for the button */}
                    <div 
                    className="w-fit flex "
                    id="button-row"
                    >

                      {/* Hold the delete button */}
                      <button
                      className="btn btn-error text-neutral-content font-normal mr-8"
                      onClick={() => onDelete(listing.id)}
                      >
                        Delete
                      </button>

                      {/* Hold the edit button */}
                      <button
                      className="btn btn-success text-neutral-content font-normal"
                      onClick={() => navigate(`/edit/${listing.id}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </>
              )
            }
          )}
          
          {/* Hold the button to edit a listing */}
          <button
          className="btn btn-primary font-normal mx-auto block mt-4"
          onClick={() => navigate('/new-listing')}
          >
            Add a listing
          </button>
        </div>
      </div>
    </>
  )
}