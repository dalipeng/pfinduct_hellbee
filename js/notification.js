// Copyright (c) 2009 The Chromium Authors. All rights reserved.  Use of this
// source code is governed by a BSD-style license that can be found in the
// LICENSE file.

function init() {
  var bg = chrome.extension.getBackgroundPage();
  var tipDiv = document.getElementById('tip');
  var captureStatus = bg.screenshot.captureStatus;
  if (captureStatus) {
    tipDiv.innerText = chrome.i18n.getMessage('save_success');
    var aElement = document.createElement('a');
    aElement.innerText = "查看截图";
    var path = bg.screenshot.path;
    var pfinducturl = bg.pfinduct.getStorageValue("user","pfinducturl");
    var url = pfinducturl+"/../file/"+path;
    aElement.href = 'javascript:void(0)';
    aElement.addEventListener('click', function() {
    	window.open(url);
    }, false);
    tipDiv.appendChild(aElement);
  } else {
    tipDiv.innerText = chrome.i18n.getMessage('save_fail');
  }
  closeWindow();
}

function closeWindow() {
  window.setTimeout(function() {
    window.close();
  }, 10000);
}

document.addEventListener('DOMContentLoaded', init);
