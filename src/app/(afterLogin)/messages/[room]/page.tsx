'use client';
import { useSession } from "next-auth/react";
import RoomList from "../_component/RoomList";
import MessageBox from "./_component/MessageBox";
import style from "./page.module.scss";


export default function Page ({params} : {params : {room : string}}) {
    const {data : session} = useSession();
    console.log(params);
    const ids = params.room.split('-').filter(v => v !== session?.user?.email);

    return (
        <main className={style.messagewrap}>  
            <div className={style.roomsection}>
                <div>
                    <h2>Messages</h2>          
                    <button>new message</button>
                </div>
                <RoomList id={ids[0]}/>
            </div>
            <div className={style.messection}>
                <MessageBox id={ids[0]}/>
            </div>            

            {/* nav router 수정 : 메시지 룸이 있으면 
                    첫번째 룸으로 이동
                메시지 룸 없으면
                    message 접속 화면으로 이동            
            */}
            {/* 


            */}
        </main>
    )
}