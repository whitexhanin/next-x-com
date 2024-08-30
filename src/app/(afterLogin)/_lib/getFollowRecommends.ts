export async function getFollowRecommends () {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/followRecommends`,{
        next : {
            tags : ["users","followRecommends"]      
        },
        credentials: 'include', // 쿠키 전달
        cache : 'no-store', //캐시 전달 안함

    });

    if(!res.ok){
        throw new Error('Faild to fetch data')
    }

    return res.json();    

}