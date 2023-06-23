import React, {Fragment, useEffect, useState} from 'react';
import TextInput from "../../Components/Form/TextInput";
import {regString} from "../../util/reg";
import useSearchForm from "../../afterTestCode/useSearchForm";

interface valueInterface  {
    text1: string,
    text2: string
}

const TestPage = () => {

    const initTxt = {
        text1: "",
        text2: 0
    };
    const [value , onChangeFunction , reset , debounce] = useSearchForm(initTxt);

    useEffect(() => {
        console.log("page" , value)
    } , [value])

    return (
        <Fragment>
            <TextInput onChange={debounce("text1")} value={value.text1} onReg={{reg: regString , message: "문자만 입력이 가능합니다."}} debounce={true} />
            <TextInput onChange={onChangeFunction("text2")} value={value.text2} />
            <button onClick={ () => reset()}> test reset</button>
        </Fragment>
    )
}
export default TestPage;