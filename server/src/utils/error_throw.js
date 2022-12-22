function throw_err_with_code(message, code) {
    let e = new Error(message)
    e.code = code
    throw(e);
}

module.exports = throw_err_with_code