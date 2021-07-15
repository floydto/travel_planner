$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
$('#fadeInOut').on('click', function () {
    $('.uploadCompleteOverlay').show().addClass('animated zoomIn');
    setTimeout(function () {
        $('.uploadCompleteOverlay').addClass('zoomOut');
    }, 2000);
    setTimeout(function () {
        $('.uploadCompleteOverlay').removeClass('animated zoomIn zoomOut').hide();
    }, 3000);
});