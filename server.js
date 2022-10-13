const connection = require("./utils/connection");
const app = require('./app')
const cors = require('cors')

app.use(
      cors({
        origin: "http://localhost:3000",
      })
    );
// database connection
connection();

// listen Server
const port = process.env.PORT || 80;
app.listen(port, console.log(`Listening on port ${port}...`));
