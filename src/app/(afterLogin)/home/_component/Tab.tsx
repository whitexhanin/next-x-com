"use client";
import { useContext, useState } from 'react';
import style from './Tab.module.scss';
import { TabContext } from './TabProvider';

export default function Tab(){
    const {tab , setTab} = useContext(TabContext);

    const onClickRecTab  = () => {
        setTab('rec');
    }
    const onClickFolTab  = () => {
        setTab('fol');
    }

    return (
        <div className={style.homeFixed}>
            <div className={style.homeText}>홈</div>
            <div className={style.homeTab}>
                <button onClick={onClickRecTab}>
                    추천
                    <span className={style.tabIndicator} hidden={tab === 'fol'}></span>
                </button>
                <button onClick={onClickFolTab}>
                    팔로우 중
                    <span className={style.tabIndicator} hidden={tab === 'rec'}></span>
                </button>
            </div>
        </div>
    )
}