$('.sliders').slider({
  formatter: function (value) {
    return 'Current value: ' + value.toString();
  }
});