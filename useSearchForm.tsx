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
