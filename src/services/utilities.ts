export const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '66vh',
    width: '40%'
};

export function getDateTime(timestamp: number): [string, string] {
    const date = new Date(timestamp);

    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours24 = date.getHours();
    const minutes = String(date.getMinutes());

    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = String(hours24 % 12 || 12);

    return [`${day}-${month}-${year}`, `${hours12}:${minutes} ${ampm}`];
}