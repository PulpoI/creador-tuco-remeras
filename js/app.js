$(function () {
  console.log("STATIC Sanity Check");

  // DROPDOWN ACTIONS ================================
  let dropdownButtonEls = document.querySelectorAll(".dropdown-button");
  let dropdownEls = document.querySelectorAll(".dropdown");
  let dropdownOptionEls = document.querySelectorAll(".dropdown-option");
  let garment = document.querySelectorAll(".garment-swatch");

  garment.forEach(function (el) {
    el.addEventListener("click", function (e) {
      unselectSiblings(el);
      el.classList.add("is-selected");
      hideDropdown();
    });
  });

  // handles the open and closing of
  // drop down options
  dropdownButtonEls.forEach(function (el) {
    el.addEventListener("click", function (e) {
      let dropdownParent = el.parentNode;
      // since this event listener is nested inside
      // another element with an event listener, stopPropagation
      // will stop the parent event listener from automatically triggering
      e.stopPropagation();
      dropdownParent.classList.toggle("is-up");
    });
  });

  // dropdown option handling
  dropdownOptionEls.forEach(function (el) {
    el.addEventListener("click", function (e) {
      // traverse the DOM from
      // dropdownOption (LI) to current value (SPAN)
      let valTarget =
        el.parentNode.parentNode.parentNode.nextElementSibling
          .firstElementChild;
      // in the field next to the dropdown bar,
      // swaps old text content for new text content
      // from selected dropdown value
      valTarget.textContent = el.textContent;
      unselectSiblings(el);
      el.classList.add("is-selected");
      hideDropdown();
    });
  });

  // closes dropdown if clicked outside
  // of the dropdown component
  document.addEventListener("click", function (e) {
    hideDropdown();
  });

  // deselects highlighted color from other options
  function unselectSiblings(el) {
    let siblings = el.parentNode.children;
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].classList.remove("is-selected");
    }
  }

  // closes the dropdown option list
  function hideDropdown() {
    dropdownEls.forEach((el) => {
      el.classList.remove("is-up");
    });
  }
  // end of dropdown actions

  // IMAGE UPLOAD ===================================
  let currentArtFileName;
  let imageFile;
  let reader;
  let designDisplayEl = document.getElementById("design-display");
  let uploadButtonEl = document.getElementById("upload-button");
  // let imageInputEl = document.querySelector('input[type="file"]');
  let imageInputEl = document.getElementById("image-input");

  // activates the real image upload button
  // when the styledized button is clicked
  uploadButtonEl.addEventListener(
    "click",
    function () {
      imageInputEl.click();
    },
    false
  );
  // use file search to upload image
  imageInputEl.addEventListener(
    "change",
    function (e) {
      imageHandling(e);
    },
    false
  );
  // uses drag and drop to upload image
  document.body.addEventListener(
    "drop",
    function (e) {
      imageHandling(e);
    },
    false
  );
  function imageHandling(e) {
    imageFile = e.target.files[0];
    if (!imageFile.type.match("image.*")) {
      alert("This file is not a unsupported image file");
      return;
    }
    reader = new FileReader();
    reader.addEventListener(
      "load",
      (function () {
        return function (e) {
          // uploads images in target area
          designDisplayEl.setAttribute("src", e.target.result);
        };
      })(imageFile),
      false
    );
    reader.readAsDataURL(imageFile);
  }
  // end of image uploads

  let defaultThumbnailsEl = document.querySelectorAll(".default-image");

  defaultThumbnailsEl.forEach(function (el) {
    console.log(el);
    el.addEventListener("click", function (e) {
      let imgEl = el.firstElementChild;
      console.log(imgEl);
      let imgElAttr = imgEl.getAttribute("src");
      console.log(imgElAttr);
      // console.log(imgElAttr);
      // console.log(defaultThumbnailEl.firstElementChild);
      // e.stopPropagation();
      designDisplayEl.setAttribute("src", imgElAttr);
    });
  });

  if ($(window).innerWidth() <= 751) {
    $(".default-image").on("click", function () {
      $(
        "#garment-control, #image-control, #text-control, #default-control"
      ).slideUp();
    });
  }

  // DRAGGABLE IMAGE =====================
  $("#design-display").draggable({
    containment: "#design-target",
    scroll: false,
  });
  $("#text-display").draggable({ containment: "#design-target", scroll: true });
  // end of draggable images

  // RESIZE IMAGE BUTTON CONTROLS =====================
  const changeSize = 6;
  const changeImgPos = 3;
  const changeTextPos = 6;
  // let imagePositionX = $('#design-display').position().left;
  // let imagePositionY = $('#design-display').position().top;

  $("#width-plus").on("click", function () {
    let curWidth = $("#design-display").width();
    curWidth += changeSize;
    $("#design-display").width(`${curWidth}px`);

    let imagePositionX = $("#design-display").position().left;
    imagePositionX -= changeImgPos;
    $("#design-display").css({ left: imagePositionX });
    calcArtDimensions();
  });
  $("#width-minus").on("click", function () {
    let curWidth = $("#design-display").width();
    curWidth -= changeSize;
    $("#design-display").width(`${curWidth}px`);

    let imagePositionX = $("#design-display").position().left;
    imagePositionX += changeImgPos;
    $("#design-display").css({ left: imagePositionX });
    calcArtDimensions();
  });
  // end of resizeable buttons controls for image

  // IMAGE WIDTH AND HEIGHT CALCULATOR
  // Pertinent info on design data
  // console.log('NEW');
  // console.log('ART FILE: ' + currentArtFileName);
  // console.log('WIDTH: ' + $('#design-display').width());
  // console.log('ART POS TOP: ' + $('#design-display').position().top);
  // console.log('ART POS LEFT: ' + $('#design-display').position().left);
  calcArtDimensions();

  // output the dimensions of the art size
  function calcArtDimensions() {
    const rulerConverter = 7; // esto tenia 16 por defecto
    let curWidth = $("#design-display").width();
    let curHeight = $("#design-display").height();
    let widthInInches = curWidth / rulerConverter;
    let heightInInches = curHeight / rulerConverter;
    widthInInches = widthInInches.toFixed(2);
    $(".current-width").text(`${widthInInches}cm`);
    heightInInches = heightInInches.toFixed(2);
    $(".current-height").text(`${heightInInches}cm`);
  }

  // adding custom text
  $("#custom-text").keyup(function () {
    let currentText = $("#custom-text").val();
    console.log(currentText);
    $("#text-display").text(currentText);
  });

  // adding custom font
  $(".font-option").click(function () {
    let currentFont = $("#font-value").text();
    $("#text-display").css({ "font-family": currentFont });
  });

  // using color picker to update text color
  $("#color-choice").on("change", function () {
    let curHexColor = $(this).val();
    console.log(curHexColor);
    $("#text-display").css({ color: curHexColor });
    $("#text-color-value").text(curHexColor);
  });

  // RESIZE TEXT BUTTON CONTROLS =====================

  function increaseTextSize() {
    let curfontSize = $("#text-display").css("font-size");
    let removePxLength = curfontSize.length - 2;
    curfontSize = curfontSize.slice(0, removePxLength);
    curfontSize = parseInt(curfontSize);
    curfontSize += changeSize;
    $("#text-display").css({ "font-size": `${curfontSize}px` });
    let textPositionX = $("#text-display").position().left;
    textPositionX -= changeTextPos;
    $("#text-display").css({ left: textPositionX });
  }

  function decreaseTextSize() {
    let curfontSize = $("#text-display").css("font-size");
    let removePxLength = curfontSize.length - 2;
    curfontSize = curfontSize.slice(0, removePxLength);
    curfontSize = parseInt(curfontSize);
    curfontSize -= changeSize;
    $("#text-display").css({ "font-size": `${curfontSize}px` });
    let textPositionX = $("#text-display").position().left;
    textPositionX += changeTextPos;
    $("#text-display").css({ left: textPositionX });
  }

  $("#text-plus").on("click", function () {
    increaseTextSize();
  });

  $("#text-minus").on("click", function () {
    decreaseTextSize();
  });
  // end of resizeable buttons controls for images

  // Mobile Controls
  $("#mb-left").on("click", function () {
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      let imagePositionX = $("#design-display").position().left;
      imagePositionX -= changeImgPos;
      $("#design-display").css({ left: imagePositionX });
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      let textPositionX = $("#text-display").position().left;
      textPositionX -= changeTextPos;
      $("#text-display").css({ left: textPositionX });
    }
  });
  $("#mb-right").on("click", function () {
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      let imagePositionX = $("#design-display").position().left;
      imagePositionX += changeImgPos;
      $("#design-display").css({ left: imagePositionX });
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      let textPositionX = $("#text-display").position().left;
      textPositionX += changeTextPos;
      $("#text-display").css({ left: textPositionX });
    }
  });
  $("#mb-up").on("click", function () {
    let imagePositionY = $("#design-display").position().top;
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      imagePositionY -= changeImgPos;
      $("#design-display").css({ top: imagePositionY });
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      let textPositionY = $("#text-display").position().top;
      textPositionY -= changeTextPos;
      $("#text-display").css({ top: textPositionY });
    }
  });
  $("#mb-down").on("click", function () {
    let imagePositionY = $("#design-display").position().top;
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      imagePositionY += changeImgPos;
      $("#design-display").css({ top: imagePositionY });
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      let textPositionY = $("#text-display").position().top;
      textPositionY += changeTextPos;
      $("#text-display").css({ top: textPositionY });
    }
  });

  $("#mb-plus").on("click", function () {
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      let curWidth = $("#design-display").width();
      curWidth += changeSize;
      $("#design-display").width(`${curWidth}px`);
      let imagePositionX = $("#design-display").position().left;
      imagePositionX -= changeImgPos;
      $("#design-display").css({ left: imagePositionX });
      calcArtDimensions();
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      increaseTextSize();
    }
  });
  $("#mb-minus").on("click", function () {
    if (
      $(".mobile-icon .fa-file-image").hasClass("active-image") ||
      $(".mobile-icon .fa-question").hasClass("active-image")
    ) {
      let curWidth = $("#design-display").width();
      curWidth -= changeSize;
      $("#design-display").width(`${curWidth}px`);
      let imagePositionX = $("#design-display").position().left;
      imagePositionX += changeImgPos;
      $("#design-display").css({ left: imagePositionX });
      calcArtDimensions();
    } else if ($(".mobile-icon .fa-font").hasClass("active-image")) {
      decreaseTextSize();
    }
  });

  $("#mb-garment").on("click", function () {
    $("#garment-control").slideToggle();
    $("#image-control, #text-control, #default-control").slideUp();
    $(".fa-tshirt").addClass("active-image");
    $(".fa-file-image, .fa-font, .fa-question").removeClass("active-image");
    // $(".mobile-position").removeClass("show-position");
  });
  $("#mb-image").on("click", function () {
    $("#image-control").slideToggle();
    $("#garment-control, #text-control, #default-control").slideUp();
    $(".fa-file-image").addClass("active-image");
    $(".fa-tshirt, .fa-font, .fa-question").removeClass("active-image");
    $(".mobile-position").addClass("show-position");
  });
  $("#mb-text").on("click", function () {
    $("#text-control").slideToggle();
    $("#garment-control, #image-control, #default-control").slideUp();
    $(".fa-font").addClass("active-image");
    $(".fa-tshirt, .fa-file-image, .fa-question").removeClass("active-image");
    $(".mobile-position").addClass("show-position");
  });
  $("#mb-default").on("click", function () {
    $("#default-control").slideToggle();
    $("#garment-control, #image-control, #text-control").slideUp();
    $(".fa-question").addClass("active-image");
    $(".fa-tshirt, .fa-file-image, .fa-font").removeClass("active-image");
    $(".mobile-position").addClass("show-position");
  });

  $(".mobile-close").on("click", function () {
    $(
      "#garment-control, #image-control, #text-control, #default-control"
    ).slideUp();
  });
}); // end of document.ready

