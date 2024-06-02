import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create - AI Image Generator | Create Art or Modify Images with AI',
    description: 'AI image, AI art generators make you 10x more creative and productive. 100+ models and styles to choose from. Support txt2img, img2img, ControlNet, inpainting, and more with Face/anime enhancement with 2x and 4x upscaling',
}

import AiGcWindow from './index'

export default function page() {
    return (
        <AiGcWindow />
    )
}
