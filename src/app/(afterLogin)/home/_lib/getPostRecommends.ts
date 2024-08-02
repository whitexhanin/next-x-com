
export async function getPostRecommends({pageParam} : {pageParam : number}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/recommends?cursor=${pageParam}`,{
        next: {
            tags:["posts","recommends"],
        },
        // cache:"no-store"
    });

    if(!res.ok){
        throw new Error("Failed to fetch data");
    }

    return res.json();    
}
