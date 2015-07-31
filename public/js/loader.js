$(document).ajaxStart(showAjaxSpinner);
$(document).ajaxStop(hideAjaxSpinner);

function showAjaxSpinner() {
	$('#loader, #overlay').fadeIn();
}

function hideAjaxSpinner() {
	$('#loader, #overlay').fadeOut();
}

var a=document.getElementsByTagName("a");
for(var i=0;i<a.length;i++)
{
    a[i].onclick=function()
    {
        window.location=this.getAttribute("href");
        return false
    }
}
