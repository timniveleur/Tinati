$(document).on('click', '.js-filter-open-btn', function() {
  $(this).toggleClass('is-active');
  $(this).closest('.js-rewrites-filter').find('.js-filter-dropdown').slideToggle(250);
});


$(document).mouseup(function (e) { // событие клика по веб-документу
  var div = $('#rewrites-filter'); // тут указываем ID элемента
  if (!div.is(e.target) && div.has(e.target).length === 0) { // и не по его дочерним элементам
    $(div).find('.js-filter-open-btn').removeClass('is-active');
    $(div).find('.js-filter-dropdown').slideUp(250);
  }
});