const connection = require("./utils/connection");
const app = require('./app')
const cors = require('cors')

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

async function connect() {
  // do whatever you like here
  const res = await connection();
  console.log(res.message);

  res.error && setTimeout(connect, 5000);
}

connect();
// database connection


// listen Server
const port = 3000;
app.listen(port, '127.0.0.1');
