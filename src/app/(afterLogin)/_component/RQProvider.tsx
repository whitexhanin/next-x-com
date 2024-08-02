//데이터 패칭은 로그인 이후에만 일어나기 때문에 로그인 이후 그룹에 적용

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

type Props = {
    children : React.ReactNode;
}

function RQProvider({children} : Props){
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,//어플리케이션 잠시 사용 안할때 오래된 쿼리를 백그라운드에서 자동으로 새로운 데이터 요청을 전역적 또는 쿼리별 컨트롤                    
                    retryOnMount: true,
                    refetchOnReconnect: false,//
                    retry: false, // 쿼리 재시도 false : 재시도 비활성화, 6 : 6번 재시도, true : 무한히 재 시도,(실패카운트,오류)=>{} : 실패이유에 따라 사용자 정의 논리 사용
                    
                }
            }
        })
    )
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE === "local"} />
        </QueryClientProvider>
    )
}

export default RQProvider;