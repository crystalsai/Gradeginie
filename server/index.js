const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path")
const port = process.env.PORT || 5000;
var cors = require("cors");

app.use(cors({
  origin: [process.env.FRONTEND_API_LINK, "http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json()); //to convert request data to json

app.use("/api", async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀")
})

app.use('/media', express.static(path.join(__dirname, 'media')));


// Credential Apis
app.use("/api/student/auth", require("./routes/Student Api/credential.route"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
// Details Apis
app.use("/api/student/details", require("./routes/Student Api/details.route"));
app.use("/api/faculty/details", require("./routes/Faculty Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));
// Other Apis
app.use("/api/timetable", require("./routes/Other Api/timetable.route"));
app.use("/api/material", require("./routes/Other Api/material.route"));
app.use("/api/notice", require("./routes/Other Api/notice.route"));
app.use("/api/subject", require("./routes/Other Api/subject.route"));
app.use("/api/marks", require("./routes/Other Api/marks.route"));
app.use("/api/branch", require("./routes/Other Api/branch.route"));
app.use("/api/contact", require("./routes/Other Api/contact.route"));
app.use("/api/chat", require("./routes/Other Api/chat.route"));

if (require.main === module) {
  const startServer = async () => {
    try {
      await connectToMongo();
      const server = app.listen(port, () => {
        console.log(`Server Listening On http://localhost:${port}`);
      });

      server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
          console.error(`Port ${port} is already in use. Stop the old server or change PORT in .env.`);
          process.exit(1);
        }

        console.error("Server failed to start", error);
        process.exit(1);
      });
    } catch (error) {
      console.error("Server failed to start because MongoDB connection failed");
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;
