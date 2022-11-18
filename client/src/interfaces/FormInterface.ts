import {FieldValue} from 'firebase/firestore';

export interface SignInFormData
{
  email: string,
  password: string
}

export interface SignUpFormData
{
  email: string,
  name: string,
  password?: string,
  timestamp?: FieldValue
}

export interface ListingFirestore
{
  bathrooms: number,
  bedrooms: number,
  discountedPrice: number,
  furnished: boolean,
  geolocation:
  {
    lat: number,
    lng: number
  }
  // id: string,
  imageUrls: any,
  // key: number,
  location: string,
  name: string,
  offer: boolean,
  parking: boolean,
  regularPrice: number,
  timestamp?: FieldValue,
  type: string,
  userRef: string
}

export interface ListingProperty
{
  bathrooms: number,
  bedrooms: number,
  discountedPrice: number,
  id: string
  images: string[],
  key: number,
  location: string,
  offer: boolean,
  name: string,
  regularPrice: number,
  type: string
}
