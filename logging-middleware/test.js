const Log = require("./logger");

async function test() {
  const result = await Log(
    "backend",
    "info",
    "middleware",
    "Logger package working successfully"
  );

  console.log(result);
}

test();