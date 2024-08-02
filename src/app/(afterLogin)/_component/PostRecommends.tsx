"use client";

import { InfiniteData, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getPostRecommends } from "../home/_lib/getPostRecommends";
import Post from "./Post";
import { Post as IPost} from "@/model/Post";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

export default function PostRecommends (){
    const { ref , inView} = useInView({ threshold:0 , delay:0})

    //prefetchInfiniteQuery 를 받으니 useQuery도 useInfiniteQuery로 사용
    const { data ,  
        fetchNextPage,
        hasNextPage,
        isFetching,//데이터 가져오는 순간
        isPending, // 초기 : 데이터 불러오지 않았을때
        isLoading, // isPending && isFetching
        isError  } = useSuspenseInfiniteQuery<
        IPost[],
        Object,
        InfiniteData<IPost[]>,
        [_1:string,_2:string],
        number
        >({
        queryKey: ['posts', 'recommends'],
        queryFn: getPostRecommends,
        initialPageParam:0,
        getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });

    useEffect(()=>{
        if(inView){
            !isFetching && hasNextPage && fetchNextPage();
        }
    },[inView, !isFetching , fetchNextPage , hasNextPage])

    console.log('data',data);

    return (
        <>
            <div>추천</div>
            {data?.pages.map((page , idx)=> (
                <Fragment key={idx}>
                    {page.map((post)=>(
                        <Post key={post.postId} post={post}/>
                    ))}                                    
                </Fragment>
            ))}
             <div ref={ref} style={{ height: 50 }}></div>
        </>
    )       
}