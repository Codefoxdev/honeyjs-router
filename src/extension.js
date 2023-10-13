import { Extension } from "@honeyjs/core/internal";

export const extension = new Extension({
  package: "@honeyjs/router",
  alias: "router",
});

extension.injectCSS(/*css*/`
[wrapper=transition] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
[filler=""] {
  display: block;
}
`)