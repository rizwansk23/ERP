export const formatDate = (date) => {
    return new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString();
};
