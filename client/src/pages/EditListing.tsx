import geocodingService from '../api/geocodingAPI';
import {Spinner} from '../components/Spinner';
import {Auth, getAuth, onAuthStateChanged} from 'firebase/auth';
import {dataBase} from '../firebase.config';
import {doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import React, {useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {v4 as uuidv4} from 'uuid';
import Background from '../assets/profile-background.jpg';

export const EditListing = (): JSX.Element =>
{

  // Hold error constant
  const geocodingError = 'ZERO_RESULTS';

  // Hold the state of listing data
  const [listingData, setListingData] = useState<any>(
    {
      bathrooms: 1,
      bedrooms: 1,
      discountedPrice: 0,
      furnished: false,
      geolocation:
      {
        lat: 0,
        lng: 0
      },
      imageUrls: null,
      location: '',
      name: '',
      offer: false,
      parking: false,
      regularPrice: 0,
      timestamp: undefined,
      type: 'sale',
      userRef: ''
    }
  )

  // Hold the listing document
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listing, setListing] = useState<any | null>(null);
  
  // Hold the state of images from the file input
  const [images, setImages] = useState<any>({})

  // Hold the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Hold the firebase authentication middleware
  const auth: Auth = getAuth();

  // Hold the useNavigate hook
  const navigate = useNavigate();

  // Hold the useParams hook
  const params = useParams();

  // Hold the reference to the mounting status of the component
  const isMounted = useRef<boolean>(true);

  // On mount check if the component is mounted and create the listing reference to the user
  useEffect(() => {
    if(isMounted)
    {

      // Check if the user has been authenticated 
      onAuthStateChanged(auth, (user) =>
      {

        // Check if there is a user
        if(user)
        {

          // Update the listing data with the user id and timestamp
          setListingData({...listingData, userRef: user.uid});

          // Fetch the listing data
          fetchListing();
        }

        // The user is not logged in and bypassed the private route component...
        else
        {

          // Navigate to sign in
          navigate('/sign-in');
        }
      })

      // Set the loading state to false
      setLoading(false);
    }
  
    // On dismount change the mount reference to false
    return () => 
    {
      isMounted.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])
  
  // Component functions

  /*
  Fetch the listing that is going to be edited using the
  Firebase Firestore middleware.
  @param none
  @return none
  */
  const fetchListing = async(): Promise<void> =>
  {

    // Check if there is a listingId
    if(params.listingId)
    {

      // Hold the document reference of the listing
      const docRef = doc(dataBase, 'listings', params.listingId);

      // Hold the snapshot of the document reference
      const docSnap = await getDoc(docRef);

      // Check if the snapshot exists
      if (docSnap.exists()) 
      {

        // Set the listing using the snapshot data
        setListing(docSnap.data());

        // Set the listing data using the snapshot data
        setListingData({ ...docSnap.data()});

        // Set the loading state to false
        setLoading(false);
      } 

      // Else return to explore page
      else 
      {
        navigate('/')
        toast.error('Listing does not exist', {theme: 'colored'})
      }
    }
  }

  /*
  Validate the form data and using the firebase middleware add the 
  listing to the firestore database.
  @param none
  @return none
  */
 const editListing = async(e: React.SyntheticEvent): Promise<void> =>
 {

  // Prevent page refresh
  e.preventDefault();

  // Set the loading state to true
  setLoading(true);

  // Valid discount check
  if(listingData.offer && listingData.discountedPrice >= listingData.regularPrice)
  {
    setLoading(false);
    toast.error('Please enter a valid discount.', {theme: 'colored'});
    return;
  }

  // Check if there is image urls
  if(listingData.imageUrls)
  {

    // Check if there is more than 6 images
    if(listingData.imageUrls.length > 6)
    {
      setLoading(false);
      toast.error('Only a max of 6 files are allowed.', {theme: 'colored'});
      return;
    }
  }

  // Address geolocation check
  const data = await geocodingService.getgeocodingResult(listingData.location);

  // Check for geocoding error
  if(data.status === geocodingError || !data.results[0].formatted_address)
  {
    toast.error('Invalid address can not find location on map.', {theme: 'colored'});
    setLoading(false);
    return;
  }

  // Set the geolocation and location data field
  let newGeolocation = 
  {
    lat: data.results[0]?.geometry.location.lat ?? 0,
    lng: data.results[0]?.geometry.location.lng ?? 0 
  }

  setListingData({...listingData, geolocation: {
    lat: parseFloat(newGeolocation.lat),
    lng: parseFloat(newGeolocation.lng)
  }, location: data.results[0].formatted_address})


  // Add images using firebase middleware
  const storeImage = async (image: any) => 
  {
    return new Promise((resolve, reject) => 
    {
      const storage = getStorage()
      if(auth.currentUser)
      {
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        
        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => 
          {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) 
            {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => 
          {
            reject(error)
          },
          () => 
          {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
            {
              resolve(downloadURL)
            })
          }
      )}
    })
  }

  // Hold the image urls
  const imgUrls = await Promise.all(
    [...images].map((image) => storeImage(image))).catch(() => 
    {
    setLoading(false)
    toast.error('Images not uploaded', {theme: 'colored'})
    return
    }
  )
  
  // Hold a copy of the listing data
  const listingDataCopy: any =
  {
    ...listingData,
    imageUrls: imgUrls,
    geolocation: newGeolocation,
    timestamp: serverTimestamp()
  }

  // Hold the document reference
  let docRef: any ;

  // Check if there is a listingId
  if(params.listingId)
  {

    // Hold the reference of the listing
    docRef = doc(dataBase, 'listings', params.listingId);

    // Update the document using the Firebase Firestore middleware
    await updateDoc(docRef, listingDataCopy);
  }

  // Set the loading state to false
  setLoading(false);

  // Send a success message to the user
  toast.success('Listing saved.', {theme: 'colored'});

  // Navigate to listing page
  navigate(`/category/${listingData.type}/${docRef!.id}`);
 }

  // Check if the authentication is loading and return the Spinner component
  if(loading)
  {
    return <Spinner/>
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
        className="min-h-full w-full pt-8 px-12 pb-20 flex justify-center text-neutral-content block mx-auto max-w-lg"
        >
          <form 
          className="p-4 h-full w-full"
          onSubmit={editListing}
          >
            <p
            className="block text-center text-[18px]"
            >
              EDIT LISTING
            </p>

            {/* Hold the form element for property name */}
            <div 
            className="form-control w-full"
            >
              <label 
              className="label"
              >
                <span 
                className="label-text text-neutral-content"
                >
                  PROPERTY NAME
                </span>
              </label>

              {/* Hold the property name input */}
              <input
              className="input input-bordered input-primary text-neutral w-full"  
              placeholder="Name of property"
              onChange={(e) => setListingData({...listingData, name: e.target.value})} 
              required
              type="text" 
              value={listingData.name}
              />
            </div>
            
            {/* Hold the row for the sell/rent */}
            <div 
            className="flex justify-around"
            >

              {/* Hold the form control for the rent radio */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  RENT
                </p>

                {/* Hold the rent radio */}
                <input   
                checked={listingData.type === 'rent'}
                className="radio radio-primary bg-neutral-content"
                name="type"
                onClick={() => setListingData({...listingData, type: 'rent'})}
                type="radio"
                />
              </div>

              {/* Hold the form control for the sale radio */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  SALE
                </p>

                {/* Hold the sale radio */}
                <input
                checked={listingData.type === 'sale'}   
                className="radio radio-primary bg-neutral-content"
                name="type" 
                onClick={() => setListingData({...listingData, type: 'sale'})}
                type="radio"
                />
              </div>
            </div>

            {/* Hold the row for bedrooms and bathrooms */}
            <div 
            className="flex justify-around"
            >

              {/* Hold the form control for the bedrooms input */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  BEDROOMS
                </p>

                {/* Hold the bedrooms */}
                <input   
                className="input input-bordered input-primary text-neutral w-full"
                min={1}
                max={50}
                name="bedrooms"
                onChange={(e) => setListingData({...listingData, bedrooms: parseInt(e.target.value)})} 
                type="number"
                required
                value={listingData.bedrooms}
                />
              </div>

              {/* Hold the form control for the bathrooms input */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  BATHROOMS
                </p>

                {/* Hold the bathrooms input */}
                <input   
                className="input input-bordered input-primary text-neutral w-full"
                min={1}
                max={50}
                name="bathrooms"
                onChange={(e) => setListingData({...listingData, bathrooms: parseInt(e.target.value)})}  
                type="number"
                required
                value={listingData.bathrooms}
                />
              </div>
            </div>

            {/* Hold row for parking and furnished */}
            <div 
            className="flex justify-around"
            >

              {/* Hold the form control for the parking toggle */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  PARKING
                </p>

                {/* Hold the parking toggle value */}
                <input   
                className="checkbox checkbox-primary bg-neutral-content"
                checked={listingData.parking}
                name="parking" 
                onChange={(e) => setListingData({...listingData, parking:e.target.checked})}
                type="checkbox"
                />
              </div>

              {/* Hold the form control for the furnished toggle */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  FURNISHED
                </p>

                {/* Hold the furnished toggle value */}
                <input  
                className="checkbox checkbox-primary bg-neutral-content"
                checked={listingData.furnished}
                name="furnished"
                onChange={(e) => setListingData({...listingData, furnished:e.target.checked})} 
                type="checkbox"
                />
              </div>
            </div>
            
            {/* Hold the form control for the address text field */}
            <div 
            className="form-control w-full"
            >
              <label 
              className="label"
              >
                <span 
                className="label-text text-neutral-content"
                >
                  ADDRESS
                </span>
              </label>
              <textarea 
              className="textarea textarea-primary text-neutral"
              onChange={(e) => setListingData({...listingData, location: e.target.value})}
              required
              value={listingData.location} 
              >
              </textarea>
            </div>

            {/* Hold the form control for the offer and discount price fields */}
            <div 
            className="form-control w-full flex-row items-center justify-around"
            >
              
              {/* Hold the form control for the offer checkbox */}
              <div
              className="form-control items-center" 
              id="column"
              >
                <p 
                >
                  OFFER
                </p>

                {/* Hold the offer off checkbox*/}
                <input   
                className="checkbox checkbox-primary bg-neutral-content"
                checked={listingData.offer}
                name="type"
                onChange={(e) => setListingData({...listingData, offer:e.target.checked})} 
                type="checkbox"
                />
              </div>

              {/* Conditional render the discount price input */}
              {listingData.offer &&
                <>

                  {/* Hold the form control for the discount price input */}
                  <div
                  className="form-control items-center w-1/2" 
                  id="column"
                  >
                    <p 
                    >
                      OFFER PRICE
                    </p>

                    {/* Hold the discount price input */}
                    <input   
                    className="input input-border input-primary w-full text-neutral"
                    max={5000000}
                    min={1}
                    name="discount-price" 
                    onChange={(e) => setListingData({...listingData, discountedPrice: parseFloat(e.target.value)})}
                    required
                    type="number"
                    value={listingData.discountedPrice.toString()}
                    />
                  </div>
                </>
              }
            </div>

            {/* Hold the form control for the discount price input */}
            <div
            className="form-control items-center w-full" 
            id="column"
            >
              <p 
              >
                REGULAR PRICE
              </p>

              {/* Hold the parking toggle value */}
              <input   
              className="input input-border input-primary w-full text-neutral"
              max={5000000}
              min={1}
              name="regular-price"
              onChange={(e) => setListingData({...listingData, regularPrice: parseFloat(e.target.value)})} 
              required
              type="number"
              value={listingData.regularPrice.toString()}
              />
            </div>

            {/* Hold the form control for the image input */}
            <div 
            className="form-control w-full mt-2"
            >
              <p
              className="text-center"
              >
                IMAGES
              </p>

              {/* Hold the input for the images */}
              <input 
              accept=".jpg,.png,.jpeg, .avif,.webp"
              className="file-input file-input-bordered file-input-primary text-neutral w-full"
              id="images"
              max={6}
              multiple
              onChange={(e) => setImages(e.target.files)}
              required
              type="file"
              />
            </div>

            <button
            className="btn btn-primary mx-auto block mt-6"
            type="submit"
            >
              SUBMIT EDIT
            </button>
          </form>
        </div>
      </div>
    </>
  )
}