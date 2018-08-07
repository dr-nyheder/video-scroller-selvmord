import { select, selectAll, fetchFile} from '../../utils/trix-utils';
import {scrollarrow, flag} from './svg';

let counter = 1;

export default class DomGenerator {
    constructor() {

        this.scenesContainer = select('#scenes');

    }

    build(file, callback) {

        const filePath = ASSETS_PATH + 'data/' +file;
        fetchFile(filePath, (data) => {
            const json = JSON.parse(data);
            this.buildDOM(json);
            callback(selectAll(".scene", this.scenesContainer));

        })
    }

    buildDOM(data) {
        let sceneHtml = ''
        data.forEach((row) => {
            sceneHtml += this.buildScene(row);
        })
        this.scenesContainer.innerHTML = sceneHtml;
        console.log('built');
    }

    buildScene(sceneObject) {
        // console.log(sceneObject.type);
        const sceneId = counter;
        let extraClass = "";
        //let flagDom = `<div>${flag}</div>`;

        if(sceneObject.type ==='Header'){
            extraClass = " header-scene";
        }
        if(sceneObject.type === 'Big'){
            extraClass = ' large-scene'
        }
        const arrow = (sceneObject.type === 'Header') ? `<p class="arrow">${scrollarrow()}</p>` : ``;
        const icon = (sceneObject.picture !== '') ? `<div class="icon"><img src="${ASSETS_PATH + 'images/'}${sceneObject.picture}"></div>` : ``;
        const header = (sceneObject.header !== undefined) ? `<div class="scene-header">${sceneObject.header}</div>` : ``;
        const address = (sceneObject.address !== undefined) ? `<div class="address">${sceneObject.address}</div>` : ``;

        const html = `
        <div id="scene-${sceneId}" class="scene${extraClass}" data-time="${sceneObject.time}" data-duration="${sceneObject.duration}">
            ${icon}
            ${header}
            ${address}
            <div class="main">${sceneObject.text}</div>
            ${arrow}
        </div>
        `;

            counter++;

            return html;
        }

    }