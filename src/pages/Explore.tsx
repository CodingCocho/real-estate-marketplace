import {Logo} from '../components/Logo';
import {useNavigate} from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Background from '../assets/profile-background.jpg';


export const Explore = (): JSX.Element =>
{

  // Hold the useNavigate hook
  const navigate = useNavigate();

  return(
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
        className="h-full w-full py-8 px-12"
        >

          {/* Hold the Logo component */}
          <Logo/>

          {/* Hold a grid container for the real estate categories */}
          <div
          className="grid gap-x-4 md:gap-x-24 grid-cols-2 mt-8 justify-between" 
          id="container"
          >
            <div
            className="w-full" 
            id="container"
            >
              <img 
              alt="rent"
              className="w-full h-[15vw] mx-auto duration-300 hover:-translate-y-1 shadow-md cursor-pointer"
              onClick={() => navigate('/category/rent')} 
              src={rentCategoryImage}
              />
              <p
              className="text-neutral-content text-center text-2xl cursor-pointer w-fit mx-auto"
              onClick={() => navigate('/category/rent')} 
              >
                Places for rent
              </p>
            </div>
            <div 
            className="w-full" 
            id="container"
            >
              <img 
              alt="sale"
              className="w-full h-[15vw] mx-auto duration-300 hover:-translate-y-1 shadow-md cursor-pointer" 
              onClick={() => navigate('/category/buy')}
              src={sellCategoryImage} 
              />
              <p
              className="text-neutral-content text-2xl cursor-pointer w-fit mx-auto"
              onClick={() => navigate('/category/buy')}
              >
                Places for sale
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}