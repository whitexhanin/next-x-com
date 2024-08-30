
'use client';

import style from '@/app/(afterLogin)/_component/post.module.scss';
import { Post } from '@/model/Post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import credentials from 'next-auth/providers/credentials';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modal';
import { MouseEventHandler, useCallback, useState } from 'react';



export default function ActionButton({post }:{post : Post }){    
    const queryClient = useQueryClient();
    const {data : session} = useSession();
    const {postId} = post;        
    const router = useRouter();
    const modalStore = useModalStore();   
    
    
    //기존 like를 선택 여부 확인 
    console.log('post',post);
    console.log('session',session);
    const liked = !!post.Hearts?.find((v) => v.userId === session?.user?.email);    
    const commented = !!post.Comments?.find((v) => v.userId === session?.user?.email);
    const reposted = !!post.Reposts?.find((v) => v.userId === session?.user?.email);

    
    const onClickHeart : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        console.log('like',liked);
        console.log('reposted체크',reposted);
        console.log('heart' , 'postId : ', postId , 'post.postId : ' ,post.postId );
        
        if(liked){
            console.log('unheart');
            unHeart.mutate();
        }else{
            console.log('heart');
            heart.mutate();
        }
    }
    const onClickRepost : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        console.log('repost',reposted);
        console.log('repost' , 'postId : ', postId , 'post.postId : ' ,post.postId );

        if(reposted){
            deleteRepost.mutate();
        }else{
            repost.mutate();
        }
    }
    const onClickComment : MouseEventHandler<HTMLButtonElement> = (e) => { 
        e.stopPropagation();
        e.preventDefault();

        // redirect('/explore');
        modalStore.setMode('comment');
        modalStore.setData(post);
        router.push('/compose/tweet');
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

                    const value : Post | InfiniteData<Post[] , unknown> | undefined  = queryClient.getQueryData(key);
                    
                    console.log(value);
                    if(value && "pages" in value){  
                        let obj = value.pages.flat().find((v) => v.postId === postId);     
                        const repost = value.pages.flat().find((v) => v.Original?.postId === postId && v.User.id === session?.user?.email);

                        console.log(obj); 
                        console.log('repost',repost);
                        
                        if(obj){
                            console.log('오비제');
                            
                            const pageIndex = value.pages.findIndex((page)=>page.includes(obj));
                            const index = value.pages[pageIndex].findIndex(v => v.postId === postId);

                            let shallow = {...value};
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
                            
                            
                            // 재게시 
                            if(repost){
                                shallow.pages  = shallow.pages.map((page : Post[] )  => 
                                    page.map((v : Post ) => { 
                                        if (v.postId === repost?.postId) {
                                            return {
                                                ...v,
                                                Original: {
                                                    ...v.Original,
                                                        Hearts : [...v.Original.Hearts,{userId: session?.user?.email as string}],
                                                        _count : {...v.Original._count , 
                                                            Hearts : v.Original._count.Hearts + 1
                                                        }
                                                }
                                            }
                                        }
                                    return v;
                                })   
                                )
                            }

                            queryClient.setQueryData(key, shallow);
                        }                        

                    }else if(value){
                        console.log(value);
                        if(value.postId === postId){
                            const repost = value.Original?.postId === postId && value.User.id === session?.user?.email;

                            let shallow = {
                                ...value,
                                Hearts : [{userId: session?.user?.email as string}],
                                _count : {
                                    ...value._count,
                                    Hearts: value._count.Hearts + 1
                                }
                            }     
                            
                            if(repost){
                                shallow = {
                                    ...shallow,
                                    Original : {
                                        ...shallow.Original,
                                        Hearts : [...shallow.Original.Hearts,{userId: session?.user?.email as string}],
                                        _count : {
                                            ...shallow.Original._count,
                                            Hearts : shallow.Original._count.Hearts + 1
                                        }
                                    }
                                }

                            }
                            
                            console.log('한개');
                            queryClient.setQueryData(key, shallow);
                        }

                    }
                }                
            });
        },
        onSuccess () {
            
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
                    const value : Post | InfiniteData<Post[]>| undefined  = queryClient.getQueryData(querykey);    
                                    

                    if(value && 'pages' in value){
                        const obj = value.pages.flat().find((v)=>v.postId === postId);                   
                        const repost = value.pages.flat().find((v) => v.Original?.postId === postId && v.User.id === session?.user?.email);

                        console.log('오비제는',obj)
                        console.log('오비제오리지날' , obj?.Original);
                        if(obj){
                            const pageIndex = value.pages.findIndex((v)=>v.includes(obj));
                            const index = value.pages[pageIndex].findIndex((v) => v.postId === postId);
                            const shallow  = {...value};
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
                            // 재게시 
                            
                            shallow.pages = shallow.pages.map((page: Post[])  => 
                                page.map((v)=> { 
                                    if (v.postId === repost?.postId) {
                                        return {
                                            ...v,
                                            Original: {
                                                ...v.Original,
                                                    Hearts :                                                         
                                                        v.Original.Hearts.filter((v) => v.userId !== session?.user?.email)
                                                    ,
                                                    _count : {...v.Original._count , 
                                                        Hearts : v.Original._count.Hearts - 1
                                                    }
                                                
                                            }
                                        }
                                    }
                                return v;
                            }))
                            queryClient.setQueryData(querykey,shallow);                     
                        }

                    }else if(value){
                        if(value.postId === postId){
                            const shallow = {
                                ...value,
                                Hearts : value.Hearts.filter(v=> v.userId !== session?.user?.email),
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
    }); 

    const repost = useMutation({
        mutationFn: () => {
          return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.postId}/reposts`, {
            method: 'post',
            credentials: 'include',
          });
        },
        async onSuccess(response) {
          const data = await response.json();
          const queryCache = queryClient.getQueryCache()
          const queryKeys = queryCache.getAll().map(cache => cache.queryKey)
          console.log('queryKeys', queryKeys);
          queryKeys.forEach((queryKey) => {
            if (queryKey[0] === 'posts') {
              console.log(queryKey[0]);
              const value: Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(queryKey);
              if (value && 'pages' in value) {
                console.log('array', value);
                const obj = value.pages.flat().find((v) => v.postId === postId);
                if (obj) { // 존재는 하는지
                  const pageIndex = value.pages.findIndex((page) => page.includes(obj));
                  const index = value.pages[pageIndex].findIndex((v) => v.postId === postId);
                  console.log('found index', index);
                  const shallow = { ...value };
                  value.pages = {...value.pages }
                  value.pages[pageIndex] = [...value.pages[pageIndex]];
                  shallow.pages[pageIndex][index] = {
                    ...shallow.pages[pageIndex][index],
                    Reposts: [{ userId: session?.user?.email as string }],
                    _count: {
                      ...shallow.pages[pageIndex][index]._count,
                      Reposts: shallow.pages[pageIndex][index]._count.Reposts + 1,
                    }
                  }
                  shallow.pages[0].unshift(data);
                  queryClient.setQueryData(queryKey, shallow);
                }
              } else if (value) {
                // 싱글 포스트인 경우
                if (value.postId === postId) {
                  const shallow = {
                    ...value,
                    Reposts: [{ userId: session?.user?.email as string }],
                    _count: {
                      ...value._count,
                      Reposts: value._count.Reposts + 1,
                    }
                  }
                  queryClient.setQueryData(queryKey, shallow);
                }
              }
            }
          })
        }
      });
    
      const deleteRepost = useMutation({
        mutationFn: () => {
          return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.postId}/reposts`, {
            method: 'delete',
            credentials: 'include',
          });
        },
        onSuccess() {
          const queryCache = queryClient.getQueryCache()
          const queryKeys = queryCache.getAll().map(cache => cache.queryKey)
          console.log('queryKeys', queryKeys);
          queryKeys.forEach((queryKey) => {
            if (queryKey[0] === 'posts') {
              const value: Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(queryKey);
              if (value && 'pages' in value) {
                console.log('array', value);
                const obj = value.pages.flat().find((v) => v.postId === postId);
                const repost = value.pages.flat().find((v) => v.Original?.postId === postId && v.User.id === session?.user?.email);
                if (obj) { // 존재는 하는지
                  const pageIndex = value.pages.findIndex((page) => page.includes(obj));
                  const index = value.pages[pageIndex].findIndex((v) => v.postId === postId);
                  console.log('found index', index);
                  const shallow = { ...value };
                  value.pages = {...value.pages }
                  value.pages[pageIndex] = [...value.pages[pageIndex]];
                  shallow.pages[pageIndex][index] = {
                    ...shallow.pages[pageIndex][index],
                    Reposts: shallow.pages[pageIndex][index].Reposts.filter((v) => v.userId !== session?.user?.email),
                    _count: {
                      ...shallow.pages[pageIndex][index]._count,
                      Reposts: shallow.pages[pageIndex][index]._count.Reposts - 1,
                    }
                  }
                  // 재게시 삭제
                  shallow.pages = shallow.pages.map((page) => {
                    return page.filter((v) => v.postId !== repost?.postId);
                  })
                  queryClient.setQueryData(queryKey, shallow);
                }
              } else if (value) {
                // 싱글 포스트인 경우
                if (value.postId === postId) {
                  const shallow = {
                    ...value,
                    Reposts: value.Reposts.filter((v) => v.userId !== session?.user?.email),
                    _count: {
                      ...value._count,
                      Reposts: value._count.Reposts - 1,
                    }
                  }
                  queryClient.setQueryData(queryKey, shallow);
                }
              }
            }
          })
        }
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