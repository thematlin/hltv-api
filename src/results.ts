import { match } from 'assert'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { CONFIG } from './config'

interface IResult {
  event: string
  maps: string | 'bo3'
  team1: {
    name: string
    crest: string
    result: number
  }
  team2: {
    name: string
    crest: string
    result: number
  }
  matchId: string
}
interface Dictionary<T> {
  [Key: string]: T
}

const MONTHS: Dictionary<string> = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
}

function getResultData(element: cheerio.Element, $: cheerio.Root): IResult {
  const el = $(element).find('tr')
  const team1 = el.children('.team-cell').first()
  const team2 = el.children('.team-cell').last()
  const matchId = $(element).children('a').attr('href')!
  const maps = el.find('.map-text')
  const result1 = el.find('.result-score').children('span').first()
  const result2 = el.find('.result-score').children('span').last()

  const result: IResult = {
    event: el.find('.event-name').text(),
    maps: maps.text(),
    team1: {
      name: team1.find('.team').text(),
      crest: team1.find('img').attr('src')!,
      result: parseInt(result1.text(), 10),
    },
    team2: {
      name: team2.find('.team').text(),
      crest: team2.find('img').attr('src')!,
      result: parseInt(result2.text(), 10),
    },
    matchId,
  }

  return result
}

async function getCheerioRoot(offset?: number): Promise<cheerio.Root> {
  const url = offset
    ? `${CONFIG.BASE}${CONFIG.RESULTS}?offset=${offset}`
    : `${CONFIG.BASE}${CONFIG.RESULTS}`
  try {
    const body = await (
      await fetch(url, {
        headers: { 'User-Agent': 'node-fetch' },
      })
    ).text()

    const $ = cheerio.load(body, { normalizeWhitespace: true })

    return $
  } catch (error) {
    throw new Error(error)
  }
}

export async function getResults(): Promise<IResult[]> {
  try {
    const $ = await getCheerioRoot()

    const results: IResult[] = []

    const resultElements = $('.results-all .result-con')
    $(resultElements).each((_i, element) => {
      const objData: IResult = getResultData(element, $)

      results.push(objData)
    })

    if (!results.length) {
      throw new Error(
        'There are no results available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api'
      )
    }

    return results
  } catch (error) {
    throw new Error(error)
  }
}

async function recursiveFindUntilMatchId(
  matchId: string,
  offset?: number
): Promise<IResult[]> {
  try {
    const $ = await getCheerioRoot(offset)

    let results: IResult[] = []
    let foundMatchId: boolean = false

    const resultElements = $('.results-all .result-con')
    $(resultElements).each((_i, element) => {
      const objData: IResult = getResultData(element, $)

      if (objData.matchId === matchId) {
        foundMatchId = true
      }

      if (!foundMatchId) {
        results.push(objData)
      }
    })

    if (!foundMatchId) {
      const continuedResults: IResult[] = await recursiveFindUntilMatchId(
        matchId,
        offset ? offset + 100 : 100
      )
      results = results.concat(continuedResults)
    }

    return results
  } catch (error) {
    throw new Error(error)
  }
}

export async function getResultsUntilMatchId(
  matchId: string
): Promise<IResult[]> {
  try {
    return await recursiveFindUntilMatchId(matchId)
  } catch (error) {
    throw new Error(error)
  }
}

async function recursiveFindUntilDate(
  untilDate: Date,
  offset?: number
): Promise<IResult[]> {
  try {
    const $ = await getCheerioRoot(offset)

    let results: IResult[] = []
    let foundDate: boolean = false

    const resultElements = $('.results-holder > .results-all .result-con')
    $(resultElements).each((_i, element) => {
      const objData: IResult = getResultData(element, $)

      const headline = $(element).siblings('.standard-headline').text()
      const dateSplit = headline.substring(12).split(' ')
      let day = '01'
      const dayMatch = dateSplit[1].match(/[0-9]+/)
      if (dayMatch) {
        day = dayMatch[0].length === 1 ? `0${dayMatch[0]}` : dayMatch[0]
      }
      const date = new Date(`${dateSplit[2]}-${MONTHS[dateSplit[0]]}-${day}`)

      if (untilDate.getTime() === date.getTime()) {
        foundDate = true
      }

      if (!foundDate) {
        results.push(objData)
      }
    })

    if (!foundDate) {
      const continuedResults: IResult[] = await recursiveFindUntilDate(
        untilDate,
        offset ? offset + 100 : 100
      )
      results = results.concat(continuedResults)
    }

    return results
  } catch (error) {
    throw new Error(error)
  }
}

export async function getResultsUntilDate(untilDate: Date): Promise<IResult[]> {
  try {
    return await recursiveFindUntilDate(untilDate)
  } catch (error) {
    throw new Error(error)
  }
}
