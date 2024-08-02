export const getTrends = async () => {
    const res = await fetch(`http://localhost/api/trends` , {
        next : {
            tags : ['trends']
        },
        cache : "no-store"
    })

    if(!res.ok){
        throw new Error ("Faild to fetch data")
    }

    return res.json();

}