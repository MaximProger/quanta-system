$(document).ready(function () {
  // Скролл
  $("[data-scroll]").on("click", function (evt) {
    evt.preventDefault();

    const $this = $(this),
      blockId = $this.data("scroll"),
      blockOffset = $(blockId).offset().top;

    $("html, body").animate(
      {
        scrollTop: blockOffset,
      },
      500
    );
  });

  // Табы
  $("[data-tab]").on("click", function (evt) {
    evt.preventDefault();

    const $this = $(this),
      contentId = $this.data("tab");

    $(".schedule__btn").removeClass("schedule__btn--active");
    $(this).addClass("schedule__btn--active");

    $(".schedule__content").removeClass("schedule__content--active");
    $(contentId).addClass("schedule__content--active");
  });

  // Маршруты
  $(".participate").click(function (evt) {
    evt.preventDefault();

    const routesItem = $(this).parents(".routes__item");
    const routesWrapperMap = routesItem.find(".routes__wrapper--map");

    routesWrapperMap.addClass("routes__wrapper--active");
  });

  $(".routes__close").click(function (evt) {
    evt.preventDefault();

    const routesWrapperMap = $(this).parents(".routes__wrapper--map");

    routesWrapperMap.removeClass("routes__wrapper--active");
  });

  // Селект
  $(".poll__select__header").click(function (evt) {
    const select = $(this).parents(".poll__select");
    select.toggleClass("poll__select--show");
  });

  $(".poll__select__item").click(function () {
    const thisText = $(this).text();
    $(".poll__select__value").text(thisText);

    const select = $(this).parents(".poll__select");
    select.removeClass("poll__select--show");
  });
});
