import { gql, useMutation } from "@apollo/client";

const CHECK_LOGIN = gql`
  mutation loginChecker {
    checkLogin {
      user {
        _id
        name
        role
        status
      }
      message
    }
  }
`;

const useCheckLoginState = () => {
  const [checkLogin, { data, loading, error }] = useMutation(CHECK_LOGIN);
  
  

  const checkUserLogin = async () => {
    try {
      const result = await checkLogin();
      const user =  result.data.checkLogin.user;
      
      if(!user){
        return null
      }
      
      return user;
      
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    checkUserLogin,
  
  };
};

export default useCheckLoginState;
