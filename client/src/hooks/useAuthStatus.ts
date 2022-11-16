import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {useEffect, useRef, useState} from 'react';

export const useAuthStatus = () =>
{
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const isMounted = useRef(true);
  const auth = getAuth();
  
  useEffect(() => {
    if(isMounted)
    {
      onAuthStateChanged(auth, (user)=>
      {
        if(user)
        {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      })
    }
    
    return () =>
    {
      isMounted.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])
  
  return {loggedIn, checkingStatus};
}