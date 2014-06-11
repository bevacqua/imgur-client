# imgur-client

> Interact easily with the [imgur.com](imgur.com) API

# Installation

```shell
npm i -S imgur-client
```

# Usage

```js
var imgur = require('imgur-client');

imgur('YOUR_IMGUR_KEY').upload('/path/to/image', function (err, res) {
  if (err) {
    console.log('Error!', err);
    return;
  }
  console.log('Response:\n', res);
});
```

# License

MIT
