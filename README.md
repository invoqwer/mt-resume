# MT Resume Renderer
Takes text content from a `.yaml` file and renders it to `.pdf` using puppeteer

## Note
If running on Windows WSL, see [instructions here](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-wsl-windows-subsystem-for-linux) to install Chrome on WSL first

## Usage
- `npm install`
- make changes to `config.yaml` if necessary
- `npm run start` for developing locally
    - make edits to resume content in `/resume/<version-name_layout-name.yaml>`
    - make changes to styles in `/layouts/layout-name/`
- `npm run build` to render pdf to `dist` folder

## TODO
- auto re-render pdf when yaml/style change in dev mode
- styling (Sass?)
- static site generation -> github pages -> automatically update github hosted 
page with new resume