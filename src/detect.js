import browserLangs from './browser-langs.js'

export default function(availableLocales, fallbackLocale) {
	var langs = browserLangs(); // contains prefered languages in desc order

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
