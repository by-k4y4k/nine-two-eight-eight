"use strict";function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function u(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e){if(a[e])return a[e].exports;var t=a[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}var n,a;a={},r.m=n=[function(e,t,n){n.r(t);var i=function(){function l(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:l.DEFAULT_CANVAS_SIZE;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),this.$video=e,this.$canvas=document.createElement("canvas"),this._onDecode=t,this._paused=this._active=!1,this.$canvas.width=n,this.$canvas.height=n,this._sourceRect={x:0,y:0,width:n,height:n},this._onCanPlay=this._onCanPlay.bind(this),this._onPlay=this._onPlay.bind(this),this._onVisibilityChange=this._onVisibilityChange.bind(this),this.$video.addEventListener("canplay",this._onCanPlay),this.$video.addEventListener("play",this._onPlay),document.addEventListener("visibilitychange",this._onVisibilityChange),this._qrWorker=new Worker(l.WORKER_PATH)}return u(l,null,[{key:"hasCamera",value:function(){return navigator.mediaDevices.enumerateDevices().then(function(e){return e.some(function(e){return"videoinput"===e.kind})}).catch(function(){return!1})}}]),u(l,[{key:"destroy",value:function(){this.$video.removeEventListener("canplay",this._onCanPlay),this.$video.removeEventListener("play",this._onPlay),document.removeEventListener("visibilitychange",this._onVisibilityChange),this.stop(),this._qrWorker.postMessage({type:"close"})}},{key:"start",value:function(){var t=this;if(this._active&&!this._paused)return Promise.resolve();if("https:"!==window.location.protocol&&console.warn("The camera stream is only accessible if the page is transferred via https."),this._active=!0,this._paused=!1,document.hidden)return Promise.resolve();if(clearTimeout(this._offTimeout),this._offTimeout=null,this.$video.srcObject)return this.$video.play(),Promise.resolve();var n="environment";return this._getCameraStream("environment",!0).catch(function(){return n="user",t._getCameraStream()}).then(function(e){t.$video.srcObject=e,t._setVideoMirror(n)}).catch(function(e){throw t._active=!1,e})}},{key:"stop",value:function(){this.pause(),this._active=!1}},{key:"pause",value:function(){var t=this;this._paused=!0,this._active&&(this.$video.pause(),this._offTimeout||(this._offTimeout=setTimeout(function(){var e=t.$video.srcObject&&t.$video.srcObject.getTracks()[0];e&&(e.stop(),t._offTimeout=t.$video.srcObject=null)},300)))}},{key:"setGrayscaleWeights",value:function(e,t,n){var i=!(3<arguments.length&&void 0!==arguments[3])||arguments[3];this._qrWorker.postMessage({type:"grayscaleWeights",data:{red:e,green:t,blue:n,useIntegerApproximation:i}})}},{key:"setInversionMode",value:function(e){this._qrWorker.postMessage({type:"inversionMode",data:e})}},{key:"_onCanPlay",value:function(){this._updateSourceRect(),this.$video.play()}},{key:"_onPlay",value:function(){this._updateSourceRect(),this._scanFrame()}},{key:"_onVisibilityChange",value:function(){document.hidden?this.pause():this._active&&this.start()}},{key:"_updateSourceRect",value:function(){var e=Math.round(2/3*Math.min(this.$video.videoWidth,this.$video.videoHeight));this._sourceRect.width=this._sourceRect.height=e,this._sourceRect.x=(this.$video.videoWidth-e)/2,this._sourceRect.y=(this.$video.videoHeight-e)/2}},{key:"_scanFrame",value:function(){var t=this;if(!this._active||this.$video.paused||this.$video.ended)return!1;requestAnimationFrame(function(){l.scanImage(t.$video,t._sourceRect,t._qrWorker,t.$canvas,!0).then(t._onDecode,function(e){t._active&&"QR code not found."!==e&&console.error(e)}).then(function(){return t._scanFrame()})})}},{key:"_getCameraStream",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]&&arguments[1],n=[{width:{min:1024}},{width:{min:768}},{}];return t&&(e&&(t={exact:t}),n.forEach(function(e){return e.facingMode=t})),this._getMatchingCameraStream(n)}},{key:"_getMatchingCameraStream",value:function(e){var t=this;return 0===e.length?Promise.reject("Camera not found."):navigator.mediaDevices.getUserMedia({video:e.shift()}).catch(function(){return t._getMatchingCameraStream(e)})}},{key:"_setVideoMirror",value:function(e){this.$video.style.transform="scaleX("+("user"===e?-1:1)+")"}}],[{key:"scanImage",value:function(e){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,s=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,c=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null,u=4<arguments.length&&void 0!==arguments[4]&&arguments[4],t=5<arguments.length&&void 0!==arguments[5]&&arguments[5],h=!1,n=new Promise(function(t,n){var i,o,r;s||(s=new Worker(l.WORKER_PATH),h=!0,s.postMessage({type:"inversionMode",data:"both"})),o=function(e){"qrResult"===e.data.type&&(s.removeEventListener("message",o),s.removeEventListener("error",r),clearTimeout(i),null!==e.data.data?t(e.data.data):n("QR code not found."))},r=function(e){s.removeEventListener("message",o),s.removeEventListener("error",r),clearTimeout(i),n("Scanner error: "+(e?e.message||e:"Unknown Error"))},s.addEventListener("message",o),s.addEventListener("error",r),i=setTimeout(function(){return r("timeout")},3e3),l._loadImage(e).then(function(e){e=l._getImageData(e,a,c,u),s.postMessage({type:"decode",data:e},[e.data.buffer])}).catch(r)});return a&&t&&(n=n.catch(function(){return l.scanImage(e,null,s,c,u)})),n.finally(function(){h&&s.postMessage({type:"close"})})}},{key:"_getImageData",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,i=3<arguments.length&&void 0!==arguments[3]&&arguments[3];n=n||document.createElement("canvas");var o=t&&t.x?t.x:0,r=t&&t.y?t.y:0,a=t&&t.width?t.width:e.width||e.videoWidth;return t=t&&t.height?t.height:e.height||e.videoHeight,i||n.width===a&&n.height===t||(n.width=a,n.height=t),(i=n.getContext("2d",{alpha:!1})).imageSmoothingEnabled=!1,i.drawImage(e,o,r,a,t,0,0,n.width,n.height),i.getImageData(0,0,n.width,n.height)}},{key:"_loadImage",value:function(e){if(e instanceof HTMLCanvasElement||e instanceof HTMLVideoElement||window.ImageBitmap&&e instanceof window.ImageBitmap||window.OffscreenCanvas&&e instanceof window.OffscreenCanvas)return Promise.resolve(e);if(e instanceof Image)return l._awaitImageLoad(e).then(function(){return e});if(e instanceof File||e instanceof URL||"string"==typeof e){var t=new Image;return t.src=e instanceof File?URL.createObjectURL(e):e,l._awaitImageLoad(t).then(function(){return e instanceof File&&URL.revokeObjectURL(t.src),t})}return Promise.reject("Unsupported image type.")}},{key:"_awaitImageLoad",value:function(o){return new Promise(function(e,t){var n,i;o.complete&&0!==o.naturalWidth?e():(n=function(){o.removeEventListener("load",n),o.removeEventListener("error",i),e()},i=function(){o.removeEventListener("load",n),o.removeEventListener("error",i),t("Image load error")},o.addEventListener("load",n),o.addEventListener("error",i))})}}]),l}();i.DEFAULT_CANVAS_SIZE=400,i.WORKER_PATH="qr-scanner-worker.min.js";var o=i;o.WORKER_PATH="../../js/qr-scanner-worker.min.js";var r=document.getElementById("qr-video"),a=document.getElementById("cam-has-camera"),s=document.getElementById("cam-qr-result");o.hasCamera().then(function(e){return a.textContent=e}),new o(r,function(e){return console.log("new scanner"),console.log(e),n=e,(t=s).textContent=n,clearTimeout(t.highlightTimeout),t.highlightTimeout=setTimeout(function(){return t.style.color="inherit"},100),console.log("set result is firing"),console.log("result is ".concat(n)),console.log("https://nine-two-eight-eight.herokuapp.com/".concat(n)),void c("https://nine-two-eight-eight.herokuapp.com/".concat(n));var t,n}).start(),console.log("new scanner");var c=function(e){!0===/https?/gi.test(e)?window.location(e):alert("Redir failed")}}],r.c=a,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==o(t)&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0);