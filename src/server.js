const winston = require("winston");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const send = require("send");
require("./util/async-error");

const dbApi = require("./api/db");
const playlistApi = require("./api/playlist");
const authApi = require("./api/auth");
const fileExplorerApi = require("./api/file-explorer");
const downloadApi = require("./api/download");
const adminApi = require("./api/admin");
const remoteApi = require("./api/remote");
const sharedApi = require("./api/shared");
const scrobblerApi = require("./api/scrobbler");
const config = require("./state/config");
const logger = require("./logger");
const transode = require("./api/transcode");
const dbManager = require("./db/manager");
const syncthing = require("./state/syncthing");
const scannerApi = require("./api/scanner");
const WebError = require("./util/web-error");
const defaultjson = require("../save/conf/default.json");

let mstream;
let server;

dotenv.config();

exports.serveIt = async (configFile) => {
  mstream = express();

  try {
    await config.setup(configFile);
  } catch (err) {
    winston.error("Failed to validate config file", { stack: err });
    process.exit(1);
  }

  // Logging
  if (config.program.writeLogs) {
    logger.addFileLogger(config.program.storage.logsDirectory);
  }

  // Set server
  if (config.program.ssl && config.program.ssl.cert && config.program.ssl.key) {
    try {
      config.setIsHttps(true);
      server = require("https").createServer({
        key: fs.readFileSync(config.program.ssl.key),
        cert: fs.readFileSync(config.program.ssl.cert),
      });
    } catch (error) {
      winston.error("FAILED TO CREATE HTTPS SERVER");
      error.code = "BAD CERTS";
      throw error;
    }
  } else {
    config.setIsHttps(false);
    server = require("http").createServer();
  }

  // Middleware
  mstream.use(bodyParser.json());
  mstream.use(bodyParser.urlencoded({ extended: true }));

  // Magic Middleware Things
  mstream.use(cookieParser());
  mstream.use(express.json({ limit: config.program.maxRequestSize }));
  mstream.use(express.urlencoded({ extended: true }));
  mstream.use((req, res, next) => {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Setup DB
  dbManager.initLoki();

  function silentSend(req, res, path) {
    send(req, path)
      .on("error", (err) => {
        // Ignore the error or handle it silently
        // For example, you can log it silently to a file if needed
        // or simply do nothing to suppress the error
        // console.log(`Silent error handler: ${err.message}`);  // Optionally log to console for debug
      })
      .pipe(res);
  }

  // remove trailing slashes, needed for relative URLs on the webapp
  mstream.get("*", (req, res, next) => {
    // check if theres more than one slash at the end of the URL
    if (req.path.endsWith("//")) {
      // find all trailing slashes at the end of the url
      const matchEnd = req.path.match(/(\/)+$/g);
      const queryString =
        req.url.match(/(\?.*)/g) === null ? "" : req.url.match(/(\?.*)/g);
      // redirect to a more sane URL
      return res.redirect(
        302,
        req.path.slice(0, (matchEnd[0].length - 1) * -1) + queryString
      );
    }
    next();
  });

  // Block access to admin page if necessary
  mstream.get("/admin", (req, res, next) => {
    if (config.program.lockAdmin === true) {
      return res.send("<p>Admin Page Disabled</p>");
    }
    if (Object.keys(config.program.users).length === 0) {
      return next();
    }

    try {
      jwt.verify(req.cookies["x-access-token"], config.program.secret);
      next();
    } catch (err) {
      return res.redirect(302, "/");
    }
  });

  mstream.get("/admin/index.html", (req, res, next) => {
    if (config.program.lockAdmin === true) {
      return res.send("<p>Admin Page Disabled</p>");
    }
    next();
  });

  mstream.get("/home", (req, res, next) => {
    if (Object.keys(config.program.users).length === 0) {
      return next();
    }

    try {
      // jwt.verify(req.cookies["x-access-token"], config.program.secret);
      next();
      // return res.redirect(302, '..');
    } catch (err) {
      return res.redirect(302, "/home");
      // next();
    }
  });

  mstream.get("/", (req, res, next) => {
    if (Object.keys(config.program.users).length === 0) {
      return res.redirect(302, "..");
    }

    try {
      jwt.verify(req.cookies["x-access-token"], config.program.secret);
      return res.redirect(302, "..");
    } catch (err) {
      next();
    }
  });

  mstream.get("/baarish", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "baarish.html"));
  });
  mstream.get("/kaisi-paheli-zindagani", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "zindagaani.html"));
  });
  mstream.get("/main-koi-aisa-geet-gaoon", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "geetgaoon.html"));
  });
  mstream.get("/khamoshiyan", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "khamoshiyan.html"));
  });
  mstream.get("/dhadak", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "dhadak.html"));
  });
  mstream.get("/darkhaast", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "darkhaast.html"));
  });
  mstream.get("/raaz-aankhei-teri", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "aankheiteri.html"));
  });
  mstream.get("/meri-sapnon-ki-rani", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "sapnokirani.html"));
  });
  mstream.get("/chahun-main-ya-naa", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "chahunmein.html"));
  });
  mstream.get("/yeh-fitoor-mera", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "yehfitoor.html"));
  });
  mstream.get("/tu-joh-mila", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "tujohmila.html"));
  });
  mstream.get("/abhi-mujh-mein-kahin", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "abhimujh.html"));
  });
  mstream.get("/hamari-adhuri-kahani", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "hamariadhuri.html"));
  });
  mstream.get("/yeh-jism", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "jism.html"));
  });
  mstream.get("/ajib-dastan", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "ajibdastan.html"));
  });
  mstream.get("/ikk-kudi", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "ikkkudi.html"));
  });
  mstream.get("/kya-mujhe-pyar-hain", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "pyarhain.html"));
  });
  mstream.get("/zehnaseeb", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "zehnaseeb.html"));
  });
  mstream.get("/tu-hi-meri-shab-hai", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "shab.html"));
  });
  mstream.get("/mere-yaaraa", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "yaara.html"));
  });
  mstream.get("/chords", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "chords.html"));
  });
  mstream.get("/humnava", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "humnava.html"));
  });
  mstream.get("/subhanallah", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "subhanallah.html"));
  });
  mstream.get("/banjaara", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "banjaara.html"));
  });
  mstream.get("/tiktikvajate", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "tiktikvajate.html"));
  });
  mstream.get("/jeevrangla", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "jeevrangla.html"));
  });
  mstream.get("/kakaan", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "kakaan.html"));
  });
  mstream.get("/jyeinkyu", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "jyeinkyu.html"));
  });
  mstream.get("/hawavein", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "hawavein.html"));
  });
  mstream.get("/jashnebahara", (req, res) => {
    res.sendFile(path.join(__dirname, "../webapp", "jashnebahara.html"));
  });

  mstream.get("/instructions", (req, res, next) => {
    // Use the same logic as the home route
    // If you're serving a specific file, you can do something like:
    res.sendFile(path.join(__dirname, "../webapp", "index.html"));
  });

  mstream.post("/home", async (req, res) => {
    const {
      action,
      firstname,
      lastname,
      email,
      username,
      password,
      confirmpsd,
    } = req.body;

    // const { action1, username1, password1 } = req.body;

    const newUser = new User({
      firstname,
      lastname,
      email,
      username,
      password,
      confirmpsd,
    });

    if (Object.keys(config.program.users).length === 0) {
      return res.redirect(302, "..");
    }

    try {
      if (action === "register") {
        await newUser.save();
        res.send(`
            <script>
                window.location.href = "/home/";
                alert("User Registered Successfully!!!");    

            </script>
        `); // Log success message
        // const token = jwt.sign({ username: req.body.username }, config.program.secret);
        // console.log(token);

        // res.cookie('x-access-token', token, {
        //   maxAge: 157784630000, // 5 years in ms
        // });
        // return res.redirect(302, '..');
      }
      // else if (action1 === 'login') {
      //   User.findOne({ username: username1 })
      //     .then(user => {
      //       // if (err) {
      //       //   console.error(err);
      //       //   return res.status(500).send('Internal Server Error');
      //       // }

      //       if (!user) {
      //         return res.status(401).send('User not registered!!');
      //       }

      //       if (password1 === user.password) {
      //         // Passwords match
      //         const token = jwt.sign({ username: username1 }, config.program.secret);
      //         console.log(token);

      //         res.cookie('x-access-token', token, {
      //           maxAge: 157784630000, // 5 years in ms
      //           sameSite: 'Strict',
      //         });

      //         // res.json({
      //         //   vpaths: config.program.users[username1].vpaths,
      //         //   token: token
      //         // });
      //         // jwt.verify(req.cookies['x-access-token'], config.program.secret);
      //         console.log("Password: " + password1);
      //         return res.redirect(302, '..');
      //       } else {
      //         // Passwords don't match
      //         return res.status(401).send('password is incorrect');
      //       }
      //     });
      // }
      else {
        res.status(400).send("Invalid action");
      }
      // res.redirect(302, '/home/');
      // res.end();
    } catch (err) {
      console.log(err);
      console.error("Error saving user:", err); // Log error
      // res.status(400).send('Error registering user');
      res.send(err);
      // next();
    }
  });

  // Give access to public folder
  mstream.use("/", express.static(config.program.webAppDirectory));

  // Public APIs
  remoteApi.setupBeforeAuth(mstream, server);
  await sharedApi.setupBeforeSecurity(mstream);

  // Everything below this line requires authentication
  authApi.setup(mstream);

  // scannerApi.setup(mstream);
  adminApi.setup(mstream);
  dbApi.setup(mstream);
  playlistApi.setup(mstream);
  downloadApi.setup(mstream);
  fileExplorerApi.setup(mstream);
  transode.setup(mstream);
  scrobblerApi.setup(mstream);
  remoteApi.setupAfterAuth(mstream, server);
  sharedApi.setupAfterSecurity(mstream);
  syncthing.setup();

  // Versioned APIs
  mstream.get("/api/", (req, res) =>
    res.json({ server: require("../package.json").version, apiVersions: ["1"] })
  );

  // album art folder
  mstream.get("/album-art/:file", (req, res) => {
    if (!req.params.file) {
      throw new WebError("Missing Error", 404);
    }

    if (
      req.query.compress &&
      fs.existsSync(
        path.join(
          config.program.storage.albumArtDirectory,
          `z${req.query.compress}-${req.params.file}`
        )
      )
    ) {
      return res.sendFile(
        path.join(
          config.program.storage.albumArtDirectory,
          `z${req.query.compress}-${req.params.file}`
        )
      );
    }

    res.sendFile(
      path.join(config.program.storage.albumArtDirectory, req.params.file)
    );
  });

  // TODO: determine if user has access to the exact file
  // mstream.all('/media/*', (req, res, next) => {
  //   next();
  // });

  Object.keys(config.program.folders).forEach((key) => {
    mstream.use(
      "/media/" + key + "/",
      express.static(config.program.folders[key].root)
    );
  });

  // error handling
  mstream.use((error, req, res, next) => {
    winston.error(`Server error on route ${req.originalUrl}`, { stack: error });

    // Check for validation error
    if (error instanceof Joi.ValidationError) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof WebError) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(500).json({ error: "Server Error" });
  });

  // Start the server!
  server.on("request", mstream);
  server.listen(config.program.port, config.program.address, () => {
    const protocol =
      config.program.ssl && config.program.ssl.cert && config.program.ssl.key
        ? "https"
        : "http";
    winston.info(
      `Access Bridge of Music locally: ${protocol}://localhost:${config.program.port}/home`
    );

    // require("./db/task-queue").runAfterBoot();
  });
};

exports.reboot = async () => {
  try {
    winston.info("Rebooting Server");
    logger.reset();
    scrobblerApi.reset();
    transode.reset();

    // Close the server
    server.close(() => {
      this.serveIt(config.configFile);
    });
  } catch (err) {
    winston.error("Reboot Failed", { stack: err });
    process.exit(1);
  }
};