//-------  MI CODIGO ---------
// SCREEN PANTALLA
//Definimos el botón para escuchar su click, y también el contenedor del canvas
const $boton = document.querySelector("#btnCapturar"), // El botón que desencadena
  $botonDescargar = document.querySelector("#btnDescargar"),
  $objetivo = document.querySelector(".shirt-container"), // A qué le tomamos la foto
  $canvas = document.querySelector("#canvas"), // En dónde ponemos el elemento canvas
  $tee = document.querySelector(".tee");

// Agregar el listener al botón
$("#canvas").hide();
$boton.addEventListener("click", () => {
  const opciones = {
    canvas: $canvas,
  };
  html2canvas($objetivo, opciones) // Llamar a html2canvas y pasarle el elemento
    .then((canvas) => {
      // Cuando se resuelva la promesa traerá el canvas
    });
  setTimeout(() => {
    $("#canvas").show();
    $("#tee").height("auto");
    if ($(window).width() < 767) {
      $("#tee").height("100%");
    }
    $(window).scrollTop(0);
    $("#design-display").attr("src", null);
    $("#text-display").empty();
    $("#custom-text").val("");
    $tee.style.display = "none";
  }, 0010);
});

// Reiniciar
const btnReiniciar = document.querySelector("#btnReiniciar");

