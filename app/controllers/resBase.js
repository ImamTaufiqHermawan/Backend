const resSuccess = (message, data) => {
    return {
        success : true,
        message : message,
        data
    }
}

module.exports = {
    resSuccess
}