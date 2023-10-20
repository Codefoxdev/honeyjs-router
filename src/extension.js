import { Extension } from "@honeyjs/core/internal";

export const extension = new Extension({
  package: "@honeyjs/router",
  alias: "router",
});

extension.injectCSS(/*css*/`
div.Navigator {
  --offset: 0px;
  display: flex;
  overflow-x: hidden;
  margin-left: var(--offset);
}
[data-type="honey-screen"] {
  min-width: 100vw;
  position: relative;
}
`)