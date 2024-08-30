type Props = {
    queryKey : [string,string,string]
}
export async function getSingleComment ({queryKey} : Props) {
    const [_1 , id , _3] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`,{
        next : {
            tags : ['posts', id , 'comments']
        },
        cache: 'no-store'
    })

    if(!res.ok){
        throw new Error('Faild to fetch data');
    }

    return res.json();
}