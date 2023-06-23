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
