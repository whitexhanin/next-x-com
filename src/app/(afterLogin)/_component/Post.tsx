import style from '@/app/(afterLogin)/_component/post.module.scss';
import Image from "next/image";
import Link from "next/link";
import PostArticle from './PostArticle';
import { Post  as IPost} from '@/model/Post';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ActionButton from './ActionButton';


export default function Post ({noImage, post} : {post : IPost , noImage? : boolean}) {

    const target = post;
    console.log('target',target);
    console.log('image',target.User);
    
    return (
        <PostArticle post={target}>
            <div className={style.header}>
                <Link href='./' className={`${style.profile} ${style.posbottom}`}>
                {target.User.image  && <img src={target.User.image} alt={target.User.nickname}/>}                    
                    <div>
                        <span>{target.User.nickname}</span>
                        <span>{target.User.id}</span>
                    </div>
                </Link>
                {/* <span className={style.postDate}>{dayjs(target.createdAt).fromNow(true)}</span> */}
            </div>
            <div className={style.content}>
                {target.content}
            </div>
            <div className={style.img}>
                <img src={target.Images[0]?.link} alt="" />
            </div>        
            <ActionButton post={target}/>
        </PostArticle>
    )
}