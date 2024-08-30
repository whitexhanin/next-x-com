import { User } from "@/model/User";
import { QueryFunction } from "@tanstack/react-query";

export async function getRoom  ({id} : {id : string}) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}/rooms`,{
        next : {
            tags : ["users" , id],
        },
        credentials : 'include',        
    })

    if(!res.ok){
        throw new Error('Faild to fetch data')
    }

    return res.json();
}