import {api} from "@/lib/axios.ts";

interface UpdateProfileBody{
    name:string,
    description:string
}



export async function UpdateProfile({name,description}:UpdateProfileBody){
    await api.put('/profile',{
       name,
        description
    })
}
