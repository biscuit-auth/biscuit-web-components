import init from '@geal/biscuit-component-wasm';

let loadPromise = null;
export async function initialize() {
  if(loadPromise == null) {
    console.log("will create wasm promise");
    loadPromise = init();
  }
  console.log("returning wasm promise");

  return loadPromise;

}
