function getJSON(url, successCallback, failCallback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			successCallback(data)
		} else {
			// We reached our target server, but it returned an error
			failCallback(request, url);
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		failCallback(request, url);
	};

	request.send();
}

function loadJS(file, callback) {
	var e = document.createElement("script");
	e.type = "text/javascript";
	if(typeof callback === "function") {
		e.onload = callback;
	}
	e.src = file;
	document.head.appendChild(e);
}

// function to load locale-data (date-formats, ...) and messages/translations
function loadLocale(locale, opts, callback) {
	var messages;
	var responses=3; // we will send out 3 requests
	var responder = function() {
		responses--
		if(responses <= 0){
			callback(messages)
		}
	}
	loadJS(opts.localeDataPath+"/" + locale + ".js", responder);
	loadJS(opts.relativeLocaleDataPath+"/" + locale + ".js", responder);
	getJSON(opts.messagesPath+"/"+locale+".json", function(data) {
		messages = data;
		responder();
	}, function(request, url) {
		console.log("Failed to load translations:")
		console.log("getJSON error:", url, request)
	});
}

export default loadLocale;
