"use client";

import { useQuery } from "@tanstack/react-query"
import { getSinglePostServer } from "../_lib/getSinglePostServer"
import Post from "@/app/(afterLogin)/_component/Post"
import { Post  as IPost} from "@/model/Post"
import { getSinglePost } from "../_lib/getSinglePost";

export default function SinglePost ({id} : {id : string}) {
    const {data : post , error} = useQuery<IPost ,Object , IPost , [_1 : string , _2 : string]>({
        queryKey : ['posts',id],
        queryFn : getSinglePost,
        staleTime : 60 * 1000,
        gcTime : 300 * 1000
    })
    
    if(error){
        return<div>게시글을 찾을수없습니다.</div>
    }
    if(!post){
        return null;
    }

    return (
            <Post key = {post.postId} post = {post}/>
    )
}