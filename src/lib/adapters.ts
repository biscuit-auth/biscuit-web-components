export type LibMarker = {
  position: {
    start: number;
    end: number;
  };
  ok: boolean;
};

export type CMMarker = {
  start: number;
  end: number;
  ok: boolean;
};

export const convertMarker = (marker: LibMarker) => {
  return {
    start: marker.position.start,
    end: marker.position.end,
    ok: marker.ok,
  };
};

export type LibError = {
  message: string;
  position: { start: number; end: number };
};

export const convertError = (error: LibError) => {
  return {
    message: error.message,
    severity: "error",
    start: error.position.start,
    end: error.position.end,
  };
};

export type Result<A, E> = {
  Ok?: A;
  Err?: E;
};

export type AuthorizerError = {
  authorizer: Array<LibError>;
  blocks: Array<Array<LibError>>;
};

export type Fact = {
  name: string;
  terms: Array<string>;
};

export type LogicError = {
  Deny?: number;
  FailedChecks?: Array<{
    Block: {
      block_id: number;
      check_id: number;
      rule: string;
    };
  }>;
};

export type AuthorizerResult = {
  authorizer_editor: {
    markers: Array<LibMarker>;
  };
  authorizer_result: Result<
    number,
    {
      FailedLogic?: LogicError;
    }
  >;
  authorizer_world: Array<Fact>;
  token_blocks: Array<{ markers: Array<LibMarker> }>;
};
