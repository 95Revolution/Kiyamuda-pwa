<p align="center">
<img src="https://github.com/95Revolution/Kiyamuda-pwa/blob/master/public/src/images/icons/app-icon-96x96.png" alt="Kiyamuda">
</p>
<h2 align="center">Kiyamuda</h2>

<p align="center">
<a href="https://github.com/95Revolution/Kiyamuda-pwa/blob/master/LICENSE"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
<a href="https://discord.gg/p9gHBZj"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Discord"></a>
<a href="https://join.slack.com/t/95revolution/shared_invite/enQtNDI0NDAxODg3NzgzLTdkMTZmMDM3N2E3MThlZTQwY2EzMjAzMWZjOTYwZGY2MjcyMzE4YmFiMzkzOTk1Yjg4MjI4ZWM1ZTc0NDI1ZWY"><img src="https://img.shields.io/badge/chat-on%20slack-7289da.svg" alt="Slack"></a>
</p>

# About Kiyamuda

Kiyamuda is a Geo-location based reviewing portal that hopes to bring accountability to both private & public sectors.

Kiyamuda is an open source initiative launched by `95Revolution` :blush: in order to spread goodwill :heart: for the Sri Lankan society.

If you are a _huge nerd_ like us help us to help you by contributing to this awesome adventure.

Show us you're capabilities :muscle: and the spread message about our journey!!!

## Tech Stack

Kiyamuda portal is fully powered with the worlds neweset **heartbreaker** `JS`. From backend to frontend all the bits are configured using the `MEAN` stack.

Also, our current portal is **100% PWA** setup. We are using the concept of PWA because our motto is,

> Be lazy, code less, run anywhere any way you want

### Current Progress

Right now we have successfully launched our alpha version of the Kiyamuda portal. Check the progress and contribute to the cause.

## How to setup

Clone the project using

```sh
git clone
```

Install the dependencies via

```sh
npm install
```

Setup the hosting (we use firebase realtime database)

```sh
firebase deploy
```

Now, find :beetle: and create issues so we can help you :grin:.

## Guidelines

When setting up your own server we reccomend using `busboy` as file pusher to cloud service.

Following is our sample setup that you can use.

```js
busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
  console.log(
    `File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
  );
  const filepath = path.join(os.tmpdir(), filename);
  upload = { file: filepath, type: mimetype };
  file.pipe(fs.createWriteStream(filepath));
});
```

## TO DO

Visit our [project board](https://github.com/95Revolution/Kiyamuda-pwa/projects/1) to get the latest details about the Kiyamuda portal
