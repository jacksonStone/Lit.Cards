import { renderPage } from '../ui/globals';
import content from '../ui/page-content/settings';
import { defaultDarkMode } from 'abstract/darkmode';
import { fetchUser } from 'logic/user';

renderPage(content)
;(async () => {
  defaultDarkMode()
  let [user] = await Promise.all([fetchUser()])
  window.lc.setData('user', user)
})()
