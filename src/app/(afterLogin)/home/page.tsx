import ActionButton from "@/app/(afterLogin)/_component/ActionButton";
import FollowRecomment from "@/app/(afterLogin)/_component/FollowRecommend";
import LogoutButton from "@/app/(afterLogin)/_component/LogoutButton";
import Post from "@/app/(afterLogin)/_component/Post";
import Link from 'next/link';
import { faker } from '@faker-js/faker';

import TabProvider from "./_component/TabProvider";
import TabDecider from "./_component/TabDecider";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getPostRecommends } from "./_lib/getPostRecommends";
import Tab from "./_component/Tab";
import PostForm from "./_component/PostForm";
import { Suspense } from "react";
import { auth } from "@/auth";
import TabDeciderSuspense from "./_component/TabDeciderSuspense";
import Loading from "./loading";


export default async function Home () {    
    // const queryClient = new QueryClient();//서버에서 불러운 데이터를 클라이언트 relate query가 물려받음(hydrate)

    // //prefetchQuery 데이터가 필요하기 전 미리 데이터를 fetching
    // //인자로 queyrkey,queryFn을 포함한 객체를 인자로 받음
    // //reactquery 
    // console.dir('homequery',queryClient);

    // //prefetchInfiniteQuery 사용 시 인피니트 스크롤 구현,initialPageParam 프로퍼티 필수 설정 < - cursor 역할    
    // await queryClient.prefetchInfiniteQuery({
    //     queryKey: ["posts","recommends"],
    //     queryFn: getPostRecommends,
    //     initialPageParam: 0,
    // });
    
    // const dehydratedstate = dehydrate(queryClient);

    const session = await auth();

    return (
        <main>  
            {/* <HydrationBoundary state={dehydratedstate}> */}
                <TabProvider>
                    <Tab/>
                    <PostForm me ={session}/>     
                    <Suspense fallback={<Loading/>}>                        
                        <TabDeciderSuspense />  
                    </Suspense>               
                </TabProvider>                         
            {/* </HydrationBoundary>     */}
        </main>
    )
}