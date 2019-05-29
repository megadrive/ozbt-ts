# ozbt-ts

A Twitch bot for you; designed to be simple and extensible. Hosted by you.

Proper instructions to follow.

## For now:

-   NodeJS is needed.
-   Follow [these instructions](https://enmap.evie.codes/install) to install pre-requisites for Enmap.
-   Clone a copy of the repo to your local machine.
-   Create a copy of `.env.defaults` to `.env` and change as needed.
    -   The `channels` key is a comma-delimited list of channels to join.
-   Install dependencies:

```
$ npm install
```

-   Compile using TypeScript:

```
$ tsc
```

-   Run!

```
$ node dist/index.js
```

Or skip compiling and just use `npx`:

```
$ npx ts-node src/
```
