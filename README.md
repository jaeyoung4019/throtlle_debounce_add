#useSearchForm with Throttle , Debounce

원래 있던 useSearchForm 에 Throttle 과 Debounce 기능을 추가해두었습니다.
```ts
import React, { useCallback, useState } from 'react';

interface variableInterface {
    [key: string]: string | number;
}

type eventValueType = string | number;
type searchFormHookResultType = [
    variableInterface,
    (type: string) => (value: eventValueType) => void,
    () => void,
    (type: string) => (value: eventValueType) => void
];

const useSearchForm: (
    initVariable: variableInterface
) => searchFormHookResultType = (initVariable) => {
    const [schVariable, setSchVariable] = useState<variableInterface>(initVariable);

    let timer: NodeJS.Timeout | null;

    const throttle: (type: string) => (value: eventValueType) => void = useCallback((type) => (value) => {
        if(timer)
            return;
        timer = setTimeout(() => {
            setSchVariable((before) => {
                return {
                    ...before,
                    [type]: (typeof value === 'string' && !Number.isNaN(value)) ? value : Number(value),
                };
            });
            clearTimeout(timer as NodeJS.Timeout);
            timer = null;
        }, 500);
    }, [schVariable])

    const debounce: (type: string) => (value: eventValueType) => void = useCallback((type) => (value) => {
        if(timer)
            clearTimeout(timer as NodeJS.Timeout);
        timer = setTimeout(() => {
            setSchVariable((before) => {
                return {
                    ...before,
                    [type]: (typeof value === 'string' && !Number.isNaN(value)) ? value : Number(value),
                };
            });
            timer = null;
        }, 500);
    }, [schVariable])

    const variableChange: (type: string) => (value: eventValueType) => void =
        useCallback(
            (type) => (value) => {
                setSchVariable((before) => {
                    return {
                        ...before,
                        [type]: (typeof value === 'string' && !Number.isNaN(value)) ? value : Number(value),
                    };
                });
            },
            []
        );

    const reset = useCallback(
        () => setSchVariable(initVariable),
        [initVariable]
    );

    return [schVariable, variableChange, reset , debounce];
};

export default useSearchForm;

```

사용법

```ts

   const [value , onChangeFunction , reset , debounce] = useSearchForm(initTxt); 선언
    <TextInput onChange={debounce("text1")} value={value.text1} onReg={{reg: regString , message: "문자만 입력이 가능합니다."}} debounce={true} /> 사용
````


TextInput 바꾸기

```ts
import React, { useEffect, useState } from "react";

interface InputProps {
    onChange: (value: string | number) => void;
    value: string | number;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onReg?: {
        reg: RegExp;
        message: string;
    };
    debounce?: boolean;
}

const TextInput = ({ onChange, value, onBlur, onReg, debounce }: InputProps) => {
    const [text, setText] = useState(value);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;

        if (onReg != null) {
            if (!onReg.reg.test(text)) {
                alert(onReg.message);
                return false;
            }
        }
        setText(text);
        if (debounce) onChange(text);
    };

    const onBlurHandler =
        onBlur != null
            ? onBlur
            : debounce
            ? (e: React.FocusEvent<HTMLInputElement>) => {}
            : (e: React.FocusEvent<HTMLInputElement>) => {
                  const text = Number.isNaN(e.target.value) ? Number(e.target.value) : (e.target.value as string);
                  onChange(text);
              };

    useEffect(() => {
        setText(value);
    }, [value]);

    return <input onChange={onChangeHandler} value={text} onBlur={onBlurHandler} />;
};

export default TextInput;

```

debounce 를 사용할 경우 ChangeEvent 에서 바로 variable 을 바꾸어 주어야하기 때문에 옵션을 넣을 경우 바로 처리하고 onBlur 에서 상태를 업데이트해주지 않도록 해야합니다.
