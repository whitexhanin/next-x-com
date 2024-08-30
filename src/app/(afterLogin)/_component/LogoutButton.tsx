

import Image from "next/image";
import Link from "next/link";
import style from "@/app/(afterLogin)/_component/followRecommend.module.scss";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



export default function LogoutButton () {

    const router = useRouter();
    const { data : me } = useSession();
    

    const onLogout = () => {
        signOut({redirect: false})

        .then(() => {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
                method : 'post',
                credentials : 'include'
            })
            router.replace('/');
        });
    }
  
    if(!me?.user){
        return null;
    }

    return(        
        <button onClick={onLogout}>
            <Image 
                src={me.user.image as string}
                width={50}
                height={50}
                alt={me.user?.email as string}
            />
            
            <span>{me.user.email}</span>
            <span>{me.user.name}</span>            
        </button>        
    )
}