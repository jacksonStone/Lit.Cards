declare const URL_ROOT: string;
declare const electron: any;
import { request } from '../../browser-abstractions/request';

async function api (url: string, body?: Object, options = {}): Promise<string> {

  if(electron) {
    const eResponse = await electron.ipcRenderer.invoke('api', {
      url,
      body: body || {},
    });
    console.log(`
    Response:
    Path: ${url}, 
    Body: ${JSON.stringify(body || {})}
    Response: ${eResponse}`);
    return eResponse;
  }

  if(!body) {
    while(true) {
      try {
        const result = await request((URL_ROOT || '') + '/api/' + url, body, options)
        return result;
      } catch(e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return request( (URL_ROOT || '')  +'/api/' + url, body, options)
}

export { api };
