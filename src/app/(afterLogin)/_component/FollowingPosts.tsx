"use client"

import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getFollowingPosts } from "../home/_lib/getFollowingPosts";
import { Post  as IPost} from "@/model/Post";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Post from "./Post";

export default function FollowingPosts() {
  const { ref , inView} = useInView({threshold:0, delay:0});  
  const { data ,
          fetchNextPage,
          hasNextPage,
          isFetching,
          isPending,
          isLoading,
          isError
        } = useSuspenseInfiniteQuery<
          IPost[],
          Object,
          InfiniteData<IPost[]>,
          [_1:string,_2:string],
          number
        >({
          queryKey: ["posts","followings"],
          queryFn: getFollowingPosts,
          initialPageParam:0,
          getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
          staleTime: 60 * 1000,
          gcTime: 300 * 1000,
        })

  useEffect(() => {
    if(inView){
      !isFetching && hasNextPage && fetchNextPage();
    }

  },[isFetching ,hasNextPage , inView ,fetchNextPage]);

  // return (
  //   <>
  //     <div>팔로우 중</div>
  //     {data?.pages.map((page , idx)=> (
  //       <Fragment key={idx}>
  //         {page.map((post)=>(
  //           <Post key = {post.postId} post={post}/>
  //         ))}
  //       </Fragment>        
  //     ))}
  //     <div ref={ref} style={{height : 50}}></div>
  //   </>
  // )
console.log(
  'followdata',data);
  console.log('hasNextPage',hasNextPage);
  return (
    <>
      {
       data?.pages.map((page, index) => (
        <Fragment key={`posts-followings-page-${index}`}>
          {page.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
          {/* {!isFetching && <div ref={ref} style={{ height: 50 }}></div>}
          {isFetching && <div style={{ height: 50 }}></div>} */}
        </Fragment>))
      }
      <div ref={ref} style={{ height: 50 }}></div> 
    </>
  )
}