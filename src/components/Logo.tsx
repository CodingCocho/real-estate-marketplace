import {GiFamilyHouse} from 'react-icons/gi'
import {useNavigate} from 'react-router-dom'

export const Logo = (): JSX.Element =>
{

  // Hold the useNavigate hook
  const navigate = useNavigate();

  return(
    <>

      {/* Hold the container for the Logo */}
      <div
      className="flex flex-col items-center w-[150px]" 
      id="container">
        <GiFamilyHouse 
        className="text-neutral-content text-[45px] cursor-pointer"
        onClick={() => navigate('/our-mission')}
        />
        <p
        className="text-neutral-content text-[18px] cursor-pointer"
        onClick={() => navigate('/our-mission')}
        >
          Cocho Real Estate
        </p>
      </div>
    </>
  )
}