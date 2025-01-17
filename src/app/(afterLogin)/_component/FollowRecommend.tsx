"use client";

import style from '@/app/(afterLogin)/_component/followRecommend.module.scss';
import { User } from '@/model/User';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { getFollowRecommends } from '../_lib/getFollowRecommends';
import { useSession } from 'next-auth/react';
import credentials from 'next-auth/providers/credentials';
import { MouseEventHandler, useEffect } from 'react';

type Props = {
  user : User
}

export default function FollowRecommend ({user} : Props) {
    
    const {data : session} = useSession();
    const followed = !!user?.Followers.find(f => f.id === session?.user?.email);
    const queryClient = useQueryClient();

    const follow = useMutation ({
        mutationFn : (userId : string) => {
            return  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,{
                method: 'post',
                credentials: 'include'
            })
        },
        onMutate(userId : string){
            const value : User[] | undefined= queryClient.getQueryData(["users","followRecommends"]);            

            console.log(value);

            if(value){
                const index = value?.findIndex(v => v.id === userId);
              console.log('valuemutate',value);
                const shallow = [...value];
                shallow[index] = {
                  ...shallow[index], 
                  Followers : [{id : session?.user?.email as string}],
                  _count : {
                      ...shallow[index]._count,
                      Followers : shallow[index]._count.Followers + 1
                    }
                }
                queryClient.setQueryData(["users","followRecommends"] , shallow);
                console.log('shallowmutate',shallow);
            }
            const value2 : User | undefined = queryClient.getQueryData(['users',userId]);
            if(value2){
              const shallow = {...value2,
                Followers : [{id : session?.user?.email as string}],
                _count : {
                  ...value2._count,
                  Followers : value2._count?.Followers + 1
                }
              }
              queryClient.setQueryData(['users',userId] , shallow);
            }
        },
        onError(error){
          console.error(error);
        },
    })

    const unfollow = useMutation({
        mutationFn : (userId : string | null)=> {
            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,{
                method : 'delete',
                credentials : 'include'
            })
        },
        onMutate(userId : string){
          const value : User[] | undefined = queryClient.getQueryData(["users","followRecommends"]);

          if(value){
            const index  = value.findIndex(v => v.id === userId);
            const shallow = [...value];
            shallow[index] = {
              ...shallow[index],
              Followers : shallow[index].Followers.filter(v => v.id !== session?.user?.email),
              _count : {
                ...shallow[index]._count ,   
                Followers : shallow[index]._count?.Followers - 1 
              }
            }
            queryClient.setQueryData(["users","followRecommends"],shallow);
          }

          const value2 : User | undefined = queryClient.getQueryData(['users',userId]);
            if(value2){
              const shallow = {...value2,
                Followers : [value2.Followers.filter((fol)=>fol.id !== session?.user?.email as string)],
                _count : {
                  ...value2._count,
                  Followers : value2._count?.Followers - 1
                }
              }
              queryClient.setQueryData(['users',userId] , shallow);
            }
        },
        onError(){}
    })

    const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('follow', followed, user.id);
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };

    return (
            <>
              <div className={style.frcard}>
                  <Link href={`/${user.id}`} className={style.profile}>
                      <Image 
                          src={`${user.image}`}
                          width={50}
                          height={50}
                          alt='userImage'
                      />
                      <div>
                          <span>{user.nickname}</span>
                          <span>{user.id}</span>
                      </div>
                  </Link>
                  <button onClick={onFollow}>{followed? '팔로잉' : '팔로우'}</button> 
              </div>
            </>
    )
}