// Attempt to detect mobile
// Some tasks, like re-focusing inputs, do not make sense on mobile
var nua = navigator.userAgent;
var isMobile = nua.indexOf('Android ') > -1 || nua.indexOf('iPhone OS ') > -1;
