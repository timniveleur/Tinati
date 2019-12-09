/**
 * begin Popups
 */



var popups = document.getElementsByClassName('js-popup');
var popupsElements = Array.prototype.slice.call(popups);
popupsElements.forEach(function(popup) {
  popup.classList.add('is-init');
  popup.onmousedown = function (event) {
    if (popup === event.target) {
      togglePopup();
    }
  };
});


function initBtnsPopup() {
  var popupBtns = document.getElementsByClassName('js-open-popup');
  var popupBtnsElements = Array.prototype.slice.call(popupBtns);
  popupBtnsElements.forEach(function(btn) {
    btn.onclick = function () {
      var popupId = this.getAttribute('data-popup');
      if (popupId) {
        togglePopup(popupId);
      }
    };
  });
};

initBtnsPopup();


var popupCloseBtns = document.getElementsByClassName('js-close-popup');
var popupCloseBtnsElements = Array.prototype.slice.call(popupCloseBtns);
popupCloseBtnsElements.forEach(function(btn) {
  btn.onclick = function (e) {
    var id = this.closest('.js-popup').getAttribute('id');
    togglePopup(id);
  };
});


function togglePopup(id) {
  if (id) {
    var popup = document.getElementById(id);
    if (popup.classList.contains('is-visible')) {
      popup.classList.remove('is-visible');
    } else {
      popup.classList.add('is-visible');
    }
  } else {
    var popups = document.getElementsByClassName('popup');
    var popupsElements = Array.prototype.slice.call(popups);
    popupsElements.forEach(function(popup) {
      popup.classList.remove('is-visible');
    });
  }
}

/**
 * end Popups
 */
