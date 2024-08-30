import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoom } from "../_lib/getRoom";
import { User } from "@/model/User";
import { auth } from "@/auth";

export default async function RoomList ({id} : {id : string}) {
        const queryClient = useQueryClient();
        const session = await auth();     
        const rooms = session?.user ?.email ? await getRoom(session?.user?.email as string) : []
        const {data} = useQuery<User , Object , User ,[_1 : string , _2 : string]>({
            queryKey : ['users' , id],
            queryFn : getRoom,
            staleTime: 60 *1000,
            gcTime: 300 *1000
        })
        

    return (
        <>

        </>
    )
}