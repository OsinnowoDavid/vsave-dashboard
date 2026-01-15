import apiClient from "./apiClient";

export const getLoan = async ()=>{
    try {
    const response = await apiClient.get("/admin/get-all-loan")
        console.log("LOAN-DATA", response)
        return response
    } catch (error) {
        console.log(error)
    }

}