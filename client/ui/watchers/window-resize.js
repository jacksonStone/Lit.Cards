function listenForResizeEvent () {
  window.lc.setData('screen.width', window.innerWidth, false);

  window.addEventListener('resize', () => {
    console.log('fired!');
    if(window.lc.getData('screen.width') === window.innerWidth) {
      //vertical resize
      return;
    }
    window.lc.setData('screen.width', window.innerWidth);
  });
}
module.exports = listenForResizeEvent;
