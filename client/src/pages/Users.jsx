import { gql, useQuery } from '@apollo/client';
import React from 'react'

const GET_USERS = gql`
  query GetUsers {
    users{
    _id
    name
    bills {
      amount
      status
      billType
      amount
    }
  
  }}
`;



const Users = () => {
    
      const { loading, error, data } = useQuery(GET_USERS,{
        
      });
    
  return (
    <div>
      {JSON.stringify(data)}{JSON.stringify(error)}
    </div>
  )
}

export default Users
