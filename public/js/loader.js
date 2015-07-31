$(document).ajaxStart(showAjaxSpinner);
$(document).ajaxStop(hideAjaxSpinner);

function showAjaxSpinner() {
	$('#loader, #overlay').fadeIn();
}

function hideAjaxSpinner() {
	$('#loader, #overlay').fadeOut();
}