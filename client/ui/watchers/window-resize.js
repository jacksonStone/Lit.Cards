function listenForResizeEvent () {
  let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  window.lc.setData('screen.width', width, false);

  window.addEventListener('resize', () => {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if(window.lc.getData('screen.width') === width) {
      //vertical resize
      return;
    }
    window.lc.setData('screen.width', width);
  });
}
module.exports = listenForResizeEvent;
