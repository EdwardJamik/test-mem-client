import { useTheme } from "next-themes";
import {Button, Tooltip} from "@heroui/react";
import React from "react";

const lightTheme = (
    <svg viewBox="0 0 24 24" id='light' width='36px' height='36px' fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="#E6FAFE"></circle>
        <path d="M12 5V3" stroke="#E6FAFE" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M12 21V19" stroke="#E6FAFE" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M16.9498 7.04996L18.364 5.63574" stroke="#E6FAFE" strokeWidth="2"
              strokeLinecap="round"></path>
        <path d="M5.63608 18.3644L7.05029 16.9502" stroke="#E6FAFE" strokeWidth="2"
              strokeLinecap="round"></path>
        <path d="M19 12L21 12" stroke="#E6FAFE" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M3 12L5 12" stroke="#E6FAFE" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M16.9498 16.95L18.364 18.3643" stroke="#E6FAFE" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M5.63608 5.63559L7.05029 7.0498" stroke="#E6FAFE" strokeWidth="2"
              strokeLinecap="round"></path>
    </svg>
)

const darkTheme = (
    <svg viewBox="0 0 24 24" id='dark' fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M21.5287 15.9294C21.3687 15.6594 20.9187 15.2394 19.7987 15.4394C19.1787 15.5494 18.5487 15.5994 17.9187 15.5694C15.5887 15.4694 13.4787 14.3994 12.0087 12.7494C10.7087 11.2994 9.90873 9.40938 9.89873 7.36938C9.89873 6.22938 10.1187 5.12938 10.5687 4.08938C11.0087 3.07938 10.6987 2.54938 10.4787 2.32938C10.2487 2.09938 9.70873 1.77938 8.64873 2.21938C4.55873 3.93938 2.02873 8.03938 2.32873 12.4294C2.62873 16.5594 5.52873 20.0894 9.36873 21.4194C10.2887 21.7394 11.2587 21.9294 12.2587 21.9694C12.4187 21.9794 12.5787 21.9894 12.7387 21.9894C16.0887 21.9894 19.2287 20.4094 21.2087 17.7194C21.8787 16.7894 21.6987 16.1994 21.5287 15.9294Z"
            fill="#18181b"></path>
    </svg>
)

export function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();

    return (
        <Tooltip content={`${theme === 'light' ? 'Вимкнути' : 'Ввімкнути'} світло`} >
            <Button style={{background:'transparent'}} id='themeSwitcher' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? darkTheme : lightTheme}</Button>
        </Tooltip>
    );
}