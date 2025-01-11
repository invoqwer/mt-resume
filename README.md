# Resume Renderer
Takes text content from a `.yaml` file and renders it to `.pdf` using puppeteer

## Requirements
- Node.js + npm
- Google Chrome
    - If running on Windows WSL, see [instructions here](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-wsl-windows-subsystem-for-linux) to install Chrome on WSL first

## Usage
- `npm install`
- create a `.yaml` file, containing your resume content
- create resume content: `./content/<version>-<layout>.yaml`
- create a layout with which to render resume content: `./layouts/<layout>/`
- configure the project (see the Configuration section)
- `npm run start` for developing locally
- `npm run build` to render pdf to `./dist/`

## Project Structure

`./content`: Contains files of the format `<version>-<layout>.yaml` where:
- `<version>` is a string representing a specific version of your resume content. This allows you to maintain multiple versions of your resume with differing content.
- `<layout>` is a string representing the layout with which you want to render the specific version of your resume content.

This allows for separation of a resume's content from the layout.

`./layouts/`: Contains multiple folders of different resume layouts

`./layouts/<layout>/`: Contains all the `.pug`, `.css` and `.js` files required to render a HTML page

`./fonts/`: Contains font files which can then be referenced in layout stylesheets

## Configuration

`./config.yaml`: A global project config

**Fields:**
- `resumeVersion`: the resume content version to use (`v1`, `v2`, etc.)
- `resumeLayout`: the layout with which to render the resume content version (`technical`, `non-technical`, etc.)
- `resumeOutputName`: the generated name of the `.pdf` file
- `distPath`
- `port`

`./layouts/<layout-name>/config.yaml`: A specific layout config

**Fields:**
- `removeClass`: remove a CSS class from the HTML before rendering the `.pdf`
- `removeElement`: remove a HTML element before rendering the `.pdf`

## TODO
- auto re-render pdf when yaml/style change in dev mode
- styling (Sass?)
- static site generation -> github pages -> automatically update github hosted 
page with new resume