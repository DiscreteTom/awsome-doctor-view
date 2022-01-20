# awsome-doctor-view

The frontend code of [Awsome Doctor](https://discretetom.github.io/awsome-doctor/).

Based on [NuxtJS](https://nuxtjs.org/) & [Vuetify](https://vuetifyjs.com/en/).

## Features

- Workflow browser & executor.
- [Built-in responsive workflow editor](https://discretetom.github.io/awsome-doctor/editor) powered by [ACE](https://github.com/ajaxorg/ace).
  - Code format powered by [Prettier](https://prettier.io/).
  - Syntax highlight powered by [PrismJS](https://prismjs.com/).
  - Use URL to open external workflows.
- [File System Access API](https://web.dev/file-system-access/) in editor page.
  - _Only available in Chromium browsers._

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Related Projects

- [awsome-doctor](https://github.com/DiscreteTom/awsome-doctor): A browser based AWS troubleshooting tool.
- [awsome-doctor-cli](https://github.com/DiscreteTom/awsome-doctor-cli): Command line interface version of Awsome Doctor.
- [awsome-doctor-view](https://github.com/DiscreteTom/awsome-doctor-view): Frontend code of Awsome Doctor.
- [awsome-doctor-core](https://github.com/DiscreteTom/awsome-doctor-core): Workflow executor, plugins and util functions of Awsome Doctor.
