export default function(availableLocales, fallbackLocale) {
	var langs = []; // contains prefered languages in desc order

	// read selected language from localstorage
	if(typeof(Storage) !== "undefined") {
		var selectedLocale=window.localStorage.getItem("i18n-selected-locale");
		if(selectedLocale != null) {
			langs.push(selectedLocale);
		}
	}

	// read browser languages
	if(Array.isArray(navigator.languages) && navigator.languages.length >= 1) {
		langs=langs.concat(navigator.languages);
	} else if (navigator.language || navigator.browserLanguage) {
		langs.push(navigator.language || navigator.browserLanguage);
	}

	//try it normal e.g. 'en-US'
	var prefLocale;
	for(var i=0; i<langs.length; i++) {
		prefLocale=langs[i];
		if(availableLocales.indexOf(prefLocale) >= 0) {
			return prefLocale;
		}
	}

	//try it short e.g. 'en'
	for(i=0; i<langs.length; i++) {
		prefLocale=langs[i].substr(0,2); // short
		if(availableLocales.indexOf(prefLocale) >= 0) {
			return prefLocale;
		}
	}

	return fallbackLocale
}
