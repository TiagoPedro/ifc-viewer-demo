# IFC Viewer Workshop (That Open Platform)

This project is a hands-on workshop to build a high-performance BIM (Building Information Modeling) viewer in the browser using [That Open Platform](https://thatopen.com/) libraries.

## 🚀 Overview

By following this project, you will learn how to:
- Set up a 3D environment with **Three.js**.
- Load and display **IFC files** in the browser.
- Use **Fragments** for high-performance rendering of massive models.
- Build a user interface using **@thatopen/ui**.

## 🛠️ Setup & Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-url>
   cd ifc-viewer-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open the link shown in the terminal (usually `http://localhost:5173`).

## 🎓 Workshop Instructions

This project is set up as a "Fill in the Blanks" exercise.

1. Open `index.js`.
2. You will find 4 main sections marked with comments:
   - **1. The World:** Setting up the 3D scene.
   - **2. The Tools:** initializing the IFC Loader and Fragments Manager.
   - **3. The Logic:** Functions to load and download files.
   - **4. The UI:** Creating the interface panel.
3. Follow the `// TODO` comments to implement the functionality.

### Getting Stuck?

A complete working solution is available in the `solutions/` folder (note: this folder is not tracked by git by default, but is included in the workshop files).

## 📚 Tech Stack

- **[Three.js](https://threejs.org/):** The 3D engine.
- **[@thatopen/components](https://docs.thatopen.com/):** Core BIM tools and dependency management.
- **[@thatopen/fragments](https://docs.thatopen.com/):** High-performance geometry format.
- **[@thatopen/ui](https://docs.thatopen.com/):** ready-made BIM UI components.
- **[Vite](https://vitejs.dev/):** Fast development server and bundler.

## Resources
- **https://docs.thatopen.com/components/getting-started**
- **https://docs.thatopen.com/components/tutorial-paths**
- **https://docs.thatopen.com/Tutorials/Components/**
- **https://docs.thatopen.com/Tutorials/Components/Core/IfcLoader**

## 📄 License

This project is for educational purposes.
