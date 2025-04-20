import { heroui } from "@heroui/react";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        heroui({
            prefix: "heroui",
            addCommonColors: false,
            // defaultTheme: "dark", // default theme from the themes object
            // defaultExtendTheme: "dark", // default theme to extend on custom themes
            themes: {
                light: {
                    colors: {
                        primary: {
                            DEFAULT: "#E6FAFE",
                            foreground: "#18181b",
                        },
                        background: "#fff",
                        black: "#18181b",
                        focus: "#E6FAFE",
                    },
                },
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "#E6FAFE",
                            foreground: "#18181b",
                        },
                        background: "#18181b",
                        black: "#1c1c1c",
                        focus: "#E6FAFE",
                    },
                },
            },
        }),
    ],
}