'use client';

import { Hashtag } from "@/model/Hashtag";
import Link from "next/link";

export default function Trend ({trend} : {trend : Hashtag}) {
    return (
        <Link href ={`/search?q=${encodeURIComponent(trend.title)}`}>
            <div>실시간 트렌드</div>
            <div>{trend.title}</div>
            <div>{trend.count.toLocaleString()} posts</div>
        </Link>
    )
}