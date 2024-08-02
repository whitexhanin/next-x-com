import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest){
    const session = await auth();    

    if(!session) {
        // return NextResponse.redirect(new URL('/i/flow/login', request.url));
        return NextResponse.redirect('http://localhost:3000/i/flow/login');
    }    
}

//해당페이지 실행 전 middleware 함수 실행
//로그인 여부를 확인 해야하는 페이지는?뭘까
//afterLogin 은 다 속할 듯.
export const config = {
    matcher:['/compose/tweet','/explore','/home','/messages','/search'],
}