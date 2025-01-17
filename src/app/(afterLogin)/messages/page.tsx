import RoomList from "./_component/RoomList";
import RoomMessage from "./_component/RoomMessage";
import style from "./page.module.scss";

export default function Page(){
    return(
        <main className={style.messagewrap}>  
            <div className={style.roomsection}>
                <div>
                    <h2>Messages</h2>          
                    <button>new message</button>
                </div>
                <h3>Welcome to your inbox!</h3>
                <button>Write a message</button>                
            </div>
            <div className={style.messection}>
                <h2>Select a message</h2>
                <button>New message</button>
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