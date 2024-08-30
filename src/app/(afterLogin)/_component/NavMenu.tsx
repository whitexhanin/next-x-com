"use client";

import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import style from '@/app/(afterLogin)/layout.module.scss';
import { useSession } from 'next-auth/react';
import { useModalStore } from '@/store/modal';

export default function NavMenu () {
    const segment = useSelectedLayoutSegment();
    const {data : session} = useSession();
    const router = useRouter();
    console.log('session' , session);

    const modalstore = useModalStore();
    const onClicktweet = () => {
        modalstore.setMode('new');
        router.push('/compose/tweet');

    }


    return (
            <>
                <nav>
                    <ul>                                
                        <li className={`${segment == 'home'? style.on : null}`}>                                    
                            <Link href="/home">홈</Link>
                        </li>
                        <li className={`${segment == 'explore'? style.on : null}`}>
                            <Link href="/explore">탐색하기</Link>
                        </li>
                        <li className={`${segment == 'messages'? style.on : null}`}>
                            <Link href="/messages">쪽지</Link>
                        </li>
                        <li className={`${segment == 'profile'? style.on : null}`}>
                            <Link href={`/${session?.user?.email}`}>프로필</Link>
                        </li>
                    </ul>
                </nav>
                <button onClick={onClicktweet} className={style.postButton}>게시하기</button>                
            </>
    )
}