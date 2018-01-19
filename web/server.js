const Koa = require("koa");
const app = new Koa();
const port = 8080

const bodyParser = require("koa-bodyparser");
const staticServer = require("koa-static");
const router = require("./routes/index.js");

app.use(bodyParser());

app.use(router.routes());

app.use(staticServer(__dirname + "/statics"))

app.listen(port,() =>{
	console.log(`server listening on ${port}`);
})