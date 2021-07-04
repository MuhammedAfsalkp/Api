// console.log(process.env.NODE_ENV)
// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);//to convert into hex number
//     });
// }

// var test=uuidv4()
// console.log(test)
// console.log(Math.random() * 16| 0)
// console.log("test".toString(16))
// "aaa".replace(/[a/b]/g,function(c){
//     console.log(c)
// })
// console.log(v=(15 & 0x3 | 0x8))
// console.log(v.toString(16))

// var secs=36000
// const expiration = Math.floor(Date.now() / 1000) + secs;
// const refreshExpiration = Math.floor(Date.now() / 1000) + (secs + 300); 
// console.log(expiration,refreshExpiration)
// var c=Date.now()/1000+secs
// console.log(Date(c).toString())
const crypto=require('crypto')

const salt = crypto.randomBytes(16).toString('base64');
console.log(salt)
id="sccw"
const hash=crypto.createHmac('sha512',salt).update(id).digest('base64')
console.log(hash)


// const { format,addMinutes,  } =require('date-fns')

// const min=5

// let add2=min*60*1000
// const expiration = Math.floor(Date.now() ) ;
// const refreshExpiration = Math.floor(Date.now() ) +add2;
// console.log(expiration,refreshExpiration)
// console.log(new Date(expiration),new Date(refreshExpiration))
// const jwt=require('jsonwebtoken')

// let min = (m)=>m*60;

// const cur=Math.floor(Date.now())
// const expiration = Math.floor(Date.now()/1000 ) +min(1);
// const refreshExpiration = Math.floor(Date.now()) +min(10) ;
// console.log(new Date(cur),new Date(expiration),new Date(refreshExpiration))
// console.log(new Date(1625199231*1000).toTimeString())
// console.log(new Date(1625199831*1000).toTimeString())

//console.log(new Date(cur).toTimeString(),new Date(expiration).toTimeString(),new Date(refreshExpiration).toTimeString())
// const token=jwt.sign({name:"afsal",exp:expiration},"secret",)
// const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWZzYWwiLCJleHAiOjE2MjUxNTY3NTgsImlhdCI6MTYyNTE1NjY5OH0.WbYb0-Ks--vnObjKdNVjb-W0JXjRp1Ul9WpX6FwJUjU'.toString()
// console.log(token)
// const ve=jwt.verify(token,'secret')
// console.log(ve)












