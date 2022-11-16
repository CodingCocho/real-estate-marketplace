import {useNavigate} from 'react-router-dom'
import {ListingProperty} from '../interfaces/FormInterface';
import BathroomIcon from '../assets/svg/bathtubIcon.svg';
import BedIcon from '../assets/svg/bedIcon.svg';


export const ListingItem = (props: ListingProperty): JSX.Element =>
{

  // Deconstruct the props from the listing
  const {bathrooms, bedrooms, discountedPrice, id, images, location, name, offer, regularPrice, type} = props;

  // Hold the useNavigate hook
  const navigate = useNavigate();

  return(
    <>

      {/* Hold the container for the ListingItem component */}
      <div 
      className="flex h-auto sm:h-[250px] xl:h-[450px] mt-4 items-center"
      >

        {/* Hold the image of the property */}
        <img 
        alt="property"
        className="h-[125px] w-[125px] sm:w-[250px] sm:h-[200px] xl:w-[300px] xl:h-[250px] cursor-pointer"
        onClick={() => navigate(`/category/${type}/${id}`)}
        src={images[0]}  
        />

        {/* Hold the information of the property */}
        <div
        className="pl-4 text-neutral-content" 
        id="information"
        >
          <p
          className="text-sm sm:text-lg xl:text-2xl cursor-default"
          >
            {location}
          </p>
          <p
          className="text-lg sm:text-2xl xl:text-4xl cursor-default"
          >
            {name}
          </p>
          
          {/* Conditional render the pricing */}
          <p
          className="text-lg text-success sm:text-2xl xl:text-4xl cursor-default"
          >
            ${offer ? 
            discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : 
            regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            {type === 'rent' && ' / Month'}
          </p>
          
          {/* Conditional render the bedrooms and bathrooms */}
          <div 
          className="flex items-center justify-between w-fit"
          >
            <img 
            alt="bed"
            src={BedIcon} 
            />
            <p 
            className="text-sm sm:text-xl xl:text-2xl ml-1 sm:ml-3 cursor-default"
            >
              {bedrooms > 1 ? 
              `${bedrooms} Bedrooms`
              : 
              '1 Bedroom'
              }
            </p>
            <img
            alt="bath"
            className="ml-1 sm:ml-3"  
            src={BathroomIcon} 
            />
            <p 
            className="text-sm sm:text-xl xl:text-2xl ml-1 sm:ml-3 cursor-default"
            >
              {bathrooms > 1 ? 
              `${bathrooms} Bathrooms`
              : 
              '1 Bathroom'
              }
            </p>
          </div>
        </div>
      </div>
    </>
  )
}