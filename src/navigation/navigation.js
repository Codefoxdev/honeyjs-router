import { createEffect } from "@honeyjs/core";
import { useLocation } from "./history.js";

const paths = [];

export function registerPath(path, callback) {
  paths.push({
    path, callback
  });
}

// TODO: maybe add event for this?
createEffect(() => {
  const path = useLocation().pathname;
  const resolved = paths.find(e => e.path == path);
  resolved?.callback();
  // TODO: Handle non-existing route
});