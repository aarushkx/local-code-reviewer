const { add, divide } = require("./math");
const { formatResult } = require("./utils");

function main() {
    const a = 10;
    const b = 0;

    const sum = add(a, b);
    const division = divide(a, b);

    console.log("Sum:", formatResult(sum));
    console.log("Division:", formatResult(division));
}

main();
