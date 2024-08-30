"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getSingleComment } from "../_lib/getSingleComment"
import { Post as IPost } from "@/model/Post"
import Post from "@/app/(afterLogin)/_component/Post"

export default function Comment ({id} : {id : string}) {
    const queryClient = useQueryClient();
    const post = queryClient.getQueryData(['posts', id]);
    const {data : comment} = useQuery<IPost[] , Object , IPost[] , [_1 : string , _2 : string ,_3 : string]>({
        queryKey : ['posts', id , 'comments'],
        queryFn : getSingleComment,
        staleTime : 60 * 1000,
        gcTime : 300 * 1000,
        enabled: !!post,
    })
    if (post) {
        return (
            comment?.map((post)=>(
                <Post post={post} key={post.postId}/>
            ))
        )
    }
    return null;
}