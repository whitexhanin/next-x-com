import BackButton from "../_component/BackButton";
import Post from "../_component/Post";
import  SearchForm  from "../_component/SearchForm";
import SearchResult from "./_component/SearchResult";
import Tab from "./_component/Tab";
import style from "./page.module.scss";



export default function Page({searchParams} : {searchParams : {q:string}}) {

    console.log('searchParams',searchParams.toString());
    
    return (
        <main>
            <div className={style.searchTop}>
                <div className={style.searchZone}>
                    <div className={style.buttonZone}>
                        <BackButton />
                    </div>
                    <div className={style.formZone}>
                        <SearchForm q = {searchParams.q}/>
                    </div>
                </div>
                <Tab />                
            </div>
            <div className={style.list}>
                <SearchResult searchParams = {searchParams}/>
            </div>
        </main>
    )
}