function licorns_install_notice() {
    if (localStorage.getItem('respectzone_install_time'))
        return;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "https://api.respectzone.org/wp-content/plugins/api-licornsandhaters/words.json", true);
    xmlhttp.send(null);
    var request = xmlhttp;
    console.log("test");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            console.log("tutu");
            var response = JSON.parse(request.responseText);
            settings.localWords = response;
            settings.language = language;
            me.settings = settings;
            chrome.storage.local.set({'settings': settings}, function () {

            });
        }
    }
    console.log("test");
    var now = new Date().getTime();
    localStorage.setItem('respectzone_install_time', now);
    localStorage.setItem('rz_actif', true);
    chrome.tabs.create({url: "http://www.respectzone.org/"});
}
licorns_install_notice();
