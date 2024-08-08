const jwt = require("jsonwebtoken");
const Joi = require("joi");
const winston = require("winston");
const auth = require("../util/auth");
const config = require("../state/config");
const defaultjson = require("../../save/conf/default.json");
const shared = require("../api/shared");
const WebError = require("../util/web-error");
const admin = require("../util/admin");
const { joiValidate } = require("../util/validation");

exports.setup = (mstream) => {
  // mstream.post('/api/v1/auth/login', async (req, res) => {

  //   try {

  //     const schema = Joi.object({
  //       username: Joi.string().required(),
  //       password: Joi.string().required()
  //     });
  //     await schema.validateAsync(req.body);

  //     if (!config.program.users[req.body.username]) { throw new Error('user not found'); }

  //     await auth.authenticateUser(config.program.users[req.body.username].password, config.program.users[req.body.username].salt, req.body.password)

  //     const token = jwt.sign({ username: req.body.username }, config.program.secret);
  //     // console.log(token);

  //     res.cookie('x-access-token', token, {
  //       maxAge: 157784630000, // 5 years in ms
  //       sameSite: 'Strict',
  //     });

  //     // const admin = defaultjson.users[req.body.username].admin;
  //     // console.log("Undefined admin value: " + admin);
  //     // if (admin == 'null') {
  //     //   res.json({
  //     //     vpaths: config.program.users[req.body.username].vpaths,
  //     //     token: token,
  //     //     admin: false
  //     //   });
  //     // }

  //     res.json({
  //       vpaths: config.program.users[req.body.username].vpaths,
  //       token: token,
  //       admin: config.program.users[req.body.username].admin
  //     });
  //   } catch (err) {
  //     winston.warn(`Failed login attempt from ${req.ip}. Username: ${req.body.username}`, { stack: err });
  //     setTimeout(() => { res.status(401).json({ error: 'Login Failed' }); }, 800);
  //   }
  // });

  // mstream.post('/api/v1/auth/forget', async (req, res) => {

  //   try {

  //     const schema = Joi.object({
  //       username: Joi.string().required(),
  //       password: Joi.string().required()
  //     });
  //     await schema.validateAsync(req.body);

  //     if (!config.program.users[req.body.username]) { throw new Error('user not found'); }

  //     const token = jwt.sign({ username: req.body.username }, config.program.secret);
  //     // console.log(token);

  //     res.cookie('x-access-token', token, {
  //       maxAge: 157784630000, // 5 years in ms
  //       sameSite: 'Strict',
  //     });

  //     await admin.editUserPassword(req.body.username, req.body.password);
  //     res.json({

  //       token: token,

  //     });
  //     // const admin = defaultjson.users[req.body.username].admin;
  //     // if (admin == true) {
  //     //   document.getElementById('admin-panel').style.display = 'none';
  //     // }
  //   } catch (err) {
  //     winston.warn(`Failed reset password attempt from ${req.ip}. Username: ${req.body.username}`, { stack: err });
  //     setTimeout(() => { res.status(401).json({ error: 'Forget Password Failed' }); }, 800);
  //   }
  // });

  // mstream.put("/api/v1/auth/register", async (req, res) => {
  //   const schema = Joi.object({
  //     username: Joi.string().required(),
  //     password: Joi.string().required(),
  //     vpaths: Joi.array().items(Joi.string()).required(),
  //     admin: Joi.boolean().optional().default(false)
  //   });
  //   const input = joiValidate(schema, req.body);

  //   const token = jwt.sign({ username: req.body.username }, config.program.secret);
  //   // console.log(token);

  //   res.cookie('x-access-token', token, {
  //     maxAge: 157784630000, // 5 years in ms
  //     sameSite: 'Strict',
  //   });

  //   await admin.addUser(
  //     input.value.username,
  //     input.value.password,
  //     input.value.admin,
  //     input.value.vpaths
  //   );
  //   res.json({ admin: input.value.admin, token: token });
  // });

  // mstream.use((req, res, next) => {
  //   // Handle No Users
  //   if (Object.keys(config.program.users).length === 0
  //     && !req.path.startsWith('/api/v1/scanner/')
  //   ) {
  //     req.user = {
  //       vpaths: Object.keys(config.program.folders),
  //       username: 'mstream-user',
  //       admin: true
  //     };

  //     return next();
  //   }

  //   const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies['x-access-token'];
  //   if (!token) { throw new WebError('Authentication Error', 401); }
  //   req.token = token;

  //   const decoded = jwt.verify(token, config.program.secret);

  //   if (decoded.scan === true && req.path.startsWith('/api/v1/scanner/')) {
  //     req.scanApproved = true;
  //     return next();
  //   }

  //   // handle federation invite tokens
  //   if (decoded.invite && decoded.invite === true) {
  //     // Invite tokens can only be used with one API path
  //     if (req.path === '/federation/invite/exchange') { return next(); }
  //     throw new WebError('Authentication Error', 401);
  //   }

  //   if (!decoded.username || !config.program.users[decoded.username]) {
  //     throw new WebError('Authentication Error', 401);
  //   }

  //   req.user = config.program.users[decoded.username];
  //   req.user.username = decoded.username;

  //   // Handle Shared Tokens
  //   if (decoded.shareToken && decoded.shareToken === true) {
  //     const playlistItem = shared.lookupPlaylist(decoded.playlistId);

  //     if (
  //       req.path !== '/api/v1/download/shared' &&
  //       req.path !== '/api/v1/db/metadata' &&
  //       req.path.substring(0, 11) !== '/album-art/' &&
  //       playlistItem.playlist.indexOf(decodeURIComponent(req.path).slice(7)) === -1
  //     ) {
  //       throw new WebError('Authentication Error', 401);
  //     }

  //     req.sharedPlaylistId = decoded.playlistId;
  //   }

  //   next();
  // });

  mstream.use((req, res, next) => {
    req.user = {
      vpaths: Object.keys(config.program.folders),
      username: "guest-user",
      admin: false, // or true, depending on your needs
    };

    next();
  });
};
