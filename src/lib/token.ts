import { GeneratorError, LibError, Result } from "./adapters";
import { generate_token } from "@biscuit-auth/biscuit-wasm-support";

interface Query {
  token_blocks: Array<string | null>,
  private_key: string | null,
  external_private_keys: Array<string|null>,
}

interface TokenResult {
  token: string,
  result: Result<string, GeneratorError>
}

export function token_from_query(query: Query) : TokenResult {
  let result: Result<string, GeneratorError>;

  try {
    result = {
      Ok: generate_token(query),
    };
  } catch (error) {
    result = { Err: error as GeneratorError };
  }

  const blocksWithErrors: Array<number> = [];
  (result.Err?.Parse?.blocks ?? []).forEach(
    (errors: Array<LibError>, bId: number) => {
      if (errors.length > 0) {
        blocksWithErrors.push(bId);
      }
    }
  );

  let errorMessage = "Please correct the datalog input";

  if (result.Err?.Biscuit === "InternalError") {
    errorMessage = "Please provide an authority block";
  } else if (
    typeof result.Err?.Biscuit === "object" &&
    result.Err?.Biscuit?.Format?.InvalidKeySize !== undefined
  ) {
    errorMessage = "Please enter (or generate) a valid private key";
  } else if (blocksWithErrors.length > 0) {
    const blockList = blocksWithErrors
      .map((bId) => (bId === 0 ? "authority" : bId.toString()))
      .join(", ");
    errorMessage =
      "Please correct the datalog input on the following blocks: " +
      blockList;
  }

  const token = result.Ok ?? errorMessage;
  return {
    token,
    result
  }
}