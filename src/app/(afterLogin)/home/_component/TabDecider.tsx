'use client';

import { useContext } from "react"
import { TabContext } from "./TabProvider";
import PostRecommends from "../../_component/PostRecommends";
import FollowingPosts from "../../_component/FollowingPosts";

export default function TabDecider(){
    
    const  { tab }  = useContext(TabContext);
    

    if(tab === 'rec'){        
        return <PostRecommends/>
    }

    return <FollowingPosts/>    
}