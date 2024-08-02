"use client";



export default function PostArticle({children , post} : {children : React.ReactNode , post : {
    postId: number;
    content: string,
    User: {
      id: string,
      nickname: string,
      image: string,
    },
    createdAt: Date,
    Images: any[],
  }}){
    return (
        <article>
            {children}
        </article>
    )
}