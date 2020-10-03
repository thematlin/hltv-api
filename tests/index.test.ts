import HLTV from '../src'
import { CONFIG } from '../src/config'
import getRSS from '../src/rss'

describe('hltv-api', () => {
  beforeEach(() => {
    CONFIG.RESULTS = '/results'
    CONFIG.MATCHES = '/matches'
  })
  it('should response with 10 news when we call `getNews`', async () => {
    const response = await HLTV.getNews()
    expect(response.length).toEqual(10)
  })

  it('should have all details when we call `getNews`', async () => {
    expect.hasAssertions()
    const response = await HLTV.getNews()
    const news = response[0]
    expect(news.title.length).toBeGreaterThan(3)
    expect(news.description).toBeDefined()
    expect(news.link).toContain(CONFIG.BASE)
    expect(news.date.length).toBeGreaterThan(10)
    expect(news.date).toContain('GMT')
  })

  it('should catch error in `getRSS`', async () => {
    expect.hasAssertions()
    const err = new Error('Error: Invalid XML')
    await expect(getRSS('error' as any)).rejects.toEqual(err)
  })

  it('should have all details when we call `getResults`', async () => {
    expect.hasAssertions()
    const response = await HLTV.getResults()
    expect(response.length).toBeDefined()
    const result = response[0]
    expect(result.team1.name).toBeDefined()
    expect(result.team1.crest).toContain(CONFIG.CDN_STATIC)
    expect(result.team2.name).toBeDefined()
    expect(result.team2.crest).toContain(CONFIG.CDN_STATIC)
    expect(result.matchId).toContain('/matches/')
  })

  it('should throw `getResults`', async () => {
    expect.hasAssertions()
    CONFIG.RESULTS = '/results_FAIL'
    const err = new Error(
      'Error: There are no results available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api'
    )
    await expect(HLTV.getResults()).rejects.toEqual(err)
  })

  it('should have results until match id has been found', async () => {
    const testData = await HLTV.getResults()
    expect.hasAssertions()
    const response = await HLTV.getResultsUntilMatchId(testData[81].matchId)
    expect(response.length).toBe(81)
  })

  it('should have match metadata when we call `getMatchMetadata` with long Id', async () => {
    expect.hasAssertions()
    const respons = await HLTV.getMatchMetadata(
      '/matches/2343708/astralis-vs-mousesports-esl-pro-league-season-12-europe'
    )
    expect(respons).toMatchInlineSnapshot(`
      Object {
        "event": Object {
          "id": "/events/5372/esl-pro-league-season-12-europe",
          "name": "ESL Pro League Season 12 Europe",
        },
        "maps": Array [
          Object {
            "name": "Dust2",
            "team1Score": 16,
            "team2Score": 3,
          },
          Object {
            "name": "Inferno",
            "team1Score": 6,
            "team2Score": 16,
          },
          Object {
            "name": "Nuke",
            "team1Score": 19,
            "team2Score": 17,
          },
        ],
        "matchStats": Object {
          "team1": Array [
            Object {
              "adr": 88.2,
              "deaths": 49,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/7592/device",
              "kast": 80.5,
              "kills": 68,
              "name": "Nicolai 'device' Reedtzdevice",
              "plusMinus": 19,
              "rating": 1.35,
            },
            Object {
              "adr": 92.4,
              "deaths": 52,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/7398/dupreeh",
              "kast": 76.6,
              "kills": 64,
              "name": "Peter 'dupreeh' Rasmussendupreeh",
              "plusMinus": 12,
              "rating": 1.26,
            },
            Object {
              "adr": 79.2,
              "deaths": 47,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/8611/es3tag",
              "kast": 76.6,
              "kills": 62,
              "name": "Patrick 'es3tag' Hansenes3tag",
              "plusMinus": 15,
              "rating": 1.2,
            },
            Object {
              "adr": 69,
              "deaths": 49,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/7412/gla1ve",
              "kast": 68.8,
              "kills": 46,
              "name": "Lukas 'gla1ve' Rossandergla1ve",
              "plusMinus": -3,
              "rating": 1.02,
            },
            Object {
              "adr": 66.5,
              "deaths": 50,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/9032/Magisk",
              "kast": 75.3,
              "kills": 39,
              "name": "Emil 'Magisk' ReifMagisk",
              "plusMinus": -11,
              "rating": 0.88,
            },
          ],
          "team2": Array [
            Object {
              "adr": 115.7,
              "deaths": 25,
              "flag": Object {
                "name": "Estonia",
                "url": "https://static.hltv.org/images/bigflags/30x20/EE.gif",
              },
              "id": "/player/11816/ropz",
              "kast": 77.8,
              "kills": 38,
              "name": "Robin 'ropz' Koolropz",
              "plusMinus": 13,
              "rating": 1.53,
            },
            Object {
              "adr": 72.6,
              "deaths": 26,
              "flag": Object {
                "name": "Netherlands",
                "url": "https://static.hltv.org/images/bigflags/30x20/NL.gif",
              },
              "id": "/player/2730/chrisJ",
              "kast": 75,
              "kills": 24,
              "name": "Chris 'chrisJ' de JongchrisJ",
              "plusMinus": -2,
              "rating": 1,
            },
            Object {
              "adr": 60.3,
              "deaths": 25,
              "flag": Object {
                "name": "Lithuania",
                "url": "https://static.hltv.org/images/bigflags/30x20/LT.gif",
              },
              "id": "/player/19015/Bymas",
              "kast": 80.6,
              "kills": 19,
              "name": "Aurimas 'Bymas' PipirasBymas",
              "plusMinus": -6,
              "rating": 0.88,
            },
            Object {
              "adr": 52.9,
              "deaths": 27,
              "flag": Object {
                "name": "Denmark",
                "url": "https://static.hltv.org/images/bigflags/30x20/DK.gif",
              },
              "id": "/player/429/karrigan",
              "kast": 66.7,
              "kills": 23,
              "name": "Finn 'karrigan' Andersenkarrigan",
              "plusMinus": -4,
              "rating": 0.84,
            },
            Object {
              "adr": 60.2,
              "deaths": 28,
              "flag": Object {
                "name": "Slovakia",
                "url": "https://static.hltv.org/images/bigflags/30x20/SK.gif",
              },
              "id": "/player/9960/frozen",
              "kast": 72.2,
              "kills": 18,
              "name": "David 'frozen' Čerňanskýfrozen",
              "plusMinus": -10,
              "rating": 0.82,
            },
          ],
        },
        "rewatchLinks": Array [
          Object {
            "flag": Object {
              "name": "United Kingdom",
              "url": "https://static.hltv.org/images/bigflags/30x20/GB.gif",
            },
            "name": "ESL TV (Map 1 - Dust 2)",
            "streamUrl": "https://player.twitch.tv/?video=v759335128&autoplay=true&t=51m20s&parent=www.hltv.org",
          },
          Object {
            "flag": Object {
              "name": "United Kingdom",
              "url": "https://static.hltv.org/images/bigflags/30x20/GB.gif",
            },
            "name": "ESL TV (Map 2 - Inferno)",
            "streamUrl": "https://player.twitch.tv/?video=v759335128&autoplay=true&t=1h46m30s&parent=www.hltv.org",
          },
          Object {
            "flag": Object {
              "name": "United Kingdom",
              "url": "https://static.hltv.org/images/bigflags/30x20/GB.gif",
            },
            "name": "ESL TV (Map 3 - Nuke)",
            "streamUrl": "https://player.twitch.tv/?video=v759335128&autoplay=true&t=2h49m20s&parent=www.hltv.org",
          },
        ],
        "status": "Match over",
        "team1": Object {
          "country": "Denmark",
          "id": "/team/6665/astralis",
          "name": "Astralis",
          "won": true,
        },
        "team2": Object {
          "country": "Europe",
          "id": "/team/4494/mousesports",
          "name": "mousesports",
          "won": false,
        },
        "time": 2020-10-03T12:00:00.000Z,
        "vetoes": Array [
          "1. mousesports removed Overpass",
          "2. Astralis removed Mirage",
          "3. mousesports picked Dust2",
          "4. Astralis picked Inferno",
          "5. mousesports removed Train",
          "6. Astralis removed Vertigo",
          "7. Nuke was left over",
        ],
      }
    `)
  })

  it('should have match stats when we call `getMatches` with long Id', async () => {
    expect.hasAssertions()
    const response = await HLTV.getStatsByMatchId(
      'matches/2332210/liquid-vs-faze-blast-pro-series-miami-2019'
    )
    expect(response.length).toBeCloseTo(10, 5)
    expect(response).toMatchInlineSnapshot(`
          Array [
            Object {
              "adr": 70.2,
              "deaths": 36,
              "kast": 62,
              "kills": 34,
              "playerId": "/player/8520/NAF",
              "playerName": "Keith NAF Markovic",
              "plusMinus": -2,
              "rating": 0.93,
            },
            Object {
              "adr": 79.4,
              "deaths": 42,
              "kast": 54,
              "kills": 30,
              "playerId": "/player/8738/EliGE",
              "playerName": "Jonathan EliGE Jablonowski",
              "plusMinus": -12,
              "rating": 0.83,
            },
            Object {
              "adr": 62.8,
              "deaths": 37,
              "kast": 52,
              "kills": 28,
              "playerId": "/player/7687/nitr0",
              "playerName": "Nick nitr0 Cannella",
              "plusMinus": -9,
              "rating": 0.82,
            },
            Object {
              "adr": 60.8,
              "deaths": 38,
              "kast": 56,
              "kills": 24,
              "playerId": "/player/8797/Stewie2K",
              "playerName": "Jake Stewie2K Yip",
              "plusMinus": -14,
              "rating": 0.69,
            },
            Object {
              "adr": 51.4,
              "deaths": 38,
              "kast": 58,
              "kills": 17,
              "playerId": "/player/10394/Twistzz",
              "playerName": "Russel Twistzz Van Dulken",
              "plusMinus": -21,
              "rating": 0.64,
            },
            Object {
              "adr": 92.6,
              "deaths": 25,
              "kast": 78,
              "kills": 47,
              "playerId": "/player/3741/NiKo",
              "playerName": "Nikola NiKo Kovač",
              "plusMinus": 22,
              "rating": 1.53,
            },
            Object {
              "adr": 99.9,
              "deaths": 32,
              "kast": 72,
              "kills": 47,
              "playerId": "/player/8183/rain",
              "playerName": "Håvard rain Nygaard",
              "plusMinus": 15,
              "rating": 1.5,
            },
            Object {
              "adr": 73.6,
              "deaths": 26,
              "kast": 72,
              "kills": 35,
              "playerId": "/player/334/AdreN",
              "playerName": "Dauren AdreN Kystaubayev",
              "plusMinus": 9,
              "rating": 1.13,
            },
            Object {
              "adr": 73.1,
              "deaths": 27,
              "kast": 74,
              "kills": 34,
              "playerId": "/player/2757/GuardiaN",
              "playerName": "Ladislav GuardiaN Kovács",
              "plusMinus": 7,
              "rating": 1.1,
            },
            Object {
              "adr": 64.2,
              "deaths": 24,
              "kast": 78,
              "kills": 28,
              "playerId": "/player/885/olofmeister",
              "playerName": "Olof olofmeister Kajbjer",
              "plusMinus": 4,
              "rating": 1.06,
            },
          ]
        `)
  })

  it('should throw `getMatches`', async () => {
    expect.hasAssertions()
    CONFIG.MATCHES = '/matches_FAIL'
    const err = new Error(
      'Error: There are no matches available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api'
    )
    await expect(HLTV.getMatches()).rejects.toEqual(err)
  })

  it('should have match stats when we call `getStaticMatchId` with long Id and slash infront of the path', async () => {
    expect.hasAssertions()
    const response = await HLTV.getStatsByMatchId(
      '/matches/2332210/liquid-vs-faze-blast-pro-series-miami-2019'
    )
    expect(response.length).toBeCloseTo(10, 5)
    expect(response).toMatchInlineSnapshot(`
          Array [
            Object {
              "adr": 70.2,
              "deaths": 36,
              "kast": 62,
              "kills": 34,
              "playerId": "/player/8520/NAF",
              "playerName": "Keith NAF Markovic",
              "plusMinus": -2,
              "rating": 0.93,
            },
            Object {
              "adr": 79.4,
              "deaths": 42,
              "kast": 54,
              "kills": 30,
              "playerId": "/player/8738/EliGE",
              "playerName": "Jonathan EliGE Jablonowski",
              "plusMinus": -12,
              "rating": 0.83,
            },
            Object {
              "adr": 62.8,
              "deaths": 37,
              "kast": 52,
              "kills": 28,
              "playerId": "/player/7687/nitr0",
              "playerName": "Nick nitr0 Cannella",
              "plusMinus": -9,
              "rating": 0.82,
            },
            Object {
              "adr": 60.8,
              "deaths": 38,
              "kast": 56,
              "kills": 24,
              "playerId": "/player/8797/Stewie2K",
              "playerName": "Jake Stewie2K Yip",
              "plusMinus": -14,
              "rating": 0.69,
            },
            Object {
              "adr": 51.4,
              "deaths": 38,
              "kast": 58,
              "kills": 17,
              "playerId": "/player/10394/Twistzz",
              "playerName": "Russel Twistzz Van Dulken",
              "plusMinus": -21,
              "rating": 0.64,
            },
            Object {
              "adr": 92.6,
              "deaths": 25,
              "kast": 78,
              "kills": 47,
              "playerId": "/player/3741/NiKo",
              "playerName": "Nikola NiKo Kovač",
              "plusMinus": 22,
              "rating": 1.53,
            },
            Object {
              "adr": 99.9,
              "deaths": 32,
              "kast": 72,
              "kills": 47,
              "playerId": "/player/8183/rain",
              "playerName": "Håvard rain Nygaard",
              "plusMinus": 15,
              "rating": 1.5,
            },
            Object {
              "adr": 73.6,
              "deaths": 26,
              "kast": 72,
              "kills": 35,
              "playerId": "/player/334/AdreN",
              "playerName": "Dauren AdreN Kystaubayev",
              "plusMinus": 9,
              "rating": 1.13,
            },
            Object {
              "adr": 73.1,
              "deaths": 27,
              "kast": 74,
              "kills": 34,
              "playerId": "/player/2757/GuardiaN",
              "playerName": "Ladislav GuardiaN Kovács",
              "plusMinus": 7,
              "rating": 1.1,
            },
            Object {
              "adr": 64.2,
              "deaths": 24,
              "kast": 78,
              "kills": 28,
              "playerId": "/player/885/olofmeister",
              "playerName": "Olof olofmeister Kajbjer",
              "plusMinus": 4,
              "rating": 1.06,
            },
          ]
        `)
  })

  it('should throw `getStatsByMatchId`', async () => {
    expect.hasAssertions()
    const err = new Error(
      'Error: Something went wrong, here is no stats found for this match. Please create an issue in this repository https://github.com/dajk/hltv-api'
    )
    await expect(HLTV.getStatsByMatchId('force-error')).rejects.toEqual(err)
  })

  it('should have stats off all matches when we call `getMatches`', async () => {
    expect.hasAssertions()
    const response = await HLTV.getMatches()
    expect(response.length).toBeGreaterThan(0)
    const result = response[0]
    expect(result.id).toBeDefined()
    expect(result.link).toBeDefined()
    expect(result.event.name).toBeDefined()
    expect(result.event.crest).toContain(CONFIG.STATIC)
    expect(result.stars).toBeDefined()
    expect(result.teams[0].name).toBeDefined()
    expect(result.teams[1].name).toBeDefined()
    if (result.teams[0].crest) {
      expect(result.teams[0].crest).toContain(CONFIG.CDN_STATIC)
    }
    if (result.teams[1].crest) {
      expect(result.teams[1].crest).toContain(CONFIG.CDN_STATIC)
    }
  })
})
