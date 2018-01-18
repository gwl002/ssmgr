const func = async(param) =>{
	if(param == 1){
		return Promise.resolve(1)
	}else{
		return Promise.reject(0)
	}
}

func(2).then(s=>{
	console.log(s)
},e=>{
	console.log(e)
})