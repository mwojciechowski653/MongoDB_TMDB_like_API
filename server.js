const cors = require("cors");
const express = require("express");
require("dotenv").config({path: "./config.env"});

const port = process.env.PORT;
const app = express();
const dbo = require("./db/conn");

app.use(cors())
app.use(express.json());
app.use(require("./routes/users"));
app.use(require("./routes/tmdb"));
app.use(require("./routes/watchlist"));
app.use(require("./routes/playlists"));
app.use(require("./routes/reviews"));

app.listen(port, () => {
    dbo.connectToServer(function(err){
        if (err) console.error(err);
    });
    console.log(`Server Started at ${port}`)
})