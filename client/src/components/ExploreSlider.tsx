import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore'
import { dataBase} from '../firebase.config'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import {Spinner} from './Spinner'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

export const ExploreSlider = (): JSX.Element =>
{
  
  // Hold the loading state
  const [loading, setLoading] = useState(true)

  // Hold the state of the listings
  const [listings, setListings] = useState<DocumentData | null>(null)

  // Hold the useNavigate hook
  const navigate = useNavigate()

  // On mount fetch the listings
  useEffect(() => 
  {
    fetchListings();
  }, [])
  
  /*
  Fetch the listings for the slider. 
  @param none
  @return none
  */
  const fetchListings = async () => 
  {

    // Holding reference to the listings collection
    const listingsRef = collection(dataBase, 'listings')

    // Hold a query of the listings
    const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
    
    // Hold the snapshot of the documents
    const querySnap = await getDocs(q)

    // Hold the DocumentData
    let listings: DocumentData = []

    // Add each listing to the array
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    // Set the listings
    setListings(listings)

    // Set loading to false
    setLoading(false)
  }

  // If loading return the Spinner
  if(loading)
  {
    return <Spinner />
  }

  // If there is no listing then return nothing
  if(listings)
  {
    if(listings.length === 0)
    {
      return <></>
    }
  }

  return (
    <>
      <p 
      className="text-neutral-content pl-[5vw] text-2xl"
      >
        Recommended
      </p>

      {/* Hold the Swiper component */}
      <Swiper
      className="w-[90vw] h-[40vh]" 
      slidesPerView={1} 
      pagination={{ clickable: true }}
      >

        {/* Map through each listing */}
        {listings?.map(({data, id}: {data: any; id: number}) => (
          
          // Hold the SwiperSlide component for the Swiper
          <SwiperSlide
          key={id}
          onClick={() => navigate(`/category/${data.type}/${id}`)}
          >

            {/* Hold the first image for the Slide */}
            <div
            style={{
              background: `url(${data.imageUrls[0]}) center no-repeat`,
              backgroundSize: 'cover',
            }}
            className="w-full h-full"
            >
              <p 
              className="text-xl text-neutral-content pl-2"
              >
                {data.name}
              </p>
              <p 
              className="text-xl text-neutral-content pl-2"
              >
                ${data.offer ? data.discountedPrice : data.regularPrice}{' '}
                {data.type === 'rent' && '/ month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}