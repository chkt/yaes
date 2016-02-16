# yaes

Yet another event system

## Install

```sh
$ npm install yaes
```

## Use

```js
import * as yaes from 'yaes';



class Class extends yaes.Dispatcher { ... }

const data = { ... };

Class.addListener('type', e => { ... })
Class.dispatch(new yaes.Dispatchable('type',data));

```
