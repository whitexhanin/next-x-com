import { cookies } from "next/headers";

type Props = {
    queryKey : [string,string]
}

export const getUserServer = async({queryKey} : Props) => {
    const [_1 , username] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,{
        next : {
            tags : ['users' , username],
        },
        credentials : 'include',
        headers: {Cookie: cookies().toString()},
        cache : 'no-store',
    });

    if(!res.ok){
        throw new Error('Faild to fetch data')
    }
    return res.json();
}
