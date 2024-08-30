"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserPosts } from "../_lib/getUserPosts";
import Post from "../../_component/Post";
import {Post as IPost} from "@/model/Post";

type Props = {
    username : string
}
export default function UserPost ({username} : Props) {
    
    const {data} = useQuery({
        queryKey : ['posts', 'users', username],
        queryFn : getUserPosts,
        staleTime : 60 * 1000 ,
        gcTime : 300 * 1000
    });

    return (
        data?.map((post)=>(
            <Post key ={post.postId} post={post}/>
        ))
    )
    
}