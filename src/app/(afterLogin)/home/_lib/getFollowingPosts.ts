export async function getFollowingPosts({pageParam}: {pageParam? : number}){
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/followings?cursor=${pageParam}`, {
        next: {
            tags : ["posts","followings"],
        },
        credentials:'include',
        // cache: "no-store"
    });

    if(!res.ok){
        throw new Error("Faild to fetch data")
    }

    return res.json();
}
