import {GiFamilyHouse} from 'react-icons/gi'
import Background from '../assets/profile-background.jpg';

export const OurMission = (): JSX.Element =>
{
  return (
    <>
       
       {/* Hold the hero daisyui component */}
       <div 
      className="hero min-h-full h-auto w-full" 
      style={{ backgroundImage: `url(${Background})` }}
      >

        {/* Hold the hero-overlay daisyui component for an added aesthetic */}
        <div 
        className="hero-overlay bg-opacity-60"
        >  
        </div>

        <div 
        className="text-neutral-content flex flex-col items-center h-full w-full py-8 px-12"
        >
          <p
          className="max-w-sm mt-[10vh] text-3xl text-center"
          >
            Our Mission
          </p>
          <GiFamilyHouse 
          className="text-neutral-content text-[75px] cursor-pointer mt-[2vh]"
          />
          <p 
          className="max-w-sm mt-[2vh] text-xl text-center"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo libero excepturi nemo sint deleniti delectus voluptates qui eos temporibus facilis aut consectetur reiciendis dignissimos, magni facere. Necessitatibus nulla accusantium tempora?
          </p>
        </div>
      </div>
    </>
  )
}