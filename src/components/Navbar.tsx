import {NavLink} from 'react-router-dom';
import ExploreIcon from '../assets/svg/exploreIcon.svg';
import OfferIcon from '../assets/svg/localOfferIcon.svg';
import PersonIcon from '../assets/svg/personOutlineIcon.svg';

export const Navbar = (): JSX.Element =>
{
  return (
    <>

    {/* Hold the bottom navigation container */}
    <div 
    className="btm-nav"
    >
      
      {/* Hold the buttons that will redirect the user to the appropriate route */}
      <NavLink 
      className="text-primary"
      to='/'
      >
        <img 
        alt="explore"
        src={ExploreIcon}  
        />
        <span 
        className="btm-nav-label text-base-content"
        >
          Explore
        </span>
      </NavLink>
      <NavLink 
      className="text-primary"
      to='/offers'
      >
        <img 
        alt="offer"
        src={OfferIcon}  
        />
        <span 
        className="btm-nav-label text-base-content"
        >
          Offer
        </span>
      </NavLink>
      <NavLink 
      className="text-primary"
      to='/profile'
      >
        <img 
        alt="person"
        src={PersonIcon}  
        />
        <span 
        className="btm-nav-label text-base-content"
        >
          Profile
        </span>
      </NavLink>
    </div>
  </>
  )
}