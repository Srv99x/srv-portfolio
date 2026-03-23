# Portfolio Project Architecture & Structure Summary

## 1. High-Level Overview
This is a sleek, modern portfolio website for **Sourav Chakraborty** (AI & Data Science | B.Tech CSE). The project focuses strongly on high-end visual aesthetics, featuring a dark-mode theme, glassmorphism UI elements, custom typography, GSAP-powered scroll animations, and interactive 3D components using Three.js. 

Currently, the project functions primarily as a **vanilla HTML/CSS/JS** static site. Although a [package.json](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/package.json) file is present in the root (listing Next.js, React, Tailwind, and React-Three-Fiber dependencies), the core executable code resides in raw [.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/index.html) files in the root directory that pull down GSAP and Three.js via CDNs or direct imports.

## 2. Directory & File Structure

### Core HTML Pages (Root Directory)
- **[index.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/index.html)**: The main landing page. Contains:
  - Complex CSS styling (glassmorphism, custom `@font-face` declarations).
  - A hero section with parallax scrolling and blending-mode profile images.
  - A "Brands / Services" listing grid.
  - A horizontally scrolling infinite marquee / carousel (`.portfolio-carousel`) for portfolio pieces.
  - Category cards utilizing looping video backgrounds (`.category-video`).
- **[aparrel.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/aparrel.html), [contact.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/contact.html), [edition.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/edition.html), [ventures.html](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/ventures.html), `carousel try2.html`**: Secondary pages. They follow the same dark, high-contrast aesthetic and leverage GSAP ScrollTrigger for introductory animations and parallax scrolling.

### Global Assets & Scripts (Root Directory)
- **[cursor.css](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/cursor.css) & [cursor.js](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/cursor.js)**: Implements a custom animated cursor (using a dot and an outline) that tracks mouse movements with lerping/interpolation via GSAP ticker for smooth lag. It automatically disables itself on touch devices.
- **[package.json](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/package.json) & [package-lock.json](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/package-lock.json)**: Shows a dependency tree for a Next.js/React environment. Due to the lack of `/src` or `/app` folders, this may have been an initial scaffolding attempt or is meant for a future migration/bundling step.
- **[og-image.png](file:///c:/Users/SOURAV/Desktop/Portfolio%20Project/og-image.png)**: Open Graph metadata image for link sharing.

### Asset Directories
- **`/images`**: Contains static image assets including UI elements, profile cutouts, and backgrounds used across the HTML files.
- **`/videos`**: Contains MP4 files (e.g., `Futuristic_Hologram_Scan_Video.mp4`, `Quantum_Core_Detonation_Animation.mp4`) used primarily as dynamic, auto-playing backgrounds within the UI cards (`index.html`).
- **`/fonts`**: Hosts local custom font files (`.ttf`, `.otf`) such as `TTCommonsLocal`, `HelveticaLocal`, `FormalScriptLocal`, `AldynHeartItalic`, `AlroLocal`, and `YapariLocal` defining the site's distinct typographical flavor.
- **`/glass`**: Contains experimental or modular code likely related to the liquid glass button effects seen at the bottom of the main page.

### 3D & WebGL Components
- **`/streetwear-3d`**: A standalone 3D rendering module.
  - **`index.html`**: The wrapper.
  - **`style.css`**: UI styling for the 3D viewer (color swatches, loading bars).
  - **`main.js`**: A robust Three.js script. It establishes a scene, camera, and complex lighting (Ambient, RectArea, Spot). It loads a GLTF model via `GLTFLoader`, automatically scales/centers it, and allows the user to change the material color dynamically using GSAP tweens. It also binds mouse movement and scroll events to rotate the 3D object.
  - **`/assets/model/scene.gltf`**: The 3D model asset being rendered.
- **`/t shirt 3d`**: Contains raw 3D model files (`scene.gltf`, `scene.bin`, `textures/`) that represent another 3D implementation, likely similar to the streetwear module.

## 3. Technology Stack & Patterns
- **Markup & Styling**: Pure HTML5 and vanilla CSS. Heavy use of CSS Grid/Flexbox, `backdrop-filter` for glass effects, CSS variables, and keyframe animations.
- **Animation Engine**: **GSAP (GreenSock)** and **ScrollTrigger**. Used extensively for reveal animations, parallax scrolling effects, continuous carousels, and smooth interpolations (both UI elements and 3D objects).
- **3D Graphics**: **Three.js**. Used directly via ES modules for real-time 3D rendering (lighting, materials, model loading, and interaction).
- **Interactivity**: Vanilla JavaScript handles event listeners, custom cursors, and DOM manipulation. 

## 4. Key Takeaways for Future Development
- **Architecture State**: The project is heavily front-loaded with design and animation but lacks modern JS framework componentization (despite the `package.json`).
- **Refactoring Potential**: If migrating to Next.js (as hinted by the package files), the HTML structures need breaking down into React components, and the raw Three.js code should be ported using `@react-three/fiber` and `@react-three/drei`.
- **Performance**: High fidelity assets (videos, 3D models) and continuous GSAP tickers mean performance optimization (lazy loading, canvas offloading) will be crucial as the project expands.
