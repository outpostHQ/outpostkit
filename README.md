# Outpost Kit

The Outpost API Node.js SDK with TypeScript support.

[![NPM Version](https://img.shields.io/npm/v/outpostkit.svg?style=flat)](https://www.npmjs.com/package/outpostkit)
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

## Usage

To start using the Comet API, create a Comet object with your API key and the ID of the comet service.

```ts
import { Comet } from 'outpostkit' 
const comet= new Comet('api-key','cometId');
```

### Now you can start prompting the comet service

```ts
const response = comet.prompt({input:"what is useCallback?",stream:false}); //returns sessionId along with the response
```
This will create a new `Session` which can then be used in subsequent prompts to maintain messaging history, which can be particularly useful when using chat models. 
To continue the prompting in the same session:

```ts
const response = comet.prompt({input:"what is useCallback?",stream:false,sessionId:'prevSession'});
```

### Prompt Sessions
#### List Prompt Sessions
```ts
const sessions = comet.listSessions({});
```

#### Get details of a particular Session

```ts
const session = comet.getSession({sessionId:'someSessionId'});
```

A `Session` consists of one or more `Conversations` which in turn are usally just a single prompt and its response (for example: pair of one human and one agent `Message`).
The `Conversation` model is created to better handle human feedback.

A conversation can also contain messages from functions, system too.
### Conversations

#### List Conversations of a Session
```ts
const conversations = comet.listConversations({sessionId:'sessionId',stats:false,messages:true}); //defaults: stats:false messages:false
```
This lists all the conversations of a session along with its messages but omits the conversation stats



#### Get messages and details of a particular Conversation

```ts
const conversation = comet.getConversation({conversationId:'convoId'});
```

### Messages

#### Get Message
```ts
const message = comet.getMessage({messageId:'mId'});
```



### Available Routes
| Route                   | Route Description                       |
| ----------------------- | --------------------------------------- |
| `GET /api/v1/project`   | Endpoint to receive Project lists.      |
| `GET /api/v1/comet`     | Endpoint to receive Comet lists.        |
| `GET /api/v1/conflux`   | Endpoint to receive Conflux lists.      |

## License

Outpost Kit is a project by [Outpost](https://outpost.run).

Released under the MIT License.
