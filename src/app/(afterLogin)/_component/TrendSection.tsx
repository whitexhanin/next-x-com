'use client';

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react"
import { getTrends } from "../_lib/getTrends";
import { Hashtag } from "@/model/Hashtag";
import Trend from "./Trend";

export default function TrendSection () {
    const {data : session} = useSession();
    const { data } = useQuery<Hashtag[]>({
        queryKey : ['trends'],
        queryFn : getTrends,
        staleTime : 60 * 1000,
        gcTime : 300 * 1000,
        enabled : !!session?.user
    })

    if(session?.user){
        return (
            <div>
                {data?.map((trend) => (
                        <Trend key = {trend.tagId} trend={trend}/>
                ))}
            </div>
        )
    }
    
    return (

        <div>
            트렌드를 가져올 수 없습니다.
        </div>
    )
}