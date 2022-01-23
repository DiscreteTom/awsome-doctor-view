<template>
  <div>
    <div class="d-flex align-center">
      <h2>Editing workflow:</h2>
      <!-- title -->
      <v-text-field
        label="Workflow Title"
        placeholder="Ping is not working."
        v-model="title"
        hide-details
        class="ml-3"
        outlined
        dense
      />

      <!-- toolbar -->
      <div class="d-flex align-center ml-3">
        <tt-btn
          bottom
          @click="saveFile"
          class="ml-3"
          tt="Export New YAML File"
          icon="mdi-content-save-outline"
        />
        <tt-btn
          bottom
          @click="openFile"
          class="ml-3"
          tt="Load From YAML File"
          icon="mdi-folder-open-outline"
        />
        <tt-btn
          bottom
          @click="openUrlDialog = true"
          class="ml-3"
          tt="Open From URL"
          icon="mdi-file-import-outline"
        />
        <tt-btn
          bottom
          @click="reset"
          class="ml-3"
          tt="Reset Editor"
          icon="mdi-delete-outline"
        />
      </div>
    </div>

    <v-divider class="my-2" />

    <v-row>
      <v-col :cols="testAtBottom ? 12 : 6">
        <v-expansion-panels multiple accordion>
          <!-- description -->
          <v-expansion-panel>
            <v-expansion-panel-header> Description </v-expansion-panel-header>
            <v-expansion-panel-content>
              <code-editor
                :dark="editorDark"
                v-model="description"
                height="200"
                lang="markdown"
                :showInvisibles="editorShowInvisible"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- data -->
          <v-expansion-panel>
            <v-expansion-panel-header> Data </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                v-for="(data, i) in workflowData"
                :key="i"
                class="align-center"
                dense
              >
                <v-col cols="3">
                  <v-text-field label="Key" v-model="data.key" hide-details />
                </v-col>
                <v-col>
                  <v-text-field
                    label="Initial Value (YAML)"
                    v-model="data.value"
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    label="Rendered (YAML)"
                    :value="renderYaml(data.key, data.value)"
                    hide-details
                    disabled
                  />
                </v-col>
                <v-col cols="1" class="d-flex justify-center">
                  <tt-btn
                    tt="Remove Data"
                    icon="mdi-close"
                    @click="removeData(i)"
                    top
                  />
                </v-col>
              </v-row>
              <v-btn @click="addData" class="mt-3">Add Data</v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- inputs -->
          <v-expansion-panel>
            <v-expansion-panel-header> Inputs </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                v-for="(input, i) in inputs"
                :key="i"
                class="align-center"
                dense
              >
                <v-col>
                  <v-text-field
                    label="Label"
                    v-model="input.label"
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    label="Placeholder"
                    v-model="input.placeholder"
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-select
                    label="Store"
                    v-model="input.store"
                    :items="workflowData.map((d) => d.key)"
                    hide-details
                  />
                </v-col>
                <v-col cols="1" class="d-flex justify-center">
                  <tt-btn
                    tt="Remove Input"
                    icon="mdi-close"
                    @click="removeInput(i)"
                    top
                  />
                </v-col>
              </v-row>
              <v-btn @click="addInput" class="mt-3">Add Input</v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- steps -->
          <v-expansion-panel>
            <v-expansion-panel-header> Steps </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                v-for="(step, i) in steps"
                :key="i"
                class="align-center"
                dense
              >
                <v-col cols="3">
                  <v-text-field label="Name" v-model="step.name" hide-details />
                </v-col>
                <v-col>
                  <code-editor
                    :dark="editorDark"
                    v-model="step.js"
                    height="200"
                    :showInvisibles="editorShowInvisible"
                  />
                </v-col>
                <v-col cols="1" class="d-flex flex-column align-center">
                  <tt-btn
                    tt="Remove Step"
                    icon="mdi-close"
                    @click="removeStep(i)"
                    top
                  />
                  <tt-btn
                    tt="Expand"
                    icon="mdi-arrow-expand"
                    @click="expand(i)"
                    top
                  />
                  <tt-btn
                    tt="Format Code"
                    icon="mdi-code-json"
                    @click="formatCode(i)"
                    top
                  />
                </v-col>
              </v-row>

              <div class="d-flex">
                <v-btn @click="addStep" class="mt-3">Add Step</v-btn>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <v-switch
                        class="ml-3"
                        v-model="editorDark"
                        inset
                        hide-details
                        color="black"
                      ></v-switch>
                    </span>
                  </template>
                  <span>Dark Mode</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <v-switch
                        class="ml-3"
                        v-model="editorShowInvisible"
                        inset
                        hide-details
                        color="white"
                      ></v-switch>
                    </span>
                  </template>
                  <span>Show Invisibles</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <v-switch
                        class="ml-3"
                        v-model="editorAutoFormat"
                        inset
                        hide-details
                        color="yellow"
                      ></v-switch>
                    </span>
                  </template>
                  <span>Format on Save</span>
                </v-tooltip>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- test -->
        <v-card v-if="testAtBottom" class="mt-3">
          <v-card-title>
            <span class="mr-3"> Test </span>
            <tt-btn
              tt="Move To Right"
              icon="mdi-dock-right"
              top
              @click="testAtBottom = false"
            />
          </v-card-title>
          <v-card-text>
            <workflow-executor :workflow="computedWorkflow" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" v-if="!testAtBottom">
        <v-card>
          <v-card-title>
            <span class="mr-3"> Test </span>
            <tt-btn
              tt="Move To Bottom"
              icon="mdi-dock-bottom"
              top
              @click="testAtBottom = true"
            />
          </v-card-title>
          <v-card-text>
            <workflow-executor :workflow="computedWorkflow" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="fullscreenEdit"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card
        v-if="fullscreenEdit"
        class="d-flex flex-column"
        style="height: 100vh"
      >
        <v-toolbar dark class="flex-grow-0">
          <tt-btn
            tt="Exit Fullscreen"
            icon="mdi-close"
            @click="fullscreenEdit = false"
            bottom
          />
          <v-toolbar-title class="ml-3">
            Editing Workflow:
            <span class="text-decoration-underline">
              {{ title || "Untitled workflow" }}
            </span>
            Step:
            <span class="text-decoration-underline">
              {{ steps[editingIndex].name || "Untitled step" }}
            </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorDark"
                  inset
                  hide-details
                  color="black"
                ></v-switch>
              </span>
            </template>
            <span>Dark Mode</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorShowInvisible"
                  inset
                  hide-details
                  color="white"
                ></v-switch>
              </span>
            </template>
            <span>Show Invisibles</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorAutoFormat"
                  inset
                  hide-details
                  color="yellow"
                ></v-switch>
              </span>
            </template>
            <span>Format on Save</span>
          </v-tooltip>
          <tt-btn
            tt="Decrease Font Size"
            icon="mdi-format-font-size-decrease"
            @click="changeEditorFontSize(-1)"
            bottom
          />
          <tt-btn
            tt="Increase Font Size"
            icon="mdi-format-font-size-increase"
            @click="changeEditorFontSize(1)"
            bottom
          />
          <tt-btn
            tt="Format Code"
            icon="mdi-code-json"
            @click="formatCode(editingIndex)"
            bottom
          />
        </v-toolbar>
        <code-editor
          ref="fullScreenCodeEditor"
          class="flex-grow-1"
          :scrollPastEnd="1"
          :dark="editorDark"
          :value="steps[editingIndex].js"
          @input="steps[editingIndex].js = $event"
          :showInvisibles="editorShowInvisible"
        />
      </v-card>
    </v-dialog>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @input="fileChosen"
    />

    <v-dialog v-model="openUrlDialog">
      <v-card>
        <v-card-title>Open from URL</v-card-title>
        <v-card-subtitle style="color: red"
          >External workflows might be dangerous.</v-card-subtitle
        >
        <v-card-text>
          <v-text-field
            v-model="externalUrl"
            label="URL"
            placeholder="https://example.com"
          />
          <v-alert v-if="openUrlDialogErr !== null" type="error">
            {{ openUrlDialogErr }}
          </v-alert>
          <v-btn
            @click="openExternalUrl"
            color="primary"
            :loading="openingExternalUrl"
          >
            Open
          </v-btn>
          <v-btn @click="openUrlDialog = false" class="mx-3"> Close </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CodeEditor from "../components/CodeEditor.vue";
