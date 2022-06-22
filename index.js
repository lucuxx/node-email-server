var nodemailer = require('nodemailer')
var schedule = require('node-schedule')
var templateList = require('./template')
var axios = require('axios')

var mailTransport = nodemailer.createTransport({
  host: 'smtp.qq.com',
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: '381274175@qq.com',
    pass: 'uniyqjbmipdjbhfi',
  },
})

function getRandomNumberByRange(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

// console.log(templateList[getRandomNumberByRange(1, 40)])

// app.get('/', (req, res) => res.send('Hello World!'))

// app.get('/send', function(req, res, next) {
var options = {
  from: '"Lucux" <381274175@qq.com>',
  to: '"Dannie" <dannie.fan@farben.com.cn>,"lucux" <381274175@qq.com>',
  subject: '',
  text: '提醒',
  html: ``,
  // attachments :
  //             [
  //                 {
  //                     filename: 'img1.png',            // 改成你的附件名
  //                     path: 'public/images/img1.png',  // 改成你的附件路径
  //                     cid : '00000001'                 // cid可被邮件使用
  //                 },
  //                 {
  //                     filename: 'img2.png',            // 改成你的附件名
  //                     path: 'public/images/img2.png',  // 改成你的附件路径
  //                     cid : '00000002'                 // cid可被邮件使用
  //                 },
  //             ]
}

var options3 = {
  from: '"Lucux" <381274175@qq.com>',
  to: '"lucux" <2356986388@qq.com>,"xx" <1249998355@qq.com>',
  // to: '"lucux" <2356986388@qq.com>',
  subject: '',
  text: '提醒',
  html: ``,
}

// 获取天气预报信息
function getWeather() {
  return axios
    .get('http://wthrcdn.etouch.cn/weather_mini?city=%E6%B7%B1%E5%9C%B3')
    .then((res) => {
      return res.data.data
    })
}

// 问候处理

function xxtianqi() {
  return axios
    .get('http://wthrcdn.etouch.cn/weather_mini?city=%E9%82%AF%E9%83%B8')
    .then((res) => {
      return res.data.data
    })
}

let pageNum = 200
function getxiaohua() {
  return axios.get(`https://v2.alapi.cn/api/joke/random?token=q3Z14x72xOopkC4l`)
}

function getcaihong() {
  return axios.get(`http://api.lovelive.tools/api/SweetNothings`)
}

// var rule = new schedule.RecurrenceRule()

// rule.dayOfWeek = [new schedule.Range(1, 5)]
// rule.hour = [9]
// rule.minute = 0

// 补签处理
function scheduleCronstyle() {
  schedule.scheduleJob(rule, async function() {
    console.log(new Date().toLocaleString())
    const res = await getWeather()
    const resp = await getxiaohua()
    const todayWeather = res.forecast[0]
    const city = res.city
    const tip = res.ganmao
    options.subject = `今日分享：${resp.data.data.data[0].title.substr(
      0,
      10
    )}......`
    options.html = `<p>
    Hi！<br/><p style="color:blue">
    ${city} &emsp; 
    ${todayWeather.date} &emsp;
     ${todayWeather.high} &emsp; 
     ${todayWeather.low} 
     </p>
      <br/>Tip：${tip}<br/>
      <br/>
      </p>
      <br />
      <span style="color:skyblue">${resp.data.data.data[0].title}</span>
      <br/>
      ${resp.data.data.data[0].content} 
      <br/>
      <b style="color:red;">又是美好的一天,要开心喔！</b>
        `
    // options.html = `<p>Hi！<br/> ${templateList[templateNum]} <br/> <br/> <b style="color:red;">又是美好的一天,记得处理iknow补签哦！</b></p>`

    mailTransport.sendMail(options, function(err, msg) {
      if (err) {
        console.log(err)
        // res.render('index', { title: err })
      } else {
        console.log(msg)
        // res.render('index', { title: '已接收：' + msg.accepted })
      }
    })
  })
}

var rule = new schedule.RecurrenceRule()

rule.dayOfWeek = [new schedule.Range(0, 7)]
rule.hour = [8]
rule.minute = 0

function scheduleCronstyle3() {
  schedule.scheduleJob(rule, async function() {
    console.log(new Date().toLocaleString())
    const res = await xxtianqi()
    pageNum++
    const resp = await getxiaohua()
    const rest = await getcaihong()
    const todayWeather = res.forecast[0]
    const city = res.city
    const tip = res.ganmao
    // console.log(resp.data, resp.data.data.data)
    // const templateNum = String(getRandomNumberByRange(1, 100))
    let subject = "今天比昨天更爱你喔！！"
    let content = ""
    if(resp?.data?.code === 200 ){
      subject = rest.data
      content = resp.data.data.content
    }
    options3.subject = `${subject}`
    options3.html = `<p>霄霄媳妇，早上好呀！
    <br/>
    <h4 style="text-decoration:underline">${rest.data}</h4>

    <br/>
     <span style="color:skyblue">今日笑话分享：</span>
     <br/>
     ${content}
     <br/>
  
    <br />
    <p style="color:blue">${city} &emsp;
     ${todayWeather.date} &emsp;
      ${todayWeather.high} &emsp;
       ${todayWeather.low} </p>
       <br/>
       Tip：${tip}<br/>
        <br/>
         <b style="color:red;">爱你哦！</b></p>`
   

    mailTransport.sendMail(options3, function(err, msg) {
      if (err) {
        console.log(err)
        scheduleCronstyle3()
        
      } else {
        console.log(msg)
      }
    })
  })
}

// scheduleCronstyle()
scheduleCronstyle3()
