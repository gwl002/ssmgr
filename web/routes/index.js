const Router = require("koa-router");
const rootRouter = new Router();
const apiRouter = require("./apis");
const userRouter = require("./users");


rootRouter.use("/api",apiRouter.routes(),apiRouter.allowedMethods());
rootRouter.use("/user",userRouter.routes(),userRouter.allowedMethods());
rootRouter.get("/",async(ctx) =>{
	ctx.redirect("/statics/index.html")
})

module.exports = rootRouter;