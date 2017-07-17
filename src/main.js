//import getJSON from 'get-json';
import createFormatCache from 'intl-format-cache';
import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';

import detectLocale from './detect.js'
import loadLocale from './load.js'

// add IntlMessageFromat and IntlRelativeFormat as globals
// because the locale-data use those variables
if(typeof window != "undefined" && window.IntlMessageFormat === undefined && window.IntlRelativeFormat === undefined) {
	window.IntlMessageFormat = IntlMessageFormat
	window.IntlRelativeFormat = IntlRelativeFormat
}

// Constructor
function simpleIntl(availableLanguages, options, readyCallback) {
	if(typeof options === "function"){
		readyCallback = options
		options = undefined
	}

	var instance = createInstance(options)
	var lang = instance.detectLanguage(availableLanguages, availableLanguages[0]);
	instance.loadLanguage(lang, readyCallback);

	return instance
}

function createInstance(options) {
	var activeLocale="undefined_locale"
	var messages = {}
	var loadedLocales = [];

	var localeDataPath;
	var relativeLocaleDataPath;
	var messagesPath;
	var default_options = {
		localeDataPath: "js/intl-messageformat/locale-data",
		relativeLocaleDataPath: "js/intl-relativeformat/locale-data",
		messagesPath: "i18n"
	}

	// init caches
	var cacheMessage = createFormatCache(IntlMessageFormat);
	var cacheNumber = createFormatCache(Intl.NumberFormat);
	var cacheDateTime = createFormatCache(Intl.DateTimeFormat);
	var cacheRelative = createFormatCache(IntlRelativeFormat);

	// The documentation of the opts paramaters can be found on the related web site
	// https://github.com/yahoo/intl-messageformat
	// more on the format: http://formatjs.io/guides/message-syntax/
	var i18n = function i18n(key, args, opts) {
		var template=messages[activeLocale][key];
		if(template === undefined) {
			console.error("Could not find the '"+ activeLocale +"' translation for", key);
		}
		var msg = cacheMessage(template, activeLocale, opts);
		return msg.format(args);
	}

	i18n.patchOptions = function(opts) {
		opts = opts || {}
		if(opts.localeDataPath !== undefined) {
			localeDataPath = opts.localeDataPath
		}
		if(opts.relativeLocaleDataPath !== undefined) {
			relativeLocaleDataPath = opts.relativeLocaleDataPath
		}
		if(opts.messagesPath !== undefined) {
			messagesPath = opts.messagesPath
		}
	}

	i18n.loadLanguage = function(locale, callback) {
		//setLocale
		activeLocale = locale

		// load locale-data
		if(loadedLocales.indexOf(locale) < 0) {
			loadLocale(locale, {
				localeDataPath: localeDataPath,
				relativeLocaleDataPath: relativeLocaleDataPath,
				messagesPath: messagesPath,
			}, function(data) {
				messages[activeLocale]=data
				loadedLocales.push(activeLocale);
				callback();
			})
		} else {
			callback();
		}
	}

	i18n.activeLanguage = function(forceShort) {
		if(forceShort) {
			return activeLocale.substr(0,2)
		}
		return activeLocale
	}
	i18n.detectLanguage = detectLocale;

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	i18n.number = function(value, opts) {
		var msg = cacheNumber(activeLocale, opts);
		return msg.format(value);
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
	i18n.date = function(value, opts) {
		var msg = cacheDateTime(activeLocale, opts);
		return msg.format(value);
	}

	// https://github.com/yahoo/intl-relativeformat
	i18n.relative = function(value, opts) {
		var msg = cacheRelative(activeLocale, opts);
		return msg.format(value);
	}

	// load default options
	i18n.patchOptions(default_options);

	// patch default options with provided
	i18n.patchOptions(options);

	return i18n
}

// static methods
simpleIntl.createInstance = createInstance;
simpleIntl.detectLanguage = detectLocale;

export default simpleIntl
