"use client";

import { useQuery } from "@tanstack/react-query"
import { getSearchResult } from "../_lib/getSearchResult"
import Post from "../../_component/Post"
import { Post as IPost} from "@/model/Post"

type Props  = {
    searchParams: { q : string}
}

export default function SearchResult({searchParams} : Props) {

    const { data } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, Props["searchParams"]]
  >({
        queryKey : ["posts","search",searchParams],
        queryFn : getSearchResult,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
    })

    return (
        data?.map((post)=>(
            <Post key={post.postId} post ={post}/>       
        ))
    )
}