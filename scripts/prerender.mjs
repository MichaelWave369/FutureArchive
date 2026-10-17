import {readFile,writeFile} from 'node:fs/promises';
import {render} from '../.prerender/entry-server.js';

const path=new URL('../dist/index.html',import.meta.url);
const html=await readFile(path,'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('The static render placeholder is missing.');
await writeFile(path,html.replace('<!--app-html-->',render()));
console.log('Pre-rendered the complete 18-print React gallery.');
