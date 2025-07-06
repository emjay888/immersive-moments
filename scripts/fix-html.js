// scripts/fix-html.js
import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const indexPath = path.join(distDir, 'index.html');

// This script runs AFTER 'vite build'
// It finds the generated JS asset and updates index.html to point to it.

try {
    let indexHtmlContent = fs.readFileSync(indexPath, 'utf8');

    // Find the generated JS asset file name (e.g., index-C_KlWXfw.js)
    // This assumes there's only one main JS asset in the assets folder
    const assetsDir = path.join(distDir, 'assets');
    const filesInAssets = fs.readdirSync(assetsDir);
    const jsAssetFile = filesInAssets.find(file => file.startsWith('index-') && file.endsWith('.js'));

    if (jsAssetFile) {
        const correctScriptTag = `<script type="module" crossorigin src="/assets/${jsAssetFile}"></script>`;
        const oldScriptTag = `<script type="module" src="/src/main.jsx"></script>`;

        if (indexHtmlContent.includes(oldScriptTag)) {
            indexHtmlContent = indexHtmlContent.replace(oldScriptTag, correctScriptTag);
            fs.writeFileSync(indexPath, indexHtmlContent, 'utf8');
            console.log('Successfully updated dist/index.html with correct script path.');
        } else {
            console.warn('Warning: Old script tag not found in dist/index.html. HTML might already be correct or unexpected.');
        }
    } else {
        console.error('Error: Could not find main JavaScript asset in dist/assets/.');
    }

} catch (error) {
    console.error('Error fixing dist/index.html:', error);
}