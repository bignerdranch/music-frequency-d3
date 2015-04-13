$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  // frequencyBinCount tells you how many values you'll receive from the analyser
  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(600);

  var svgHeight = '300';
  var svgWidth = '1200';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll("rect")
     .data(frequencyData)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr("width", svgWidth / frequencyData.length - barPadding);

  // Loop
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData
     svg.selectAll("rect")
        .data(frequencyData)
        .attr("y", function(d) {
           return svgHeight - d;
        })
        .attr("height", function(d) {
           return d;
        })
        .attr("fill", function(d) {
           return "rgb(0, 0, " + d + ")";
        });
  }

  renderFrame();

});
