const https = require('https')
const fs = require('fs')
const path = require('path')
//const uuidv1 = require('uuid/v1')

// links that has been parsed
let linksArr=[];
// unformatted records (title, genre, type, releaseDate, languages, webUrl, imageUrl)
let unformattedRecords=[];

const downloadPage = (url) => {

  fs.mkdirSync(folderName)
  fetchPage(url, (error, data)=>{
    if (error) return console.log(error)
    fs.writeFileSync(path.join(__dirname, folderName, 'url.txt'), url)  
    fs.writeFileSync(path.join(__dirname, folderName, 'file.html'), data)
    console.log('downloading is done in folder ', folderName)
  })
  
}

const fetchPage = (url, callback) => {
  https.get(url, (response) => {
    let buff = ''
    response.on('data', (chunk) => { 
      buff += chunk
    })
    response.on('end', () => {
      callback(null, buff, url)
    })
  }).on('error', (error) => {
    console.error(`Got error: ${error.message}`)
    callback(error)
  })
}
// ((\s|\S)*entities:\s*{\s*)|(\s*}\s*,\s*serverTime(\s|\S)*)

const entityRegEx = /entities:\s*{(.+)},\s*serverTime:/ /* extact value using match at 1 index */
const entityRegEx2 = /partial:\s*\w+\s*},/g           /* split */
const nextRegEx = /next=(.+?)'/       /* extact value using match at 1 index */
const tabRegEx = /tab-container\s*undefined\s*tab-(.+?)'/ /* extact value using match at 1 index */
const linksRegEx = /<div.+homepage-tab-headers.+?>\s*<a.+<\/a>\s*<\/div>/g
let linksRegEx2 = /href='(.+?)'/g
const url="https://www.mxplayer.in"
const apiBaseUrl="https://api.mxplay.com/v1/web/home/tab"
const userid='ec37c2e4-8494-413a-a806-cce086591686'

const callback=(error,data,url)=>{
  if (error) return console.log(error)
  extractData(data)
}

const extractData=(data)=>{
  data=data.replace(/\r?\n|\r/g,' ').replace("\"","'")  /*replace newline with space */
  let next=data.replace(nextRegEx,'')
  let tab=data.replace(tabRegEx,'')
  let entities=data.replace(entityRegEx,'').replace(entityRegEx2,'')
  let fullURL=apiBaseUrl+'/'+tab+'?next='+next+'&userid='+userid+'&platform=com.mxplay.desktop&content-languages=hi,en';
  let records=[]
  fetchPage(fullURL,(error,raw,url)=>{
    if (error) return console.log(error)
    else {
      let object = typeof raw != 'object' ? JSON.parse(raw) : raw
      console.log(object)
      for(let i of object.sections) {
        for(let j of i.items) {
          let genres,languages
          for(let k of j.genres) genres+=k
          for(let k of j.languages) languages+=k        
          records.push({
            title:j.title, 
            genres:genres, 
            type:j.type, 
            releaseDate:j.releaseDate, 
            languages:languages, 
            webUrl:url+j.webUrl, 
            image:url+j.image["16x9"]
          })
        }
      }
      //extract records in data
      let temps=entities.split(entityRegEx3)
      console.log("b:",temps.length)
      for(let temp of temps) {   
        let image='';               /'16x9':\s*(.+?)'/
        if(temp.includes("16x9")) image=url+temp.match(/((\s|\S)*"16x9":\s*")|",(\s|\S)*/gi,'')
        records.push({
          title:temp.replace(/((\s|\S)*title:\s*")|",(\s|\S)*/gi,''), 
          genres:temp.replace(/((\s|\S)*genres:\s*\[|\],(\s|\S)*)/gi,''), 
          type:temp.replace(/((\s|\S)*type:\s*")|",(\s|\S)*/gi,''), 
          releaseDate:temp.replace(/((\s|\S)*releaseDate:\s*")|",(\s|\S)*/gi,''), 
          languages:temp.replace(/((\s|\S)*languages:\s*\[)|\],(\s|\S)*/gi,''), 
          webUrl:url+temp.replace(/((\s|\S)*webUrl:\s*")|",(\s|\S)*/gi,''), 
          image:image
        })
      }
      console.log("2:",records[records.length-1])
      //extract links in data
      var found = data.match(linksRegEx)
      var links=[],xArray
      while(xArray = linksRegEx2.exec(found)) 
        links.push(xArray[0].slice(6,xArray[0].length-1))
      unformattedRecords.concat(records)
      linksArr.push(url)
      for(let link of obj.links) 
        if(!linksArr.includes(link))
          crawlMXplayer(link)
      console.log("Links:",linksArr.length)
      return;
    }
  })
}

const crawlMXplayer=(url)=> fetchPage(url,callback)

crawlMXplayer(url)



