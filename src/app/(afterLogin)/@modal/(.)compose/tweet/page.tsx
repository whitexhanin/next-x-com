"use client";

import { useSession } from 'next-auth/react';
import style from './modal.module.scss';
import {ChangeEventHandler, FormEvent, FormEventHandler, useRef, useState} from "react";
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import TextareaAutosize from 'react-textarea-autosize';
import { useModalStore } from '@/store/modal';
import { Post } from '@/model/Post';
import { useRouter } from 'next/navigation';

export default function TweetModal() {
  const imageRef = useRef<HTMLInputElement>(null);
  const [content , setContent] = useState('');
  const [imgPrevView , setimgPrevView] = useState<Array<{ dataUrl: string, file: File } | null>>([]);
  const {data : session} = useSession();
  const modalstore = useModalStore();
  const post = modalstore?.data;
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit : FormEventHandler<HTMLFormElement>= (e) => {
    // e.stopPropagation();
    e.preventDefault();
    if(modalstore.mode === 'new'){
      newmutation.mutate();

    }else if(modalstore.mode === 'comment') {
      console.log('modalstore.data',modalstore.data);
      // const postId = modalstore.data.postId      
      commentmutation.mutate()
    }
  };
  const onClickClose = () => {
    router.back();

  }
  const onClickButton = () => {}
  const onChangeContent = () => {}

  const onUpload : ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    console.log(e.target.files);

    if(e.target.files){
    
        Array.from(e.target.files).forEach((file , index) => {

            const reader = new FileReader();

            reader.onloadend = () => {
                setimgPrevView((prevItem)=>{
                    const prev = [...prevItem];
                    prev[index] = {dataUrl : reader.result as string , file}
                    console.log('prev', prev);
                    return prev;
                })
            }

            reader.readAsDataURL(file);

            console.log('reader',reader);
            console.log('file',file);      
            console.log('setimgPrevView',imgPrevView);                    

        })
    }
}

  // const me = {
  //   id: 'zerohch0',
  //   image: '/5Udwvqim.jpg'
  // };


  console.log(session);

  const onChange:ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
}
  const newmutation = useMutation({
    mutationFn : () => {
      

      const formData = new FormData();
      formData.append('content',content);
      imgPrevView.forEach((p)=>{
        p && formData.append('images',p.file);
      })

      // formData.append

        return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
          method : 'post',
          credentials: 'include',
          body : formData
        }

      );
    },
   async onSuccess(response){
      const newpost = await response.json();

      const queryCache = queryClient.getQueryCache();
      const queryKey = queryCache.getAll().map(cache=>cache.queryKey);

      queryKey.forEach((querykey)=>{
        if(querykey[0] == 'post'){
          const value : Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(querykey);

          if(value && 'pages' in value){
            const obj = value.pages.flat().find((v)=>{v.postId === post?.postId});            

            if(obj){
              const pageIndex = value.pages.findIndex(page=> page.includes(obj));
              const index = value.pages[pageIndex].findIndex(v => v.postId === post?.postId);

              const shallow = {...value};
              value.pages  = {...value.pages};
              value.pages[pageIndex] = {...value.pages[pageIndex]};
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index], 
                Comments : [{userId : session?.user?.email as string}],
                _count : {
                  ...shallow.pages[pageIndex][index]._count,
                  Comments : shallow.pages[pageIndex][index]._count.Comments + 1
                }
              }
              shallow.pages[0].unshift(newpost);
              queryClient.setQueryData(querykey,shallow);
            }

          }else if(value){
            const shallow = {...value, 
                Comments : [{userId : session?.user?.email as string}],
                _count : {
                  ...value._count,
                  Comments : value._count.Comments + 1
                }
              };            
              queryClient.setQueryData(querykey,shallow);
          }
        }
      })


    },
    onError(){},
    onSettled(data, error, variables, context) {
      router.back();
    },
  });

  const commentmutation = useMutation({
    
    mutationFn : () => {
      
      const formData = new FormData();

      formData.append('content',content);
      imgPrevView.forEach((p)=>{
        p && formData.append('images' , p.file);
      })
      
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post?.postId}/comments`,{
        method : 'post',
        credentials : 'include',
        body : formData,
      })
    },
    async onSuccess(response){

      const newPost = await response.json();


      console.log('post?.Comments',post?.Comments);

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);

      queryKeys.forEach((querykey)=>{
        if(querykey[0] === 'posts'){
          const value : Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(querykey);

          if(value && 'pages' in value){
            const obj = value.pages.flat().find((v)=>v.postId === post?.postId);

            if(obj){
              const pageIndex  = value.pages.findIndex(v => v.includes(obj));
              const index = value.pages[pageIndex].findIndex(v=> v.postId === post?.postId);

              const shallow = {...value};
              value.pages = {...value.pages};
              value.pages[pageIndex] = {...value.pages[pageIndex]}
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Comments : [{userId : session?.user?.email as string}],
                _count : {
                  ...shallow.pages[pageIndex][index]._count,
                  Comments : shallow.pages[pageIndex][index]._count.Comments + 1
                } 
              }
              shallow.pages[0].unshift(newPost);
              queryClient.setQueryData(querykey,shallow);

            }
          }else if(value){
            if(value.postId === post?.postId){
              const shallow = {
                ...value,
                Comments : [{userId : session?.user?.email as string}],
                  _count : {
                    ...value._count,
                    Comments : value._count.Comments + 1
                  } 
              }
              queryClient.setQueryData(querykey,shallow);
            }           

          }

        }
      })
    },
    onError(){},
    onSettled(){
      modalstore.reset();
      router.back();
    }
  })

  return (
    <div className={style.modalBackground}>
      모달
      <div className={style.modal}>
        <button className={style.closeButton} onClick={onClickClose}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true"
               className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03">
            <g>
              <path
                d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </button>
        <form className={style.modalForm} onSubmit={onSubmit}>
          <div className={style.modalBody}>
            <div className={style.postUserSection}>
              <div className={style.postUserImage}>
                <img src={session?.user?.image as string | undefined && session?.user?.image as string | undefined } alt={session?.user?.id} />
              </div>
            </div>
            <div className={style.inputDiv}>
              <TextareaAutosize value={content} onChange={onChange} defaultValue="무슨 일이 일어나고 있나요?"/>

            </div>
            <div className={style.imgpreview}>
                {
                    imgPrevView.map((image , index)=> (
                        <div key ={index}>
                            <img src={image?.dataUrl} style={{width:'100%',objectFit:'contain',maxHeight:100}}/>
                        </div>                        
                    ))
                }
            </div>         
          </div>
          <div className={style.modalFooter}>
            <div className={style.modalDivider}/>
            <div className={style.footerButtons}>
              <div className={style.footerButtonLeft}>
              <input type="file" name="imageFiles" id="addfile" multiple  ref={imageRef} onChange={onUpload}/>            
                {/* <button className={style.uploadButton} type="button" onClick={onClickButton}>
                  <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                  </svg>
                </button> */}
              </div>
              <button className={style.actionButton} disabled={!content}>게시하기</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}