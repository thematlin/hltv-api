import { getStatsByMatchId } from './match-stats'
import { getMatches } from './matches'
import { getResults, getResultsUntilMatchId } from './results'
import getRSS from './rss'

export default {
  getNews: async () => getRSS('news'),
  getResults,
  getStatsByMatchId,
  getMatches,
  getResultsUntilMatchId,
}
