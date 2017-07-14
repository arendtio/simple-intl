# Simple-Intl

Simple i18n library based on the powerful
[formatjs.io](formatjs.io).

Internationalization (i18n) is hard. In the beginning, we often
think 'Hey, let's take all our texts into a dictionary and use
different dictionaries for different languages'. After a while, we
notice that that's not enough, as values with different quantities
require different translations. So we solve that problem for the
first languages we support and later we find out that our solution
is not good enough for other languages. And so on...

Luckily, there are tools like formatjs.io. It is a mature project
which offers you a solution based on the standardized Internationalization API
[ECMA-402](http://www.ecma-international.org/ecma-402/1.0/).

Formatjs.io offers [integrations](https://formatjs.io/integrations/)
for some popular frameworks and otherwise the core libraries, but as
the usage of the core-libs has its own complexity, this project was
created to wrap the power of formatjs.io into a simple function.


# Usage

The hardest part is the installation and integration of your
project. When everything is set up and running displaying a
translated text is just a matter of calling a function like:

```
i18n("G_HELLO_WORLD_KEY");
```

More complex examples can be found in the `demo.html`.

# Demo

To see it in action, you can simply clone this repository, download
the dependencies and serve it with a local web server:

```bash
# download the project
git clone https://github.com/arendtio/simple-intl.git

cd simple-intl

# download the dependencies
npm install

# serve the current directory on port :8080
npm start

# open http://localhost:8080/demo.html in a browser
```

# Installation

In its current state simple-intl is designed for the browser. As
therefore, installation means 'intergration to your project', it is
the best to start with the demo and take what you need from there.

To download everything you need, you can start with npm:
```
npm install simple-intl
```

Now we can start to integrate it into your project. So before we can
use any translations we need to create them. Just for the sake of
this let's create a file for English and one for German:

English (i18n/en.json):
```
{
	"G_HELLO_WORLD_TXT": "Hello World."
}
```

German (i18n/de.json):
```
{
	"G_HELLO_WORLD_TXT": "Hallo Welt."
}
```

The name of the files must be of the pattern `[locale].json`, while
the [locale] must be part of the list of `availableLanguages`.

To be able to use simple-intl there are some dependencies which must
be loaded before it can be used. The first is a polyfill for the
Internationalization API which is not yet implemented in all
[browsers](https://cdn.polyfill.io/v2/docs/features/#Intl):

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en,Intl.~locale.de"></script>
```

Next we have to load two of the core libraries of formatjs.io:

```html
<script src="node_modules/intl-messageformat/dist/intl-messageformat.min.js"></script>
<script src="node_modules/intl-relativeformat/dist/intl-relativeformat.min.js"></script>
```

An finally we have to load simple-intl itself:

```html
<script src="node_modules/simple-intl/dist/simple-intl.min.js"></script>
```

Now we are ready to use it. To do that, there is a global function
called `simpleintl` which takes a few arguments and returns an
instance which can be used to replace translation keys with the
corresponding translations.

To be able to detect the best language
for the user (from the browser settings), we have to tell simple-intl
for which **languages** we have translations for our page/app.

Furthermore, simple-intl has to fetch some files depending on the
selected language to help it find those files, we can set a few
**options**.

Last but not least, simple-intl will take a moment to
initialize the instance and takes a **callback** function which is being
called when the returned function is ready to be used:

```
var available = ["en", "de"];

var options = {
	localeDataPath: "node_modules/intl-messageformat/dist/locale-data",
	relativeLocaleDataPath: "node_modules/intl-relativeformat/dist/locale-data",
	messagesPath: "i18n",
}

// i18n should be used by convention
var i18n = simpleintl(available, options, function() {
	console.log("i18n is now ready to be used");
	alert(i18n('G_HELLO_WORLD_TXT'));
});
```

When no language from the browser settings matches the available
languages simple-intl takes the first available language as fallback.

For educational reasons, we left all dependencies in their
directories, but actually, simple-intl assumes to find the files in
more appropriate places by default.

# Documentation

Conceptionally simple-intl consists of two parts:

1. the static methods to create instances
2. the instance methods

The static methods have no state. Every instance has its own cache
and dictionaries (one per language). New instances can not be used
until they have loaded a language. Loading languages, however, is an
expensive process as new file need to be downloaded.

To keep things simple and performant it is advised to have one global
instance called `i18n` and use additional instances only when required.

Every instance has its own options. By default every instance uses
the following options:

```json
{
	localeDataPath: "js/intl-messageformat/locale-data",
	relativeLocaleDataPath: "js/intl-relativeformat/locale-data",
	messagesPath: "i18n"
}
```

## Static Methods (simpleintl)

- `simpleintl(availableLanguages, [ options,] readyCallback)`: The common
method to create a new instance. It creates a new instance, patches
to options, detects the preferred language, loads that language and
calls the callback when it is ready. It returns the new instance.

- `simpleintl.createInstance([options])`: Less eager method to create a
new instance. It just creates a new instance and patches the
options. Before that new instance can be used the language must be
loaded manually (i18n.loadLanguage). It returns the new instance.

- `simpleintl.detectLanguage(availableLocales, fallbackLocale)`:
Tries to find the best match between availableLocales and browser
settings. `availableLocales` has to be an Array with locales
(Strings in the form of 'en' or 'en-US'). `fallbackLocale` must be
the locale the function should return if no availableLocale matches
the user's preferences. Before it looks at the
browser settings it takes a look at the localStorage key
`i18n-selected-locale`. So settings that key makes it possible to
let the user select a language without having to change the browser
settings. The function returns the first matching locale. If it does
not match any availableLocale, it returns the fallbackLocale.

## Instance Methods (i18n)

The instance methods can be split into 2 groups:

1. Translation methods
2. Utility Methods

### Translation Methods

The translation methods are the actual methods which are the
placeholders of the strings that should be displayed.

- `i18n(key [, args, opts])`: The `key` (string) is the key of the
dictionary to find the related translation. `args` is an object
which properties are the names of the dynamic values within the
translation. `opts` are special options related to the `args`. More
information about the formats can be found
[here](https://formatjs.io/guides/message-syntax/) and
[here](https://github.com/yahoo/intl-messageformat).
 
- `i18n.number(value [, opts])`: Formats a number (value) based on the
active language and `opts`.

- `i18n.date(value [, opts])`: Formats a date (value) based on the active
language and the `opts`.

- `i18n.relative(value [, opts])`: Formats a date into a relative time
string. More information can be found
[here](https://github.com/yahoo/intl-relativeformat).

Furthermore, some examples can be found in the `demo.html`.

### Utility Methods

In most cases, it should be enough to create an instance with
`simpleintl()` and use it afterward. In other cases the following
methods might be useful:

- `i18n.patchOptions(opts)`: `opts` should be an object which
properties are the same as those of the default options object.
Only properties which are present in the `opts` object will be
changed.

- `i18n.loadLanguage(locale, callback)`: Sets the `locale` as
`activeLanuage` and downloads the required language files.
`callback` is called as soon as all files have been fetched and
loaded.

- `i18n.activeLanguage([forceShort])`: Returns the currently
active/loaded Language. If `forceShort` is set it only returns the
first 2 characters of the active Locale.

- `i18n.detectLanguage(availableLocales, fallbackLocale)`: Just the
  same as `simpleintl.detectLanguage()`


