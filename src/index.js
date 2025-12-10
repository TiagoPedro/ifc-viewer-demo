import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import * as OBF from "@thatopen/components-front";

// --------------------------------------------------------------------------
// 1. THE WORLD: Setting up the 3D Environment
// --------------------------------------------------------------------------

// Initialize the Components instance
const components = new OBC.Components();

// Get the Worlds component and create a new world
const worlds = components.get(OBC.Worlds);
const world = worlds.create();

// Initialize the Scene (SimpleScene), setup it, and clear the background
world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

// Initialize the Renderer (SimpleRenderer) and attach it to the container
const container = document.getElementById("container");
world.renderer = new OBC.SimpleRenderer(components, container);

// Initialize the Camera (OrthoPerspectiveCamera) and set the initial position
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);

// Initialize the components (components.init())
components.init();

// --------------------------------------------------------------------------
// 2. THE TOOLS: Adding capabilities (Grid, IFC Loading, Fragments)
// --------------------------------------------------------------------------

  // ------------------------------------------------------------------------
  // LECTURE 1: Fundamentals
  // ------------------------------------------------------------------------

// Initialize the Grids component and create a grid in the world
const grids = components.get(OBC.Grids);
grids.create(world);

// Initialize the IfcLoader component
// Tip: Check this link https://docs.thatopen.com/Tutorials/Components/Core/IfcLoader on how to setup the IfcLoader
const ifcLoader = components.get(OBC.IfcLoader);
ifcLoader.onIfcImporterInitialized.add(function(importer) {
  console.log(importer.classes);
});

await ifcLoader.setup({
  autoSetWasm: false,
  wasm: {
    path: "https://unpkg.com/web-ifc@0.0.72/",
    absolute: true,
  },
});

// Initialize the FragmentsManager component
// Tip #1: Check this link https://docs.thatopen.com/Tutorials/Components/Core/FragmentsManager on how to setup the FragmentsManager
// Tip #2: You need to provide the path to the worker script (./assets/workers/worker.mjs)
const workerUrl = "./assets/workers/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

// Connect Fragments to the World (update on camera rest, add loaded models to scene)
world.camera.controls.addEventListener("rest", function() { fragments.core.update(true); });
fragments.list.onItemSet.add(function({ value: model }) {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

  // ------------------------------------------------------------------------
  // LECTURE 2: Advanced Tools and Features
  // ------------------------------------------------------------------------

// TODO: Initialize and setup the Raycasters and the Highlighter components


// TODO: Initialize and setup the Clipper component


// TODO: Initialize and setup the Classifier component


// TODO:  Initialize and setup the Hider component


// --------------------------------------------------------------------------
// 3. THE LOGIC: Application functions
// --------------------------------------------------------------------------

  // ------------------------------------------------------------------------
  // LECTURE 1: Fundamentals
  // ------------------------------------------------------------------------



async function loadIfc(path) {
  // Fetch the file from the path
  const file = await fetch(path);

  // Get the array buffer from the file
  const data = await file.arrayBuffer();

  // Create a Uint8Array from the buffer
  const buffer = new Uint8Array(data);

  // Load the buffer using the IfcLoader
  const model = await ifcLoader.load(buffer, false, "example", {
    processData: {
      progressCallback: function(progress) { console.log(progress); },
    },
  });

  // TODO: Classify the model by Category and Levels
  
}

async function downloadFragments() {
  // Get the first model from fragments.list
  // fragments.list holds all the fragments loaded
  const [model] = fragments.list.values();
  if (!model) return;

  // Get the buffer from the model
  const fragsBuffer = await model.getBuffer(false);

  // Create a File object from the buffer
  const file = new File([fragsBuffer], "ifc_fragment.frag");

  // Create a download link and click it to download the file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(link.href);
}

  // ------------------------------------------------------------------------
  // LECTURE 2: Advanced Tools and Features
  // ------------------------------------------------------------------------

// TODO: Handle selection: log IDs and try to fetch properties via fragments.getData

// TODO: Double-click to create clipping planes

// TODO: Delete key to delete clipping planes

// TODO: Toggle clipping planes

// TODO: Add default groupings function

// Helper function to create checkbox UI for a classification group
function createGroupToggles(classificationName) {
  const classification = classifier.list.get(classificationName);
  if (!classification) return [];

  const checkboxes = [];
  for (const [groupName, groupData] of classification) {
    const onChange = async function(event) {
      const visible = event.target.checked;
      const items = await groupData.get();
      await hider.set(visible, items);
    };

    checkboxes.push(BUI.html`
      <bim-checkbox 
        label="${groupName}" 
        checked 
        @change=${onChange}>
      </bim-checkbox>
    `);
  }

  return checkboxes;
}

// --------------------------------------------------------------------------
// 4. THE UI: User Interface (BUI)
// --------------------------------------------------------------------------

// Initialize the BUI Manager
BUI.Manager.init();


// Create the UI panel using BUI.Component.create
const [panel, updatePanel] = BUI.Component.create(function(_) {
  // ------------------------------------------------------------------------
  // LECTURE 1: Fundamentals
  // ------------------------------------------------------------------------
  async function onLoadIfc ({ target }) {
    target.label = "Conversion in progress...";
    target.loading = true;
    await loadIfc("./assets/small.ifc");
    target.loading = false;
    target.label = "Load IFC";
    updatePanel(); // Refresh UI to show classification groups
  }

  let downloadBtn = undefined;
  if (fragments.list.size > 0) {
    downloadBtn = BUI.html`
      <bim-button label="Download Fragments" @click=${downloadFragments}></bim-button>
    `;
  }

  // ------------------------------------------------------------------------
  // LECTURE 2: Advanced Tools and Features
  // ------------------------------------------------------------------------

  const toggleClippingsBtn = BUI.html`
    <bim-button label="Toggle Clippings" @click=${toggleClippings}></bim-button>
  `;

  const deleteAllClippingsBtn = BUI.html`
    <bim-button label="Delete All" @click=${deleteAllClippings}></bim-button>
  `;

  const categoryToggles = createGroupToggles("Categories");
  const levelToggles = createGroupToggles("Levels");

  // ------------------------------------------------------------------------
  // LECTURES 1 & 2: Panel
  // ------------------------------------------------------------------------
  return BUI.html`
    <div class="options-menu options-menu-visible">
      <bim-panel active label="IFC Viewer">
        <bim-panel-section label="Controls">
          <bim-button label="Load IFC" @click=${onLoadIfc}></bim-button>
          ${downloadBtn}
        </bim-panel-section>
        
        <bim-panel-section label="Categories">
          ${categoryToggles.length > 0 
            ? categoryToggles 
            : BUI.html`<bim-label>Load a model first</bim-label>`}
        </bim-panel-section>
        
        <bim-panel-section label="Levels">
          ${levelToggles.length > 0 
            ? levelToggles 
            : BUI.html`<bim-label>Load a model first</bim-label>`}
        </bim-panel-section>
        
        <bim-panel-section label="Clipping">
          ${toggleClippingsBtn}
          ${deleteAllClippingsBtn}
          <bim-label>Dbl-click: Create clipping plane</bim-label>
          <bim-label>Backspace: Delete clipping plane</bim-label>
        </bim-panel-section>
      </bim-panel>
    </div>
  `;
}, {});

// Append the panel to the document body
document.body.append(panel);

// Update the panel when a fragment is loaded
fragments.list.onItemSet.add(function() { updatePanel(); });
