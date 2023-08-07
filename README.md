# outpost-sdk

## To start using the Comet API, create a Comet object with your API key and the ID of the comet service.

```ts
import { Comet } from 'outpost-kit' 
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