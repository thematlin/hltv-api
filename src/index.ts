import { getStatsByMatchId } from './match-stats'
import { getMatches } from './matches'
import {
  getResults,
  getResultsUntilMatchId,
  getResultsUntilDate,
} from './results'
import getRSS from './rss'
import { getMatchMetadata } from './match-metadata'

export default {
  getNews: async () => getRSS('news'),
  getResults,
  getStatsByMatchId,
  getMatches,
  getResultsUntilMatchId,
  getResultsUntilDate,
  getMatchMetadata,
}
