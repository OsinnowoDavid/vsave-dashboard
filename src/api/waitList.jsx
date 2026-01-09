import axios from "axios"

 export const waitList = async( fullName,email,phoneNumber, interest)=>{
    try {
    const response = await axios.post("https://vsavebackend-31d8.onrender.com/user/waitlist", fullName,email,phoneNumber, interest )
    return response

        
    } catch (error) {
        console.log(error)
        
    }
}

 export const GetWaitListDetails = async()=>{
    try {
    const response = await axios.get("https://vsavebackend-31d8.onrender.com/user/get-all-waitlist" )
    return response

        
    } catch (error) {
        console.log(error)
        
    }
}

