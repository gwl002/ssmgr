const Router = require("koa-router");

const router = new Router();

router.get("/",async(ctx,next) =>{
	await next();
	ctx.body ="apis";
})

module.exports = router;