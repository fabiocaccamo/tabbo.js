[![](https://img.shields.io/npm/v/@fabiocaccamo/tabbo.js?color=blue&logo=npm)](https://www.npmjs.com/package/@fabiocaccamo/tabbo.js)
[![](https://img.shields.io/npm/dt/@fabiocaccamo/tabbo.js?color=blue)](https://www.npmjs.com/package/@fabiocaccamo/tabbo.js)
[![](https://img.shields.io/github/stars/fabiocaccamo/tabbo.js?color=blue&logo=github&logoColor=white&style=flat)](https://github.com/fabiocaccamo/tabbo.js/stargazers)
[![](https://img.shields.io/bundlephobia/min/@fabiocaccamo/tabbo.js?color=blue)](https://www.npmjs.com/package/@fabiocaccamo/tabbo.js)
[![](https://img.shields.io/bundlephobia/minzip/@fabiocaccamo/tabbo.js?color=blue)](https://www.npmjs.com/package/@fabiocaccamo/tabbo.js)
[![](https://img.shields.io/github/license/fabiocaccamo/tabbo.js.svg?color=blue)](https://github.com/fabiocaccamo/tabbo.js/blob/main/README.md)

# tabbo.js

:chocolate_bar: :keyboard: enhanced keyboard tabbing usability on any website / webapp with one line of code.


## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [APIs](#apis)
- [Development](#development)
- [Security](#security)
- [License](#license)


## Features

-   Vanilla JS / Zero dependencies
-   Preserved default `tabindex` behaviour
-   Tabbing enabled on the following elements: `'a'`, `'button'`, `'input'`, `'select'`, `'summary'`, `'textarea'`, `'[tabindex]'` *(any element with `tabindex` attribute)*
-   Tabbing disabled on all elements that are **disabled** *(impossible to interact with)* or **invisible** *(hidden or without width/height)*
-   Tabbing disabled on all elements that are children/descendants of elements with tabbing disabled
-   Tabbing trapped inside modal elements *(any element with `aria-modal="true"` attribute that is enabled and visible)*
-   Reversed tabbing order when `Shift` key is pressed
-   Looped tabbing when reaching the last focusable element
-   Checkboxes can be checked/unchecked using `Enter` key

## Installation

This library is available through [npm](https://www.npmjs.com/package/@fabiocaccamo/tabbo.js):

`npm install @fabiocaccamo/tabbo.js`

## Usage

### CDN

```html
<script src=" https://cdn.jsdelivr.net/npm/@fabiocaccamo/tabbo.js/dist/tabbo.min.js"></script>
```

### Local

```html
<script src="node_modules/@fabiocaccamo/tabbo.js/dist/tabbo.min.js"></script>
```

### Node

```javascript
const tabbo = require("@fabiocaccamo/tabbo.js");
```

## APIs

The **only** thing you have to do is activate `tabbo` as soon as possible:

```javascript
tabbo.activate();
```

If needed, you can deactivate `tabbo` at any time:

```javascript
tabbo.deactivate();
```

## Development

### Setup

-   `git clone https://github.com/fabiocaccamo/tabbo.js.git`
-   `npm install`

### Watch

-   `npm run watch`

### Build

-   `npm run build`

## Security

Refer to [SECURITY.md](./SECURITY.md)

## License

Released under [MIT License](https://github.com/fabiocaccamo/tabbo.js/blob/main/LICENSE.txt).
