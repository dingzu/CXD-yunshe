export function resolveDocList(docs,kind,coverData) {
    let resolvedDocs = []
    docs.forEach(doc=>{
        // 发布后的文章才会显示
        if (doc.status == 1) {
          let data = {}
          data.id = doc.id
          if(doc.title.match(/\【(\S*)\】/)){
            data.kind = doc.title.match(/\【(\S*)\】/)[1]
            doc.title = doc.title.replace("【" + data.kind + "】","");
          } else {
            // 默认类型
            data.kind = null
          }
          if(doc.title.match(/\{(\S*)\}/)){
              data.en = doc.title.match(/\{(\S*)\}/)[1]
              doc.title = doc.title.replace("{" + data.en + "}","");
            } else {
              // 默认西文名
              data.en = null
          }
          data.title = doc.title
          data.cover = doc.cover
          const des = resolveData(doc.custom_description)
          if (des.cover){
            if (coverData[des.cover]) {
              data.cover = coverData[des.cover]
            } else {
              data.cover = 'no-img'
            }
          }
          data.tag = des.tag || ''
          if (data.tag.indexOf('/')>-1){
            data.tag = data.tag.split('/')
          } else {
            data.tag = [data.tag]
          }
          data.excerpt = des.des
          data.link = '/' + kind + '/' + doc.slug
          resolvedDocs.push(data)
        }
      })
    return resolvedDocs
}

export function resolveDocHtml(doc) {
  let resolvedDoc = {}
  const des = resolveData(doc.data.custom_description)
  // 获取文章html 部分
  resolvedDoc.html = doc.data.body_html
  // 获取文章背景图
  resolvedDoc.hero = des.hero || 'no-img'
  // 获取文章名称
  const title = doc.data.title
  resolvedDoc.title = title.replace(/\【(\S*)\】/,"").replace(/\{(\S*)\}/,"");
  // 获取英文名
  resolvedDoc.english = des.english || 'By Cxd'
  return resolvedDoc
}

export function resolveCover(covers) {
  let resolvedCover = {}
  covers.forEach(data=>{
    let cover = {title:'', src:''}
    // 获取文件名
    cover.title = data.match(/name\=.+\.[a-z]+/)[0].split('name=')[1]
    // 获取图片 url
    cover.src = data.match(/src\=\".+width\=[0-9]+/)[0].split('src="')[1]
    // 生成成对象模式
    let key = cover.title;
    let value = cover.src
    resolvedCover[key] = value;
  })
  return resolvedCover
}

function resolveData(des){
  let resolveData = {des: des}
  if(des.indexOf('des')>-1) {
    resolveData.des = des.match(/des\:(.*)/)[1]
  }
  if(des.indexOf('cover')>-1) {
    resolveData.cover = des.match(/cover\:(.*)/)[1]
  }
  if(des.indexOf('tag')>-1) {
    resolveData.tag = des.match(/tag\:(.*)/)[1]
  }
  if(des.indexOf('hero')>-1) {
    resolveData.hero = des.match(/hero\:(.*)/)[1]
  }
  if(des.indexOf('kind')>-1) {
    resolveData.kind = des.match(/kind\:(.*)/)[1]
    // console.log(resolveData.kind)
  }
  if(des.indexOf('english')>-1) {
    resolveData.english = des.match(/english\:(.*)/)[1]
  }
  // console.log(resolveData)
  return resolveData
}