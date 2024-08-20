import {api} from "@/lib/axios.ts";

export interface RegisterRestaurantBody{
    restaurantName: string;
    managerName: string;
    email: string;
    phone:string
}

export async function registerRestaurant({restaurantName,managerName,phone,email}: RegisterRestaurantBody){
    await api.post('restaurants',{
        restaurantName
        ,managerName,
        phone,
        email})
}