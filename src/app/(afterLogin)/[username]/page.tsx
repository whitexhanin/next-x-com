import { dehydrate, HydrationBoundary, QueryClient, useQueryClient } from "@tanstack/react-query";
import UserInfo from "./_component/UserInfo";
import UserPost from "./_component/UserPost";
import { auth } from "@/auth";
import { getUserServer } from "./_lib/getUserServer";
import { getUserPosts } from "./_lib/getUserPosts";



export async function generateMetadata({params} : Props){   
    const user = await getUserServer({ queryKey : ['users' , params.username]});    
    return {
        title : `${user.nickname} (${user.id}) / Z`,
        description : `${user.nickname} (${user.id}) 프로필`
    }
}


type Props  = {
    params: {username : string},
}

export default async function Profile({params}: Props){
    const  { username } = params;
    const session = await auth();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({queryKey: ['users', username], queryFn: getUserServer});
    await queryClient.prefetchQuery({queryKey: ['posts','users',username] , queryFn : getUserPosts});
    const dehydratedState = dehydrate(queryClient);
    return(
        <main>
            <HydrationBoundary state={dehydratedState}>
                <UserInfo username = {username} session = {session}/>
                <div>
                    <UserPost username = {username}/>
                </div>                
            </HydrationBoundary>            
        </main>
    )
}