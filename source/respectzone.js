(function() {
    var Ext = {

        elements: {
            saveBtn        		: document.getElementById('save'),
            langs          		: document.getElementById('languages'),
            isactive       		: document.getElementById('isactive')
        },

        settings: null,

        setActiveByDefault: function() {
            var activate = this.elements.isactive;
            activate.checked = (this.settings.active == true) ? true : false;
        },

        updateLocalData: function() {
            var elements = this.elements;
            var settings = this.settings;

            var exports = {
                language: elements.langs.options[elements.langs.selectedIndex].value,
                active: document.getElementsByName('isactive')[0].checked
            };

            for (var prop in exports) {
                if (settings.hasOwnProperty(prop)) {
                    settings[prop] = exports[prop];
                }
            }

            this.sendData(settings);
        },

        sendData: function(settings) {
            var settings = settings || this.settings;

            chrome.storage.local.set({
                'settings': settings
            }, function(response) {
                window.close()
            });

            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'update'
                });
            });
		},

        init: function() {
            var settings = this.settings;
            var elements = this.elements;

            this.setActiveByDefault();

            elements.saveBtn.addEventListener('click', this.updateLocalData.bind(this), false);

            for (var i = 0, len = elements.langs.options.length; i < len; i++) {
                if (elements.langs.options[i].value == settings.language) {
                    elements.langs.options[i].setAttribute('selected', 'selected');
                }
            }
        },

        getSettings: function() {
            var me = this;

            chrome.storage.local.get('settings', function(response) {
                me.settings = response.settings;
                me.init();
            });
        },
		
		contentMenu: function(){
			
			var me = this;
						
			function onClickHandler(info, tab) {
				chrome.tabs.sendMessage(tab.id, {type: "selectedtext"}, function(response) {
					var stopWord = me.validateTextArea(response.selectedtext);

					if(stopWord[0].length > 0 && me.settings.userWords.includes(stopWord[0]) === false){
						me.settings.userWords.push(stopWord[0]);
						me.sendData(me.settings);
					}

				});
			};
			
			chrome.contextMenus.onClicked.addListener(onClickHandler);

			chrome.runtime.onInstalled.addListener(function() {
				var contexts = ["selection"];
				var title = "Respectzone";
				
				for (var i = 0; i < contexts.length; i++){
					var context = contexts[i];    
					var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "respectzone" + context});
				} 
			});
			
			
		}
    };

    Ext.getSettings();
	Ext.contentMenu();
})();