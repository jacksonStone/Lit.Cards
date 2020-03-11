import { hash } from 'abstract/url';
let lastSeenHash = hash()
export function listenForHashChange () {
  window.onhashchange = () => {
    let currentHash = hash()
    if(currentHash !== lastSeenHash) {
      //We just want a re-render to get queued up
      lastSeenHash = currentHash
      window.lc.setData()
    }
  }
}
export default listenForHashChange