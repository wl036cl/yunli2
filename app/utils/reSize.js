/**
 * Author:ll36
 * Create Time:2018/03/22 18:57
 * Descripttion:
 */
function reSize() {
  
}
export default ()=>{
  var isResize = false;
  if (setTime)
  {
    clearTimeout(setTime);
    setTime = null;
  }
  else {
    var body_width_change = document.body.clientWidth;
    body_width_change = body_width_change > 640 ? 640 : body_width_change;
    if (body_width != body_width_change) {
      body_width = body_width_change;
      _html.style.fontSize = Math.round((body_width / 320 / 16 * 1000) * 100) / 100 + "%";
    }
    isResize = true;
  }
  setTime = setTimeout(function () {
    setTime = null;
    if (!isResize)
      reSize();
  }, 200);
}