import moment from "moment";

export const formatDuration = (ms) => {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hr = Math.floor(ms / (1000 * 60 * 60));

    const parts = [];

    if (hr > 0) parts.push(`${hr}h`);
    if (min > 0) parts.push(`${min}m`);
    if (sec > 0 || parts.length === 0) parts.push(`${sec}s`);

    return parts.join(" ");
};

export const formatDate = (date) => {
    return moment(date).format("ll");
};

export const formatDateTime = (dateTime) => {
    return moment(dateTime).format("lll");
};
