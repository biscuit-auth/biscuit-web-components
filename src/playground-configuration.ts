export enum ConfigurationEntry {
  export = "export",
  third_party = "third_party",
  token = "token",
  facts = "facts",
  custom_external = "custom_external",
  regenerate = "regenerate",
  public_key = "public_key",
  result = "result",
  add_block = "add_block",
  authorizer = "authorizer",
  blocks = "blocks",
  root = "root"
}

class ConfigValue {
  value: boolean
  label: string
  parent: ConfigurationEntry

  constructor(label: string, parent: ConfigurationEntry = ConfigurationEntry.root) {
    this.value = false
    this.label = label
    this.parent = parent
  }
}

export class Configuration {
  configuration: Map<string, ConfigValue>;

  constructor() {
    this.configuration  = new Map([
      [ConfigurationEntry.authorizer, new ConfigValue("Display Authorizer")],
      [ConfigurationEntry.export, new ConfigValue("Display export button")],
      [ConfigurationEntry.facts, new ConfigValue("Display authorizer world")],
      [ConfigurationEntry.result, new ConfigValue("Display Authorizer result")],
      [ConfigurationEntry.token, new ConfigValue("Display serialized token")],
      [ConfigurationEntry.blocks, new ConfigValue("Display blocks editor")],
      [ConfigurationEntry.custom_external, new ConfigValue("Allow to customize private keys",ConfigurationEntry.blocks)],
      [ConfigurationEntry.regenerate, new ConfigValue("Allow regenerate Biscuit private key",ConfigurationEntry.blocks)],
      [ConfigurationEntry.public_key, new ConfigValue("Show public key button",ConfigurationEntry.blocks)],
      [ConfigurationEntry.add_block, new ConfigValue("Display Add Block button",ConfigurationEntry.blocks)],
      [ConfigurationEntry.third_party, new ConfigValue("Allow 3rd party blocks",ConfigurationEntry.blocks)],
    ])
  }

  setData(key: string, value: boolean) {
    let entry = this.configuration.get(key);
    if (entry !== undefined) {
      entry.value = value
      this.configuration.set(key, entry);
    }
  }

  get(key: string) : boolean | undefined{
    return this.configuration?.get(key)?.value
  }

  resetChildren(key: string) {
    this.configuration.forEach(({parent}, child_key) => {
      if (parent === key) {
        this.resetChildren(child_key)
        this.setData(child_key, false)
      }
    })
  }

  set(key: string, value: boolean) {

    this.setData(key, value)

    // reset child value
    if (!value) {
        this.resetChildren(key)
    }
  }

  fromUrl(params: URLSearchParams) {
    params.forEach((value, param) => {
      this.setData(param, value === '1')
    })
  }

  exportUrl(urlParams: URLSearchParams) {

    this.configuration.forEach((configEntry, key) => {
      if (configEntry.value) {
        urlParams.set(key, "1")
      }
    })
  }

  toString() : string {

    let obj: {[k: string]: any} = {};

    let data = Array.from(
      this.configuration.entries()
    ).reduce((map, [key, value]) => {
      map[key] = value.value;
      return map
    }, obj)

    return JSON.stringify(
        data
    )
  }

  static fromString(raw_data: string) : Configuration {

    let configuration = new Configuration();

    let data = Object.entries(JSON.parse(raw_data));

    for (let [key, value] of data) {

      if (typeof value === "boolean") {
        configuration.set(key, value)
      }
    }

    return configuration
  }
}