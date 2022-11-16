declare global
{
  namespace NodeJS
  {
    interface ProcessEnv
    {
      REACT_APP_GEOCODING_API_KEY: string
    }
  }
}

export {}