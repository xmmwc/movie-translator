const isYear = keyword => {
  const match = /^[1-2][0-9]{3}$/
  return match.test(keyword)
}
const isQuality = keyword => {
  return ['brrip', 'bluray', 'web'].indexOf(keyword) >= 0
}

const isRes = keyword => {
  return ['1080p', '720p'].indexOf(keyword) >= 0
}

const isCodec = keyword => {
  return ['xvid', 'x264', 'h264', 'avc'].indexOf(keyword) >= 0
}

const isSound = keyword => {
  return ['dd5', 'mp3', 'ac3', 'dts', 'acc'].indexOf(keyword) >= 0
}

const isSoundNeedNext = keyword => {
  return ['dd5', 'dts', 'hd', 'ma', '5', '7'].indexOf(keyword) >= 0 ? 'sound' : null
}
const isQualityNeedNext = keyword => {
  return ['web'].indexOf(keyword) >= 0 ? 'quality' : null
}


const collectInfo = name => {
  const nameSplit = name.replace(/-/g, '.').split('.')
  const info = {}
  let needNext = null
  let nameDone = false

  for (const [index, keyword] of nameSplit.entries()) {
    const isLast = index === nameSplit.length - 1
    const lowercaseKeyword = keyword.toLowerCase()

    // 是年份
    if (isYear(lowercaseKeyword)) {
      info.year = lowercaseKeyword
      needNext = null
      nameDone = true
      continue
    }

    // 是清晰度
    if (isQuality(lowercaseKeyword)) {
      info.quality = lowercaseKeyword
      needNext = isQualityNeedNext(lowercaseKeyword)
      nameDone = true
      continue
    }

    // 是资源规格
    if (isRes(lowercaseKeyword)) {
      info.res = lowercaseKeyword
      needNext = null
      nameDone = true
      continue
    }

    // 是声音信息
    if (isSound(lowercaseKeyword)) {
      info.sound = lowercaseKeyword
      needNext = isSoundNeedNext(lowercaseKeyword)
      nameDone = true
      continue
    }

    // 是编码格式
    if (isCodec(lowercaseKeyword)) {
      info.codec = lowercaseKeyword
      needNext = null
      nameDone = true
      continue
    }

    // 修正被分离的单词
    if (needNext) {
      switch (needNext) {
        case 'sound':
          if (/1/.test(lowercaseKeyword)) {
            info.sound += `.${lowercaseKeyword}`
          } else if(/hd/.test(lowercaseKeyword)){
            info.sound += `-${lowercaseKeyword}`
          }else{
            info.sound += ` ${lowercaseKeyword}`
          }

          needNext = isSoundNeedNext(lowercaseKeyword)
          break
        case 'quality':
          info.quality += `-${lowercaseKeyword}`
          needNext = isQualityNeedNext(lowercaseKeyword)
          break
        case 'name':
          info.name += ` ${lowercaseKeyword}`
          needNext = 'name'
          break
        default: needNext = null
      }

      continue
    }

    if (isLast) {
      info.author = lowercaseKeyword
      needNext = null
    } else if (!nameDone) {
      info.name = lowercaseKeyword
      needNext = 'name'
    }
  }

  return info
}

export default collectInfo