import init from "@biscuit-auth/biscuit-wasm-support";

let loadPromise = null;
export async function initialize() {
  if (loadPromise == null) {
    console.debug("will create wasm promise");
    loadPromise = init();
  }
  console.debug("returning wasm promise");

  return loadPromise;
}
