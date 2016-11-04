function checkScriptLoad() {
  chrome.extension.onMessage.addListener(function(request, sender, response) {
    if (request.msg == 'is_page_capturable') {
      //try {
        if (isPageCapturable()) {
          response({msg: 'capturable'});
          return true;
        } else {
          response({msg: 'uncapturable'});
          return true;
        }
      //} catch(e) {
      //  response({msg: 'loading'});
      //  return true;
      //}
    }
    
  });
}

checkScriptLoad();
