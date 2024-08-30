"use client";

import { Post } from "@/model/Post"
import Link from "next/link";

export default function PostImages ({post} : {post : Post}) {
    
    return (
        <>
            {post.Images.map((v , idx)=>(
                <Link href='/' key={idx} > 
                    <img src={v.link}  style = {{maxWidth:'100%',objectFit:'contain',height:'100px'}} alt=""/>
                </Link>
            ))}            
        </>
    )
    
}