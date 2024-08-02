"use client";

import { InfiniteData, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getFollowingPosts } from "../home/_lib/getFollowingPosts"
import Post from "./Post";
import { Post as IPost} from "@/model/Post";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

export default function FollowingPosts(){   
    
    const { data} = useQuery< IPost[]>({
        queryKey: ["posts" , "followings"],
        queryFn: getFollowingPosts,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });

        

    console.log('data',data);

    return (
        <>
        <div>팔로우</div>
        {data?.map((post) => (
    <Post key={post.postId} post={post} />
  ))}
        </>
    )       
}