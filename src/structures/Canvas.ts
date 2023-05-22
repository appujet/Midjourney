import { createCanvas, loadImage } from 'canvas';

interface MergeImagesOptions {
    width: number;
    height: number;
    images: string[];
}
export class Canvas {
    public async mergeImages(options: MergeImagesOptions): Promise<Buffer> {
        // count the number of images
        const imageCount = options.images.length;
        // calculate the number of rows and columns
        const rows = Math.ceil(Math.sqrt(imageCount));
        const cols = Math.ceil(imageCount / rows);
        // calculate the width and height of each small image
        const chunkWidth = Math.floor(options.width / cols);
        const chunkHeight = Math.floor(options.height / rows);
        // create a canvas object
        const canvas = createCanvas(options.width, options.height);
        const ctx = canvas.getContext('2d');
        // load all images, draw them to canvas
        const promises = [];
        for (let i = 0; i < imageCount; i++) {
            promises.push(loadImage(options.images[i]).then((image) => {
                ctx.drawImage(image, (i % cols) * chunkWidth, Math.floor(i / cols) * chunkHeight, chunkWidth, chunkHeight);
            }));
        }
        await Promise.all(promises);
        // return the canvas
        return canvas.toBuffer();
    }
}