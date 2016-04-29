$(document).ready(function() {
    $('#tplSwitch').on('change', function() {
        var val = $('#tplSwitch').val();
        var urlPart = window.location.href.replace('#','');
        if (urlPart.indexOf('?') > -1) {
            urlPart = urlPart.substring(0, urlPart.indexOf('?'));
        }
        urlPart += "?tpl=" + val;
        window.location.href = urlPart;
    });
});