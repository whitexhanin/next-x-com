import { useQuery } from "@tanstack/react-query";
import { getTrends } from "../../_lib/getTrends";
import Trend from "../../_component/Trend";
import { Hashtag } from "@/model/Hashtag";

export function TrendSection () {

    const { data } = useQuery<Hashtag[]>({
        queryKey : ['trend'],
        queryFn : getTrends,
        staleTime : 60 * 1000,
        gcTime : 300 * 1000
    })



    return (
        <div>
            {data?.map(trend => (<Trend key ={trend.tagId} trend = {trend}/>))}
        </div>    
        
    )
}