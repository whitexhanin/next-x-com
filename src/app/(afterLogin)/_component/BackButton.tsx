'use client';

import { useRouter } from "next/navigation";

export default function BackButton(){
    const router = useRouter();

    const onClickBack = () => {
        router.back();
    }

    return (
        <button onClick={onClickBack}> (뒤로) </button>
    )
}