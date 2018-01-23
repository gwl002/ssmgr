const Koa = require("koa");
const app = new Koa();
const jwt = require("koa-jwt");
const port = 8080;
const secret = require("./secret.json");

const bodyParser = require("koa-bodyparser");
const staticServer = require("koa-static");
const mount = require("koa-mount")

const logger = require("koa-logger");
const router = require("./routes/index.js");

app.use(logger());
app.use(bodyParser());

app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

app.use(jwt({secret:secret.sign}).unless({path:[/^\/api/,/^\/$/,/^\/statics\/.+/]}));

app.use(router.routes());
app.use(router.allowedMethods());
app.use(mount("/statics",staticServer(__dirname + "/statics")));


app.listen(port,() =>{
	console.log(`server listening on ${port}`);
})