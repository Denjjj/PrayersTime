/* jshint esnext: true */

// Short QuerySelector
export const $ = (inp) => {
    return document.querySelector(inp);
  },
  $_ = (inp) => {
    return document.querySelectorAll(inp);
  },
  empty = (inp) => {
    if (inp == undefined || inp == null || inp.replace(" ", "") == "") {
      return true;
    } else {
      return false;
    }
  },
  root = document.documentElement;
