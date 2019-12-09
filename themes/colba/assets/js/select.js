$(document).on('click', '.js-select-btn', function() {
  $(this).closest('.js-select').toggleClass('is-focused');
  $(this).closest('.js-select').find('.js-select-dropdown').slideToggle(250);
});

$(document).on('click', '.js-select-item', function() {
  $(this).closest('.js-select').find('.js-select-item').removeClass('is-active');
  $(this).closest('.js-select').find('.js-select-value').text($(this).text());
  $(this).addClass('is-active');
  $(this).closest('.js-select').removeClass('is-focused');
  $(this).closest('.js-select').find('.js-select-dropdown').slideUp(250);
});
