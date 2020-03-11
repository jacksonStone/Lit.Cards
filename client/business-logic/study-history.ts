import { getStudyhistory } from '../routes/api/study-history'
interface NoneObj {
  none?: boolean,
}
async function fetchStudyHistory (): Promise<Array<string>> {
  let deckHistoryStr = await getStudyhistory()
  let deckHistory: NoneObj|Array<string>
  try {
    deckHistory = JSON.parse(deckHistoryStr)
  } catch (e) {
    return []
  }
  if ((<NoneObj>deckHistory).none) {
    return []
  }
  return <Array<string>>deckHistory
}

export {
  fetchStudyHistory
}
