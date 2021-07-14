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

  // Модальные окна
  function overlay(show) {
    if (show) {
      var top = $(window).scrollTop();
      var left = $(window).scrollLeft();
      $(window).scroll(function () {
        $(this).scrollTop(top).scrollLeft(left);
      });
    } else {
      $(window).unbind("scroll");
    }
  }

  function closeModals() {
    $(".modal").slideUp();
    $(".mask").fadeOut();
    overlay(false);
  }

  function openModal(modalId) {
    $(modalId).slideDown();
    $(".mask").fadeIn();
    overlay(true);
  }

  $(".mask").click(function (evt) {
    evt.preventDefault();

    closeModals();
  });

  $(".modal__close").click(function (evt) {
    evt.preventDefault();

    closeModals();
  });

  $(document).keydown((evt) => {
    if (evt.keyCode == 27) {
      closeModals();
    }
  });

  // Форма
  $("#pollForm").submit(function (evt) {
    evt.preventDefault();

    openModal($("#successfulRegistration"));
  });

  $("#pollSubmit").click(() => {
    $(".poll__item__input:invalid").css("border-color", "#ED1846");
    $(".poll__item__input:invalid ~ .poll__item__label").css(
      "color",
      "#ED1846"
    );

    $(".poll__item__input:valid").css("border-color", "#239FB3");
    $(".poll__item__input:valid ~ .poll__item__label").css("color", "#239FB3");
  });

  // Макса для телефона
  $("#phone").mask("+7 (999) 999 - 9999");

  // Бургер меню
  $("#nav__toggle").click(function (evt) {
    evt.preventDefault();

    $(this).toggleClass("active");

    $(".header__wrapper").toggleClass("header__wrapper--active");
    $("html").toggleClass("noscroll");

    if ($(this).hasClass("active")) {
      overlay(true);
    } else {
      overlay(false);
    }
  });

  // Навигация
  $(".nav__btn").click(() => {
    $("#nav__toggle").removeClass("active");
    $(".header__wrapper").removeClass("header__wrapper--active");
    $("html").removeClass("noscroll");
    overlay(false);
  });

  // Подробнее
  $(".routes__text__more").click(function (evt) {
    evt.preventDefault();

    $(this).hide();

    const routesTextList = $(this).parents(".routes__text__list");
    const hiddenRoutesText = routesTextList.find(".no-xs");
    hiddenRoutesText.removeClass("no-xs");
  });

  // Слайдер в расписании
  if ($(window).width() <= 767) {
    $("#scheduleSlider").not(".slick-initialized").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      centerMode: false,
      autoplay: false,
    });

    $("#scheduleSlider").on("afterChange", function () {
      $("#scheduleSlider .slick-current .schedule__btn").click();
    });
  }

  // Таблицы
  $(".schedule__table__header").click(function (evt) {
    evt.preventDefault();

    const scheduleTable = $(this).parents(".schedule__table");
    scheduleTable.toggleClass("schedule__table--active");
  });

  // Дата
  if ($("#date")[0].type != "date") $("#test").datepicker();
});
