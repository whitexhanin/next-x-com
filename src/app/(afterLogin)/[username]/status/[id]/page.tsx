import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query"
import { getSinglePost } from "./_lib/getSinglePost"
import { getUserServer } from "../../_lib/getUserServer"
import { getSinglePostServer } from "./_lib/getSinglePostServer";
import { getSingleComment } from "./_lib/getSingleComment";
import SinglePost from "./_component/SinglePost";
import Comment from "./_component/Comment";

type Props = {
    params : {id : string , username : string}
}

export async function generateMetadata({params} : Props ){
    const user = await getUserServer({ queryKey : ["users" , params.username]});
    const post = await getSinglePostServer({queryKey : ["post" , params.id]})
    return {
        title : `Z에서 ${user.nickname}님 : ${post.content}`,
        description :post.content
    }
}
export default async function Page ({params} : Props) {
    
    
    const {id} = params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({queryKey : ['posts', id],queryFn : getSinglePostServer})
    await queryClient.prefetchQuery({queryKey: ['posts' , id , 'comments'],queryFn : getSingleComment});
    const dehydratedState = dehydrate(queryClient);    
    

    return (
        <main>
            <HydrationBoundary state={dehydratedState}>
                <SinglePost id = {id}/>
                <Comment id = {id}/>
            </HydrationBoundary>
            
            {/* 포스트 한개 */}
            {/* 답글 리스트 */}            
        </main>
    )
}