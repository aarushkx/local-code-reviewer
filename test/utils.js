function formatResult(value) {
    if (value == null) {
        return "No value";
    }

    return "Result: " + value;
}

module.exports = {
    formatResult
};
