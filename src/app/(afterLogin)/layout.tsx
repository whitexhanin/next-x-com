'use client';
import style from '@/app/(afterLogin)/layout.module.scss';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import RQProvider from '@/app/(afterLogin)/_component/RQProvider';
import SearchFrom from './_component/SearchForm';

import FollowRecomment from './_component/FollowRecommend';
import TrendSection from './_component/TrendSection';
import LogoutButton from './_component/LogoutButton';
import { useSession } from 'next-auth/react';
import { User } from '@/model/User';
import { auth } from '@/auth';
import NavMenu from './_component/NavMenu';

export default function AfterLoginLayout ({children , modal} : {children : React.ReactNode , modal : React.ReactNode }) {

    const segment = useSelectedLayoutSegment();
    console.log(typeof(segment));

    const onModalopen = () => {

    }

    // const session = await auth();

    // console.log('session' , session);
    // let photos = Array.from({ length: 6 }, (_, i) => i + 1);

    return(
        <div className={style.container}>
            <div className={style.leftSectionWrap}>
                <div className={style.leftSection}>
                    <div className={style.leftSectionFixed}>
                        <h1 className={style.logo}>
                            <div className={style.logoPill}></div>
                        </h1>
                        <NavMenu />
                        <LogoutButton />                     
                    </div>
                </div>
            </div>
            <RQProvider>
                <div className={style.main}>
                    {children}                
                </div>            
                <div className={style.rightSectionWrpper}>
                    <div className={style.rightSectionInner}>
                        <div className={style.rightSection}>
                            <div className={style.search}>
                                <SearchFrom/>                                
                            </div>
                            <TrendSection />
                            <div className={style.followRecommend}>
                                <h3>팔로우 추천</h3>
                                <FollowRecomment/>                                
                            </div>
                        </div>                    
                    </div>
                </div>
                {modal} 
            </RQProvider>
        </div>
    )
}
