import { basicRequest } from '../AxiosCreate';
import { LoginData } from '../Redux/UserSlice'

export const SignupAPI = async (data) => {
    try {
        const response = await basicRequest.post('/user/signup', data);
        alert(response.data);
    } catch (err) {
        console.error("SignupAPI Error:", err);
        alert(err.response?.data?.message || 'An error occurred during signup.');
    }
};

export const loginUser=async (data,dispatch)=>{
    try{
          const LoginInfo=await basicRequest.post("/user/login",data)
          console.log(LoginInfo.data)
          dispatch(LoginData(LoginInfo.data))
          
    }catch(err){
        console.log(err)
    }
}
