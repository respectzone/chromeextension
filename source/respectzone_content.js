var settings;

if (!document.getElementById('myCss')) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = 'myCss';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://api.respectzone.org/wp-content/plugins/api-licornsandhaters/custom.css';
    link.media = 'all';
    head.appendChild(link);
}


Array.prototype.in_array = function(p_val) {
    for(var i = 0, l = this.length; i < l; i++) {
        if(this[i] == p_val) {
            return true;
        }
    }
    return false;
}

String.prototype.getAllIndices = function( subStr ) {
    var ind = [], rxp = new RegExp( '\\b'+subStr+'\\b', "ig" ), match;
    while( ( match = rxp.exec( this ) ) )
        ind.push( match.index );
    return ind.length ? ind : null;
}

if (typeof Array.prototype.reIndexOf === 'undefined') {
    Array.prototype.reIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}

var actif=false;
function respectzone_process() {
        chrome.storage.local.get('settings', function(response) {
            settings = response.settings;
            console.log(settings);
            respectzone_bouclier();
        });
}
function respectzone_bouclier() {
    console.log(settings);
    var dAujourdhui = new Date();
    var datelicornsandhaters = localStorage.getItem('datelicornsandhaters');

    /*
    var insulte = localStorage.getItem('listeinsultes');
    var insulte = "merde,salope,salop,salopes,salops,saloppe,bougnoul,bounioul,bougnoulle,bougnoule,pd,";
    insulte += "gouine,gouines,goudou,gouinasse,gouinasses,youpin,juiverie,juiveries,négro,bamboula,emburqinée,emburquiné,";
    insulte += "emburquinées,emburquinés,bicot,bico,bicots,crouille,crouilles,raton,youpin,youpins,tafiole,taffiole,tafioles,";
    insulte += "taffioles,tantouse,tantouze,tantouses,tarlouses,tarlouse,tarlouze,pute,putasse,pupute,puputes,putes,pétasse,petasse,";
    insulte += "petasses,pétasses,tasspé,tasspe,connasse,conasse,connasses,conasses,pouffiasse,pouffiasses,pouffiace,pouff,pouffiasse,";
    insulte += "pouf,pouffe,hollandouille,sodomie,sodomiser,sodomi,sodomies,sodomis,encule,encul,enculer,enculez,enculé,enculés,encules,";
    insulte += "godmiché,godmich,godmicher,sarkonard,sarkonnard,nabot,naboleon,naboléon,bouffonne,boufone,bouffone,bouffonnes,bouffon,boufon,";
    insulte += "boufons,bouffons,couille,couilles,fuck,connar,connard,conard,connards,conards,catin,katin,catins,katins,suceuse,suçeuse,suceuses,";
    insulte += "conne,connes,garce,garces,chiasse,chieur,con,chieurs,chieuses,chieuse,ducon,duconne,saloperie,bâtard,bâtards,bâtarde,bâtardes,batard,";
    insulte += "batarde,batards,batardes,couillon,sarkonnasse,sarkonasse,branleur,branleurs,lopette,lopettes,lopetes,lopete,pédé,pédés,";
    insulte += "pédérastes,pédéraste,radasse,salopard,salopart,salopar,gueunon,guenon,vaseline,fion,fions,connerie,conerie,conneries,";
    insulte += "coneries,mongolien,mongolienne,gogolène,bouffon,bouffons,trouduc,ftg,fdp,vermine,vermines,ordure,pourritures,pouritures,";
    insulte += "gerber,enfoirer,enfoiré,enfoirés,merdasse,merdasses,merdouilles,raclure,raclures,walzz,valzz,emmerde,emmerdé,";
    insulte += "emmerder,Flamby,foutre,merdeu,merdeuse,merdeuses,merdeux,negresse,négresse,salaud,salauds,FTG,TG,fuck,fukk,labouse,labouze,";
    insulte += "tdq,battard,vache,battards,tarlouze,tarlouzes,connace,adblock,addblock,musulmerde,juiffon,connars,cul,nazisioniste,soldes,";
    var tabinsultes = insulte.split(",");
    */

    var tabinsultes = settings.localWords[settings.language];

    tabinsultes.sort();
    tabinsultes.reverse();
    var insultes_liste = "";
    para = document.body.innerHTML;
    for (var i = 0; i < tabinsultes.length - 1; i++) {
        var str = tabinsultes[i];
        console.log(tabinsultes[i]);
        var searchstr = str.toUpperCase();
        var chaine = para.toUpperCase();
        var position1 = chaine.indexOf(searchstr);
        console.log(searchstr+"-->"+position1);
        if (position1 > 0) {
            insultes_liste = insultes_liste + tabinsultes[i] + ",";
        }
    }
    insulte = insultes_liste;
    console.log(insulte);
    if (insulte != "") {
        var tabinsultes = insulte.split(",");

        for (var i = 0; i < tabinsultes.length - 1; i++) {
            console.log(tabinsultes[i]);
            respectzone_highlightSearchTerms(tabinsultes[i]);
        }
    }

    /*
     window.addEventListener("load", function () {
     chrome.extension.sendMessage({
     type: "insulte-loaded",
     data: {
     myProperty: counter
     }
     });
     }, true);
     */
    //console.log("fin");
}
function respectzone_getVoyels(str) {
    var voyelsCount = 0;
    //turn the input into a string
    var string = str.toString();
    //loop through the string
    for (var i = 0; i <= string.length - 1; i++) {
        //if a vowel, add to vowel count
        if (string.charAt(i) == "A" || string.charAt(i) == "E" || string.charAt(i) == "I" || string.charAt(i) == "O" || string.charAt(i) == "U") {
            voyelsCount += 1;
        }
    }
    return voyelsCount;
}
function respectzone_shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function respectzone_getLicorns(str) {
    var nb = respectzone_getVoyels(str);
    var arr = new Array();
    arr.push(1);
    //console.log(str+"--"+nb);
    for (var j = 0; j < nb; j++) {
        var chiffre = Math.floor((Math.random() * 10) + 2);
        //console.log(chiffre);
        arr.push(chiffre);
    }
    //var arr = [1, 11, 37, 42];
    //console.log("-----------------------------");
    arr = respectzone_shuffle(arr);
    var string = "<span class=respect>";
    for (var i = 0; i < arr.length; i++) {
        string += "<img src='https://api.respectzone.org/images/" + arr[i] + ".gif' >";
    }
    string += "</span>";
    return string;
}
function respectzone_doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag) {

    // find all occurences of the search term in the given text,
    // and add some "highlight" tags to them (we're not using a
    // regular expression search, because we want to filter out
    // matches that occur within HTML tags and script blocks, so
    // we have to do a little extra validation)
    var newText = "";
    var i = -1;
    var lcSearchTerm = searchTerm.toLowerCase();
    var lcBodyText = bodyText.toLowerCase();
    while (bodyText.length > 0) {
        i = lcBodyText.indexOf(lcSearchTerm, i + 1);
        //highlightStartTag = respectzone_getLicorns(searchTerm) + "<font style='color:blue; background-color:pink;'>";
        //highlightEndTag = "</font>";
        highlightStartTag = respectzone_getLicorns(searchTerm) + "";
        highlightEndTag = "";
        if (i < 0) {
            newText += bodyText;
            bodyText = "";
        } else {
            //counter++;
            //skip anything inside an HTML tag
            //console.log("apres"+bodyText.substr(i+searchTerm.length,1));
            var caractere = bodyText.substr(i+searchTerm.length,1);
            var v_array = [ 'A', 'B', 'C', 'D', 'E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a', 'b', 'c', 'd', 'e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            var reponse = v_array.in_array(caractere);  // true
            if (!reponse){
                if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
                    // skip anything inside a <script> block
                    if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
                        //newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
                        newText += bodyText.substring(0, i) + highlightStartTag + highlightEndTag;
                        bodyText = bodyText.substr(i + searchTerm.length);
                        lcBodyText = bodyText.toLowerCase();
                        i = -1;
                    }
                }
            }
        }
    }
    return newText;
}



function respectzone_highlightSearchTerms(searchText, treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag) {
    if (treatAsPhrase) {
        searchArray = [searchText];
    } else {
        searchArray = searchText.split(" ");
    }

    if (!document.body || typeof(document.body.innerHTML) == "undefined") {
        if (warnOnFailure) {
            alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
        }
        return false;
    }

    var bodyText = document.body.innerHTML;
    for (var i = 0; i < searchArray.length; i++) {
        bodyText = respectzone_doHighlight(bodyText, searchArray[i], highlightStartTag, highlightEndTag);
    }

    document.body.innerHTML = bodyText;
    return true;
}

respectzone_process();
//window.setInterval(function(){respectzone_process()}, 10000);
