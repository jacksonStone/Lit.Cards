import { renderPage, ping } from '../ui/globals'
import content from '../ui/page-content/settings'
import { defaultDarkMode } from 'abstract/darkmode'
import { fetchUser } from 'logic/user'
ping()

renderPage(content)
;(async () => {
  defaultDarkMode()
  let user = await fetchUser()
  window.lc.setData('user', user)
})()
