import {api} from "@/lib/axios.ts";


export interface SignBody{
    email:string
}
export async function signIn({email}:SignBody){
    await api.post('authenticate',{ email })
}