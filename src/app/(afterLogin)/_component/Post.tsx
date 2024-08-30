import style from '@/app/(afterLogin)/_component/post.module.scss';
import Image from "next/image";
import Link from "next/link";
import PostArticle from './PostArticle';
import { Post  as IPost} from '@/model/Post';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ActionButton from './ActionButton';
import  PostImages  from './PostImages';

dayjs.locale('ko');
dayjs.extend(relativeTime)

export default function Post ({noImage, post} : {post : IPost , noImage? : boolean}) {

    let target = post;
    let repostTarget;
    if(post.Original) {
        target = post.Original;
        repostTarget = post;
    }
    console.log('target',target);
    console.log('targetOriginal',post.Original);
    console.log('image',target.User);
    
    return (
        <PostArticle post={target}>
            {post.Original && 
                <div>재 개시 했습니다.</div>
            }
            <div className={style.header}>
            {/* {`${style.profile} ${style.posbottom}`} */}
                <Link href={`/${target.User.id}`} className={style.profile}>
                {target.User.image  && <img src={target.User.image} alt={target.User.nickname}/>}                    
                    <div>
                        <span>{target.User.nickname}</span>
                        <span>{target.User.id}</span>
                        <span>{dayjs(target.createdAt).fromNow(true)}</span>
                    </div>
                </Link>
                {/* <span className={style.postDate}>{dayjs(target.createdAt).fromNow(true)}</span> */}
            </div>
            {post.Parent && 
                <div>
                    <Link href={`./${post.Parent.User.id}`}>@{post.Parent.User.id}</Link>님에게 보내는 답글
                </div>
            }
            <div className={style.content}>
                {target.content}
            </div>
            <PostImages post={target}/>     
            <ActionButton post={target} reposts = {repostTarget}/>
        </PostArticle>
    )
}