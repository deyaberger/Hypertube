function throw_err_with_data(message, data) {
    let e = new Error(message)
    e.data = data
    throw(e);
}

module.exports = throw_err_with_data