const reiniciar = () => {
  $("#canvas").hide();
  // $("#tee").height("600px");
  // if ($(window).width() < 767) {
  //   $("#tee").height("440px");
  // }
  // $(window).scrollTop(0);
  $("#design-display").attr("src", null);
  $("#text-display").empty();
  $("#custom-text").val("");
  $tee.style.display = "flex";
};
btnReiniciar.addEventListener("click", reiniciar);

// Descargar diseño generado

// Agregar el listener al botón
$botonDescargar.addEventListener("click", () => {
  html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
    .then((canvas) => {
      // Cuando se resuelva la promesa traerá el canvas
      // Crear un elemento <a>
      let enlace = document.createElement("a");
      enlace.download = "Mi diseño.png";
      // Convertir la imagen a Base64
      enlace.href = canvas.toDataURL();
      // Hacer click en él
      enlace.click();
    });
});

// Cambiar src de producto
const hoodieBlack = document.querySelector("#Womens-tee");
const simpleBlack = document.querySelector("#Simple");
const shirtBlack = document.querySelector("#Mens-tee");
const front = document.querySelector("#Front");
const back = document.querySelector("#Back");

const style = document.querySelector("#style-value");
const placement = document.querySelector("#placement-value");
const current = document.querySelector("#current-value");

// Funcion CAMBIAR PRENDA
const funcionCambiarPrenda = function (s, p, c, s2) {
  reiniciar();
  if (
    style.innerText == s &&
    placement.innerText == p &&
    current.innerText == c
  ) {
    $(".tee").attr("src", `../../images/${s2}-${p}-${c}.png`);
  }
};

