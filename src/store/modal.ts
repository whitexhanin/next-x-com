
import { Post } from '@/model/Post';
import {create} from 'zustand';

interface ModalStore  {
    mode : 'new' | 'comment',
    data: Post | null,
    setMode (mode : 'new' | 'comment') : void,
    setData (data : Post) : void,
    reset () : void,
}

export const useModalStore = create<ModalStore>((set) => ({
    mode :'new',
    data:null,
    setMode(mode){
        set({mode});
    },
    setData(data){
        set({data});
    },
    reset(){
        set({
            mode:'new',
            data:null,
        })

    }
}))