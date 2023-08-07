# Outpostkit

The Outpost API Node.js SDK with TypeScript support.

## To start using the Comet API, create a Comet object with your API key and the ID of the comet service.

[![NPM Version](https://img.shields.io/npm/v/@jengaicons/react.svg?style=flat)](https://www.npmjs.com/package/@jengaicons/react)
[![Discord](https://img.shields.io/discord/793832892781690891?color=7389D8&label=chat%20on%20Discord&logo=Discord&logoColor=ffffff)](https://discord.gg/sHnHPnAPZj)

## Installation

```sh
# with npm
npm install outpostkit

# with yarn
yarn add outpostkit

# with pnpm
pnpm add outpostkit
```

```ts
import { Comet } from 'outpostkit' 
const comet= Comet('api-key','cometId');
```

## Now you can start prompting the comet service

```ts
const response = comet.prompt({input:"what is useCallback?",stream:false});
```


## Available SDK Resources
- project
- comet
- confluxes

## License

Jenga Icons is a project by [Outpost](https://outpost.run).

Released under the MIT License.