export const saveDataToCookies = (name, data, expiryDays = 30) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(data))}; expires=${expiryDate.toUTCString()}; path=/`;
};

export const getDataFromCookies = (name) => {
    const cookieData = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`));

    if (cookieData) {
        try {
            return JSON.parse(decodeURIComponent(cookieData.split('=')[1]));
        } catch (error) {
            console.error(`Error parsing ${name} from cookies:`, error);
            return null;
        }
    }
    return null;
};