const cambiarPrenda = function (p) {
  p.addEventListener("click", () =>
    funcionCambiarPrenda(
      style.innerText,
      placement.innerText,
      current.innerText,
      p.innerText
    )
  );
};
cambiarPrenda(hoodieBlack);
cambiarPrenda(shirtBlack);
cambiarPrenda(simpleBlack);

// Funcion CAMBIAR POSICION
const funcionCambiarPosicion = function (s, p, c, s2) {
  reiniciar();
  if (
    style.innerText == s &&
    placement.innerText == p &&
    current.innerText == c
  ) {
    $(".tee").attr("src", `../../images/${s}-${s2}-${c}.png`);
  }
};

const cambiarPosicion = function (p) {
  p.addEventListener("click", () =>
    funcionCambiarPosicion(
      style.innerText,
      placement.innerText,
      current.innerText,
      p.innerText
    )
  );
};
// Eventos funcionCambiarPosicion
cambiarPosicion(front);
cambiarPosicion(back);

const white = document.querySelector(".white");
const black = document.querySelector(".black");
const gray = document.querySelector(".gray");
const FuncionCambiarColor = function (s, p, c, c2) {
  reiniciar();
  if (
    style.innerText == s &&
    placement.innerText == p &&
    current.innerText == c
  ) {
    $(".tee").attr("src", `../../images/${s}-${p}-${c2}.png`);
    current.innerText = c2;
  }
};

const cambiarColor = function (p) {
  p.addEventListener("click", () =>
    FuncionCambiarColor(
      style.innerText,
      placement.innerText,
      current.innerText,
      p.innerText
    )
  );
};
cambiarColor(black);
cambiarColor(white);
cambiarColor(gray);

// NAV ACTIONS ================================
$(".flex-nav ul li a").on("click", function () {
  $(".flex-nav ul li a").removeClass("nav-active");
  $(this).addClass("nav-active");
});
