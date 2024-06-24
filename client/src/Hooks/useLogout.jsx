import { gql, useMutation } from "@apollo/client"

const USER_LOGOUT = gql`
  mutation logout {
    logout {
      message
    }
  }
`;

const useLogout = () => {
    
  const [logoutNow, { data, loading, error }] = useMutation(USER_LOGOUT);
    
 
    const logout = async()=>{
          try {
            const result = await logoutNow();
            
            const response = result.data.logout;
            
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
    }
    
    return logout
}

export default useLogout