import TtBtn from "../components/TtBtn.vue";
import WorkflowExecutor from "../components/WorkflowExecutor.vue";
import yaml from "js-yaml";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

const defaultData = {
  title: "",
  description: "### Markdown Here",
  workflowData: [],
  inputs: [],
  steps: [],
  fullscreenEdit: false,
  editingIndex: 0,
  editorDark: true,
  editorShowInvisible: true,
  openUrlDialog: false,
  externalUrl: "",
  openUrlDialogErr: null,
  openingExternalUrl: false,
  editorAutoFormat: true,
  testAtBottom: false,
  fileHandle: null,
};

// Ref: https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

// Ref: https://web.dev/file-system-access/
async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

export default {
  components: { TtBtn, CodeEditor, WorkflowExecutor },
  data() {
    return JSON.parse(JSON.stringify(defaultData)); // copy
  },
  methods: {
    reset() {
      let data = JSON.parse(JSON.stringify(defaultData)); // copy
      for (let key in data) {
        this[key] = data[key];
      }
    },
    openExternalUrl() {
      this.openUrlDialogErr = null;
      this.openingExternalUrl = true;
      this.$axios
        .get(this.externalUrl)
        .then((res) => {
          this.applyYaml(res.data);
          this.openUrlDialog = false;
          this.externalUrl = "";
          this.openingExternalUrl = false;
        })
        .catch((e) => {
          this.openUrlDialogErr = e;
          this.openingExternalUrl = false;
        });
    },
    changeEditorFontSize(n) {
      this.$store.commit("updateConfig", {
        editorFontSize: this.$store.state.editorFontSize + n,
      });
      this.$refs.fullScreenCodeEditor.setFontSize(
        this.$store.state.editorFontSize
      );
    },
    addData() {
      this.workflowData.push({ key: "", value: "''" });
    },
    addInput() {
      this.inputs.push({ label: "", placeholder: "", store: "" });
    },
    addStep() {
      this.steps.push({ name: "", js: "" });
    },
    removeData(index) {
      let result = [];
      for (let i = 0; i < this.workflowData.length; ++i) {
        if (i != index) {
          result.push(this.workflowData[i]);
        }
      }
      this.workflowData = result;
    },
    removeInput(index) {
      let result = [];
      for (let i = 0; i < this.inputs.length; ++i) {
        if (i != index) {
          result.push(this.inputs[i]);
        }
      }
      this.inputs = result;
    },
    removeStep(index) {
      let result = [];
      for (let i = 0; i < this.steps.length; ++i) {
        if (i != index) {
          result.push(this.steps[i]);
        }
      }
      this.steps = result;
    },
    async saveFile() {
      if (this.editorAutoFormat) {
        this.formatAllCode();
      }

      if (this.fileHandle === null && window.showSaveFilePicker !== undefined) {
        // chrome, use File System Access API
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: `${this.title || "workflow"}.yml`,
            types: [
              {
                description: "YAML Workflow",
                accept: {
                  "text/yaml": [".yml", ".yaml"],
                },
              },
            ],
          });
          if (handle) {
            this.fileHandle = handle;
          }
        } catch {
          // canceled
          return;
        }
      }

      if (this.fileHandle) {
        this.$bus.$emit("append-msg", "Saving workflow...");
        await writeFile(this.fileHandle, yaml.dump(this.computedWorkflow));
        this.$bus.$emit("append-msg", "Saved");
      } else {
        // not chrome, traditional download
        download(yaml.dump(this.computedWorkflow), "workflow.yml", "yml");
      }
    },
    formatAllCode() {
      for (let i = 0; i < this.steps.length; ++i) {
        this.formatCode(i);
      }
    },
    expand(i) {
      this.editingIndex = i;
      this.fullscreenEdit = true;
      this.$nextTick(() => {
        this.$refs.fullScreenCodeEditor.setFontSize(
          this.$store.state.editorFontSize
        );
      });
    },
    formatCode(stepIndex) {
      this.steps[stepIndex].js = prettier.format(this.steps[stepIndex].js, {
        parser: "babel",
        plugins: [babelParser],
      });
    },
    async openFile() {
      if (window.showOpenFilePicker !== undefined) {
        // chrome, use File System Access API
        let fileHandle;
        try {
          [fileHandle] = await window.showOpenFilePicker();
        } catch {
          // canceled
          return;
        }
        if (fileHandle) {
          this.fileHandle = fileHandle;
          const file = await fileHandle.getFile();
          const contents = await file.text();
          this.applyYaml(contents);
        }
      } else {
        // not chrome, traditional file picker
        this.$refs.fileInput.click();
      }
    },
    fileChosen(event) {
      let file = event.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
          this.applyYaml(evt.target.result);
        };
      }
      this.$refs.fileInput.value = null;
    },
    renderYaml(key, value) {
      try {
        let result = {};
        result[key] = yaml.load(value);
        return yaml.dump(result, { flowLevel: 1 });
      } catch (e) {
        return e;
      }
    },
    handleKeyDown(e) {
      // ctrl s
      if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        this.saveFile();
      }
    },
    applyYaml(txt) {
      let content = yaml.load(txt);
      this.title = content.title;
      this.workflowData = [];
      for (let key in content.data) {
        this.workflowData.push({
          key,
          value: yaml.dump(content.data[key]),
        });
      }
      this.inputs = content.input;
      this.steps = content.steps;
      this.description = content.description || "";
    },
  },
  computed: {
    computedWorkflow() {
      let result = {
        title: this.title,
        description: this.description,
        data: {},
        input: this.inputs,
        steps: this.steps,
      };
      this.workflowData.forEach((d) => {
        try {
          result.data[d.key] = yaml.load(d.value);
        } catch (e) {
          result.data[d.key] = e;
        }
      });
      return result;
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.editorDark = this.$store.state.editorDarkMode;
    this.editorShowInvisible = this.$store.state.editorShowInvisibles;
    this.editorAutoFormat = this.$store.state.editorAutoFormat;
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  watch: {
    editorDark(val) {
      this.$store.commit("updateConfig", { editorDarkMode: val });
    },
    editorShowInvisible(val) {
      this.$store.commit("updateConfig", { editorShowInvisibles: val });
    },
    editorAutoFormat(val) {
      this.$store.commit("updateConfig", { editorAutoFormat: val });
    },
  },
};
</script>
