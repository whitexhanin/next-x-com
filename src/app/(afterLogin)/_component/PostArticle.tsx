"use client";

import { Post } from "@/model/Post";
import { useRouter } from "next/navigation";



export default function PostArticle({children , post} : {children : React.ReactNode , post : Post}){

    let target = post;

    if(post.Original){
      target = post.Original
    }
    
    const router = useRouter();    
    const onClickPost = () => {      
      router.push(`/${target.User.id}/status/${target.postId}`);
    }

    return (
        <article onClick = {onClickPost}>
            {children}
        </article>
    )
}