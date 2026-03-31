<script>
/**
 * Lightweight sprite engine for the 2D mini-game.
 * Pure Canvas2D — no external dependencies.
 */

/**
 * Load an image and return a promise that resolves to the HTMLImageElement.
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
    })
}

/**
 * SpriteAnimation — wraps a horizontal spritesheet.
 */
export class SpriteAnimation {
    /**
     * @param {HTMLImageElement} image  - loaded spritesheet image
     * @param {number} frameCount       - number of frames in the sheet
     * @param {number} frameDuration     - ms per frame
     * @param {boolean} [loop=true]      - whether to loop the animation
     */
    constructor(image, frameCount, frameDuration = 120, loop = true) {
        this.image = image
        this.frameCount = frameCount
        this.frameWidth = image.width / frameCount
        this.frameHeight = image.height
        this.frameDuration = frameDuration
        this.loop = loop
        this.elapsed = 0
        this.currentFrame = 0
        this.finished = false
    }

    /** Reset animation to frame 0 */
    reset() {
        this.elapsed = 0
        this.currentFrame = 0
        this.finished = false
    }

    /** Advance animation by dt milliseconds */
    update(dt) {
        if (this.finished) return
        this.elapsed += dt
        const totalFrames = this.frameCount
        const frame = Math.floor(this.elapsed / this.frameDuration)
        if (this.loop) {
            this.currentFrame = frame % totalFrames
        } else {
            if (frame >= totalFrames) {
                this.currentFrame = totalFrames - 1
                this.finished = true
            } else {
                this.currentFrame = frame
            }
        }
    }

    /**
     * Draw the current frame to a canvas context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x       - destination x (center)
     * @param {number} y       - destination y (bottom)
     * @param {number} scale   - pixel scale factor
     * @param {boolean} flipX  - mirror horizontally
     */
    draw(ctx, x, y, scale = 1, flipX = false) {
        const sw = this.frameWidth
        const sh = this.frameHeight
        const dw = sw * scale
        const dh = sh * scale
        const sx = this.currentFrame * sw

        ctx.save()
        if (flipX) {
            ctx.translate(x, y - dh)
            ctx.scale(-1, 1)
            ctx.drawImage(this.image, sx, 0, sw, sh, -dw / 2, 0, dw, dh)
        } else {
            ctx.drawImage(this.image, sx, 0, sw, sh, x - dw / 2, y - dh, dw, dh)
        }
        ctx.restore()
    }
}
</script>
