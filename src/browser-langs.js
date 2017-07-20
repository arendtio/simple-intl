export default function() {
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

	return langs;
}
