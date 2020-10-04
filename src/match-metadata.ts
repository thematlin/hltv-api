import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { CONFIG } from './config'

interface IMap {
  name: string
  team1Score: number | null
  team2Score: number | null
  pickedBy?: string
}

interface IFlag {
  name: string
  url: string
}

interface IRewatchLink {
  name: string
  flag: IFlag
  streamUrl: string
}

interface IMatchStats {
  name: string
  flag: IFlag
  kills: number
  deaths: number
  plusMinus: number
  adr: number
  kast: number
  rating: number
  id: string
}

interface ITeam {
  name: string
  country: string
  won: boolean
  id: string
}

interface IMatchMetadata {
  time: Date
  status: string
  team1: ITeam
  team2: ITeam
  event: {
    name: string
    id: string
  }
  maps: Array<IMap>
  vetoes: Array<string>
  rewatchLinks: Array<IRewatchLink>
  matchStats: {
    team1: Array<IMatchStats>
    team2: Array<IMatchStats>
  }
}

function extractMaps(
  mapHolders: cheerio.Cheerio,
  $: cheerio.Root
): Array<IMap> {
  const maps: Array<IMap> = []
  mapHolders.each((_i, element) => {
    const name = $(element).find('.mapname').text()
    const team1ScoreString = $(element)
      .find('.results-team-score')
      .first()
      .text()
    const team2ScoreString = $(element)
      .find('.results-team-score')
      .last()
      .text()
    const pickedBy = $(element).find('.results-left').hasClass('pick') // true means team1 picked map, false means team2 picked map

    maps.push({
      name,
      team1Score: Number.isNaN(parseInt(team1ScoreString, 10))
        ? null
        : parseInt(team1ScoreString, 10),
      team2Score: Number.isNaN(parseInt(team2ScoreString, 10))
        ? null
        : parseInt(team2ScoreString, 10),
    })
  })

  return maps
}

function extractTeams($: cheerio.Root): { team1: ITeam; team2: ITeam } {
  const team1Container = $('.teamsBox .team').first()
  const team1 = {
    name: $(team1Container).find('.teamName').text(),
    country: $(team1Container).children('img').attr('title') || '',
    won: $(team1Container).find('.team1-gradient > div').hasClass('won'),
    id: $(team1Container).find('.team1-gradient > a').attr('href') || '',
  }

  const team2Container = $('.teamsBox .team').last()
  const team2 = {
    name: $(team2Container).find('.teamName').text(),
    country: $(team2Container).children('img').attr('title') || '',
    won: $(team2Container).find('.team2-gradient > div').hasClass('won'),
    id: $(team2Container).find('.team2-gradient > a').attr('href') || '',
  }

  return {
    team1,
    team2,
  }
}

function extractRewatchLinks(
  streams: cheerio.Cheerio,
  $: cheerio.Root
): Array<IRewatchLink> {
  const rewatchLinks: Array<IRewatchLink> = []

  $(streams)
    .find('.stream-box')
    .each((_i, element) => {
      const embedStreamAttr = $(element).data('stream-embed')

      if (embedStreamAttr && embedStreamAttr.includes('twitch.tv')) {
        const flagImg = $(element).find('.stream-flag')
        rewatchLinks.push({
          streamUrl: embedStreamAttr,
          name: $(element).find('.spoiler').text(),
          flag: {
            name: flagImg.attr('title') || '',
            url: flagImg.attr('src') || '',
          },
        })
      }
    })

  return rewatchLinks
}

function extractVetoes($: cheerio.Root): Array<string> {
  const vetoes: Array<string> = []
  $('.maps .veto-box')
    .last()
    .find('.padding > div')
    .each((_i, element) => {
      vetoes.push($(element).text())
    })

  return vetoes
}

function extractMatchStats(
  matchStats: cheerio.Cheerio,
  $: cheerio.Root
): { team1: Array<IMatchStats>; team2: Array<IMatchStats> } {
  function teamExtractor(teamTable: cheerio.Cheerio): Array<IMatchStats> {
    const teamMatchStats: Array<IMatchStats> = []
    $(teamTable)
      .find('tr')
      .each((_i, element) => {
        if (!$(element).hasClass('header-row')) {
          const matchKillsDeaths = $(element)
            .find('.kd')
            .text()
            .match(/([0-9]+)-([0-9]+)/)
          if (!matchKillsDeaths) {
            throw new ReferenceError(
              `Kills/Deaths failed to match on ${$(element).find('.kd').text()}`
            )
          }
          teamMatchStats.push({
            name: $(element).find('.statsPlayerName').text(),
            flag: {
              name: $(element).find('.flag.flag').attr('title') || '',
              url: $(element).find('.flag.flag').attr('src') || '',
            },
            kills: parseInt(matchKillsDeaths[1], 10),
            deaths: parseInt(matchKillsDeaths[2], 10),
            plusMinus: parseInt($(element).find('.plus-minus').text(), 10),
            adr: parseFloat($(element).find('.adr').text()),
            kast: parseFloat($(element).find('.kast').text()),
            rating: parseFloat($(element).find('.rating').text()),
            id: $(element).find('.players a').attr('href') || '',
          })
        }
      })

    return teamMatchStats
  }

  const team1 = teamExtractor($(matchStats).find('.totalstats').first())
  const team2 = teamExtractor($(matchStats).find('.totalstats').last())

  return {
    team1,
    team2,
  }
}

export async function getMatchMetadata(
  matchId: string
): Promise<IMatchMetadata> {
  const url = `${CONFIG.BASE}/${matchId}`

  try {
    const body = await (
      await fetch(url, {
        headers: { 'User-Agent': 'node-fetch' },
      })
    ).text()

    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const unixTime = $('.timeAndEvent .time').attr('data-unix') || ''
    const status = $('.timeAndEvent .countdown').text()
    const eventAnchor = $('.timeAndEvent .event a')
    const event = {
      name: eventAnchor.attr('title') || '',
      id: eventAnchor.attr('href') || '',
    }
    const maps = extractMaps($('.mapholder'), $)
    const teams = extractTeams($)
    const vetoes = extractVetoes($)
    const rewatchLinks = extractRewatchLinks($('.streams'), $)
    const matchStats = extractMatchStats($('.matchstats'), $)

    return {
      time: new Date(parseInt(unixTime, 10)),
      status,
      team1: teams.team1,
      team2: teams.team2,
      event,
      maps,
      vetoes,
      rewatchLinks,
      matchStats,
    }
  } catch (error) {
    throw new Error(error)
  }
}
