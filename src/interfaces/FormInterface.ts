import {FieldValue} from 'firebase/firestore'

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