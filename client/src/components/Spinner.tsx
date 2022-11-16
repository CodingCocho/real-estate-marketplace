import Background from '../assets/profile-background.jpg';
export const Spinner = (): JSX.Element =>
{
  return(
    <>
      {/* Hold the daisyui hero component */}
      <div 
        className="hero h-full w-full" 
        style={{ backgroundImage: `url(${Background})` }}
        >

          {/* Hold the hero-overlay daisyui component for an added aesthetic */}
          <div 
          className="hero-overlay bg-opacity-60"
          >
          </div>
           {/* Hold the tailwind elements spinner component */}
          <div 
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" 
          role="status"
          >
            <span 
            className="visually-hidden"
            >
              Loading...
            </span>
          </div>
      </div>
    </>
  )
}