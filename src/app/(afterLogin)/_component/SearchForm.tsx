"use client";

import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";

export default function SearchFrom ({q} : {q? : string}) {

    const router = useRouter();

    const onSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        router.push(`/search?q=${e.currentTarget.search.value}`);
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="search" name="search"/>
        </form>        
    )
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

