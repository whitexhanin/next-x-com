"use client";
import { User } from "@/model/User";
import { Session } from "@auth/core/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUser } from "../_lib/getUser";
import { MouseEventHandler } from "react";
type Props = {
    username : string,
    session : Session | null ,
}

export default function UserInfo ({username, session} : Props) {

    
    const queryClient = useQueryClient();
    const router = useRouter();    
    const onClickBack = () => {
        router.back();
    }   
    const {data : user , error} = useQuery<User , Object , User ,[_1 : string , _2 : string]>({
        queryKey : ['users',username],
        queryFn : getUser,
        staleTime : 60 * 1000,
        gcTime: 300 * 1000
    })
    const followed = !!user?.Followers.find(v => v.id === session?.user?.email);

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

    if(error){


    }
    if(!user){
        return null
    }

    const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('follow', followed, user?.id);
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };
  const onClickMes:MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const ids = [username , session?.user?.email];
    ids.sort();
    router.push(`/messages/${ids.join('-')}`);


  }
    
    return (
        <>
            <div>{username}</div>
            <div>
                <button onClick={onClickBack}>뒤로</button>
                <span>{session?.user?.email}</span>                
            </div>
            <div>
                <span></span>
                <img src= {session?.user?.image as string} alt={session?.user?.email as string} />
                <div>
                    <span>{session?.user?.name}</span>
                    <span>{session?.user?.email}</span>                    
                </div>
                {username !== session?.user?.email && 
                    <div>
                        <button onClick={onClickMes}>메시지</button>
                        <button onClick={onFollow}>{followed ? '팔로잉' : '팔로우'}</button>
                    </div>
                }
            </div>
            <div>
                <span>
                    <span>{user?._count.Followers}</span>
                    <span>팔로워</span>
                    <span>{user?._count.Followings}</span>
                    <span>팔로우 중</span>
                </span>
            </div>            
        </>
    )
}