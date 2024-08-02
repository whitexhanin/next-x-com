
'use client';

import style from '@/app/(afterLogin)/_component/post.module.scss';
import { Post } from '@/model/Post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import credentials from 'next-auth/providers/credentials';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { MouseEventHandler, useCallback, useState } from 'react';


export default function ActionButton({post}:{post : Post}){    
    const queryClient = useQueryClient();
    const {data : session} = useSession();
    const {postId} = post;
    
    
    //기존 like를 선택 여부 확인 
    console.log('post',post);
    console.log('session',session);
    const liked = !!post.Hearts?.find((v) => v.userId === session?.user?.email);    
    const commented = !!post.Comments?.find((v) => v.userId === session?.user?.email);
    const reposted = !!post.Reposts?.find((v) => v.userId === session?.user?.email);

    const onClickHeart : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        console.log('like',liked);
        if(liked){
            console.log('unheart');
            unHeart.mutate();
        }else{
            console.log('heart');
            heart.mutate();
        }
    }
    const onClickRepost = () => {
        console.log('repost',reposted);
        if(reposted){
            deleteRepost.mutate();
        }else{
            repost.mutate();
        }
    }
    const onClickComment = () => {        
        console.log('comment',commented);        
    }

    const heart = useMutation({
        mutationFn: () => {
            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
                {
                    method: 'post',
                    credentials:'include'
                }
            );
        },
        onMutate: () => {
            let queryCache = queryClient.getQueryCache();
            console.log(queryCache);

            let queryKey  = queryCache.getAll().map((cache) => cache.queryKey);
            console.log(queryKey);

            queryKey.forEach(key => {
                if(key[0] === 'posts'){
                    console.log('포스트');

                    const value : Post | InfiniteData<Post[]> |undefined  = queryClient.getQueryData(key);
                    
                    console.log(value);
                    if(value && "pages" in value){                               
                        const obj = value.pages.flat().find((v) => v.postId === postId);                   
                        // console.log('오비제는',obj)

                        if(obj){
                            console.log('오비제');
                            const pageIndex = value.pages.findIndex((page)=>page.includes(obj));
                            const index = value.pages[pageIndex].findIndex(v => v.postId === postId);

                            const shallow = {...value};
                            value.pages = {...value.pages};
                            value.pages[pageIndex] = {...value.pages[pageIndex]};
                            shallow.pages[pageIndex][index] = {
                                ...shallow.pages[pageIndex][index] , 
                                Hearts : [{ userId: session?.user?.email as string}],
                                _count : {
                                    ...shallow.pages[pageIndex][index]._count,
                                    Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                                }
                            }
                            console.log(shallow)
                            queryClient.setQueryData(key, shallow);
                        }

                    }else if(value){
                        if(value.postId === postId){
                            const shallow = {
                                ...value,
                                Hearts : [{userId: session?.user?.email as string}],
                                _count : {
                                    ...value._count,
                                    Hearts: value._count.Hearts + 1
                                }
                            }
                            console.log('한개');
                            queryClient.setQueryData(key, shallow);
                        }

                    }
                }                
            });
        },
        onError (){
            const queryCache = queryClient.getQueryCache();           
            const queryKey = queryCache.getAll().map((cache) => cache.queryKey);

            queryKey.forEach(querykey => {
                if(querykey[0] === 'posts'){
                    const value : Post | InfiniteData<Post[]>| undefined = queryClient.getQueryData(querykey);    
                                    

                    if(value && 'pages' in value){
                        const obj = value.pages.flat().find((v)=>v.postId === postId);                   

                        // const flatPages = value.pages.flatMap((page, pageIndex) => 
                        //     page.map((item, index) => ({ item, pageIndex, index }))
                        //   );
                          
                        //   const found = flatPages.find(({ item }) => item.postId === postId);
                          
                        //   if (found) {
                        //     const { pageIndex, index } = found;
                        //     console.log(`Page Index: ${pageIndex}, Index: ${index}`);
                        //   } else {
                        //     console.log('Item not found');
                        //   }


                        if(obj){
                            const pageIndex = value.pages.findIndex((v)=>v.includes(obj));
                            const index = value.pages[pageIndex].findIndex((v) => v.postId === postId);
                            const shallow = {...value};
                            value.pages = {...value.pages};
                            value.pages[pageIndex] = {...value.pages[pageIndex]};                            

                            shallow.pages[pageIndex][index] = {
                                ...shallow.pages[pageIndex][index],
                                Hearts: shallow.pages[pageIndex][index].Hearts.filter((v) => v.userId !== session?.user?.email),
                                _count : {
                                    ...shallow.pages[pageIndex][index]._count,
                                    Hearts : shallow.pages[pageIndex][index]._count.Hearts - 1
                                }
                            }      
                            queryClient.setQueryData(querykey,shallow);                     
                        }

                    }else if(value){
                        if(value.postId === postId){
                            const shallow = {
                                ...value,
                                Hearts : [{userId: session?.user?.email as string}],
                                _count : {
                                    ...value._count,
                                    Hearts: value._count.Hearts - 1
                                }
                            }
                            console.log('한개');
                            queryClient.setQueryData(querykey, shallow);
                        }

                    }

                }
            });
        }
    });

    const unHeart = useMutation({        
        mutationFn: () => {
            return (
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`, {
                    method: 'delete',
                    credentials: 'include',
                })
            )
        },
        onMutate(){
            const queryCache = queryClient.getQueryCache();           
            const queryKey = queryCache.getAll().map((cache) => cache.queryKey);

            queryKey.forEach(querykey => {
                if(querykey[0] === 'posts'){
                    const value : Post | InfiniteData<Post[]>| undefined = queryClient.getQueryData(querykey);    
                                    

                    if(value && 'pages' in value){
                        const obj = value.pages.flat().find((v)=>v.postId === postId);                   

                        // const flatPages = value.pages.flatMap((page, pageIndex) => 
                        //     page.map((item, index) => ({ item, pageIndex, index }))
                        //   );
                          
                        //   const found = flatPages.find(({ item }) => item.postId === postId);
                          
                        //   if (found) {
                        //     const { pageIndex, index } = found;
                        //     console.log(`Page Index: ${pageIndex}, Index: ${index}`);
                        //   } else {
                        //     console.log('Item not found');
                        //   }


                        if(obj){
                            const pageIndex = value.pages.findIndex((v)=>v.includes(obj));
                            const index = value.pages[pageIndex].findIndex((v) => v.postId === postId);
                            const shallow = {...value};
                            value.pages = {...value.pages};
                            value.pages[pageIndex] = {...value.pages[pageIndex]};                            

                            shallow.pages[pageIndex][index] = {
                                ...shallow.pages[pageIndex][index],
                                Hearts: shallow.pages[pageIndex][index].Hearts.filter((v) => v.userId !== session?.user?.email),
                                _count : {
                                    ...shallow.pages[pageIndex][index]._count,
                                    Hearts : shallow.pages[pageIndex][index]._count.Hearts - 1
                                }
                            }      
                            queryClient.setQueryData(querykey,shallow);                     
                        }

                    }else if(value){
                        if(value.postId === postId){
                            const shallow = {
                                ...value,
                                Hearts : [{userId: session?.user?.email as string}],
                                _count : {
                                    ...value._count,
                                    Hearts: value._count.Hearts - 1
                                }
                            }
                            console.log('한개');
                            queryClient.setQueryData(querykey, shallow);
                        }

                    }

                }
            });
        },
        onError(){
            let queryCache = queryClient.getQueryCache();
            console.log(queryCache);

            let queryKey  = queryCache.getAll().map((cache) => cache.queryKey);
            console.log(queryKey);

            queryKey.forEach(key => {
                if(key[0] === 'posts'){
                    console.log('포스트');

                    const value : Post | InfiniteData<Post[]> |undefined  = queryClient.getQueryData(key);
                    
                    console.log(value);
                    if(value && "pages" in value){                               
                        const obj = value.pages.flat().find((v) => v.postId === postId);                   
                        // console.log('오비제는',obj)

                        if(obj){
                            console.log('오비제');
                            const pageIndex = value.pages.findIndex((page)=>page.includes(obj));
                            const index = value.pages[pageIndex].findIndex(v => v.postId === postId);

                            const shallow = {...value};
                            value.pages = {...value.pages};
                            value.pages[pageIndex] = {...value.pages[pageIndex]};
                            shallow.pages[pageIndex][index] = {
                                ...shallow.pages[pageIndex][index] , 
                                Hearts : [{ userId: session?.user?.email as string}],
                                _count : {
                                    ...shallow.pages[pageIndex][index]._count,
                                    Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                                }
                            }
                            console.log(shallow)
                            queryClient.setQueryData(key, shallow);
                        }

                    }else if(value){
                        if(value.postId === postId){
                            const shallow = {
                                ...value,
                                Hearts : [{userId: session?.user?.email as string}],
                                _count : {
                                    ...value._count,
                                    Hearts: value._count.Hearts + 1
                                }
                            }
                            console.log('한개');
                            queryClient.setQueryData(key, shallow);
                        }

                    }
                }                
            });
        }
    }) 
        

    
    const repost = useMutation({
        mutationFn : () => {
            return (
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/{postId}/reposts`,{
                    method : 'post',
                    credentials: 'include'
                })
            )
        },
        onSuccess (){
            const querycache = queryClient.getQueryCache();
            const queryKey = querycache.getAll().map((v)=> v.queryKey);

        }        
    })
    const deleteRepost = useMutation({
        mutationFn: () => {
            return (
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post/{postId}/reposts`,{
                    method : 'delete',
                    credentials:'include'
                }                    
                )
            )
        },
        onSuccess(){}
    })

    


    return(
        <div className={style.actionButtons}>           
            <button className={`${commented? style.comment : ''}`} onClick={onClickComment}>
                <span>Comment</span>    
                {/* <span className="count">{post._count.Comments  || ''}</span> */}
            </button>                   
            <button className={`${reposted? style.repost : ''}`} onClick={onClickRepost}>
                <span>RePost</span>    
                {/* <span className="count">{post._count.Reposts  || ''}</span> */}
            </button>    
            <button className={`${liked ? style.heart : '' }`} onClick={onClickHeart}>
                <span>Like</span>    
                <span className="count">{post._count?.Hearts || ''}</span>
            </button>            
        </div>
    )
}