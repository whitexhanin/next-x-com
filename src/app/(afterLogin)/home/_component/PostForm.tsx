"use client";
import { ChangeEventHandler, FormEvent, FormEventHandler, useRef, useState } from 'react';
import style from './postform.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/model/Post';
import TextareaAutosize from 'react-textarea-autosize';
import { Session } from '@auth/core/types';

export default function PostForm({me} : {me: Session | null})  {
    const queryClient = useQueryClient();
    const imageRef = useRef<HTMLInputElement>(null);
    const [content , setContent] = useState('');
    const [imgPrevView , setimgPrevView] = useState<Array<{ dataUrl: string, file: File } | null>>([]);

    console.log('queryClient rec',queryClient.getQueryData(["posts","recommends"]));
    console.log('queryClient fol',queryClient.getQueryData(["posts","followings"]));

    // const me = {
    //     id :'',
    //     image: 'xlogo.jpg'
    // }    

    const mutation = useMutation({
        mutationFn : async (e : FormEvent) => {
            e.preventDefault();           

            const formData = new FormData();
            formData.append("content",content);
            // console.log(imgPreView[0].file);
            // if(imgPrevView[0].file){
            //     formData.append("images",imgPrevView[0].file);
            // }      
            console.log('imgPreView',imgPrevView);
            imgPrevView.forEach((p) => {
                console.log('p',p);
                p && formData.append('images', p.file);
              })
              console.log('formData',formData);

            //요청 사항
            //formdata 데이터 저장

            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,{
                method: "post",
                credentials: "include",
                body: formData,
            })
          },

        async onSuccess(response , variables) {
            //화면에 그려주기
            console.log(' success response',response)//응답정도

            const newPost = await response.json();
            console.log('newpost' , newPost);

            setContent('');
            setimgPrevView([]);

            //querykey 일치하면 formdata 추가 하기 
            
            //setQueryData(queryKey,updater)
            //값이 정의 되지 않으면 쿼리 데이터가 업데이트 되지 않음.
            //현재 데이터 값을 받아서 새 값으로 반환 하는 업데이트 함수

            if(queryClient.getQueryData(["posts","recommends"])){

                queryClient.setQueryData(["posts","recommends"],(oldData : {pages: Post[][]}) => {
                    console.log('oldData1',oldData);
                    console.log('oldData2',oldData.pages);
    
                    const shallow = {...oldData , pages : [...oldData.pages]}
                    console.log('shallow',shallow);
                    shallow.pages[0] = [...shallow.pages[0]];
                    console.log('shallow.pages[0]',shallow.pages[0]);
                    shallow.pages[0].unshift(newPost);
                    return shallow;
    
                })
            }
             if (queryClient.getQueryData(["posts","followings"])){
                queryClient.setQueryData(["posts","followings"],(oldData : any) => {
                    console.log('oldData1',oldData);    
                    const shallow = {...oldData , pages : [...oldData.pages]}
                    console.log('shallow',shallow);
                    shallow.pages[0] = [...shallow.pages[0]];
                    console.log('shallow.pages[0]',shallow.pages[0]);
                    shallow.pages[0].unshift(newPost);

                    return shallow;
    
                })
            }
        },
        onError(error){
            console.error(error);
            alert('업로드 중 에러가 발생 했습니다.')
        }
    })

    
    const onChange:ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setContent(e.target.value);
    }

    const onClickButton = () => {
        imageRef.current?.click();
    }

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

    return (        
        <form onSubmit = {mutation.mutate} className={style.form}>
            <div className={style.img}>
                <img src={me?.user?.image as string}/>
            </div>
            <div>
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
            {/* <button onClick = {onClickButton}>파일</button>    */}
            {/* <label htmlFor="addfile" className={style.filelabel}>파일</label>   */}
            <input type="file" name="imageFiles" id="addfile" multiple  ref={imageRef} onChange={onUpload}/>            
            <button className={style.submit}>게시하기</button>
        </form>
    )
}