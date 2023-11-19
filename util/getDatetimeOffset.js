const getDatetimeOffset = (offset) => {
    const currentDate = new Date();

    const futureDate = new Date(currentDate.getTime() + offset * 60 * 60 * 1000);

    const formattedDate = futureDate.toISOString().slice(0, 19).replace("T", " ");

    return formattedDate;
}

module.exports = getDatetimeOffset
