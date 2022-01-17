export default {
  state() {
    return {
      region: "us-east-1",
      tempAk: "",
      tempSk: "",
      editorFontSize: 10,
      editorDarkMode: true,
      editorShowInvisibles: true,
      editorAutoFormat: true,
    };
  },
  mutations: {
    /**
     * update config & persist config to file
     */
    updateConfig(state, config) {
      for (let key in state) {
        if (config[key] !== null && config[key] !== undefined) {
          state[key] = config[key];
        }
      }
    },
  },
};
