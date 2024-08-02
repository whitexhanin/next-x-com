
import style from '@/app/(afterLogin)/_component/followRecommend.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function FollowRecomment () {
    const user = {
        id:'abc',
        username:'abc123',
        url : 'xlogo.jpg'
    }     

    return (
        <div className={style.frcard}>
            <Link href='./username' className={style.profile}>
                <Image 
                    src={`/${user.url}`}
                    width={50}
                    height={50}
                    alt='userImage'
                />
                <div>
                    <span>{user.username}</span>
                    <span>{user.id}</span>
                </div>
            </Link>
            <button>팔로우</button>
        </div>
    )
}