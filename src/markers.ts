export type LibMarker = {
  position: {
    line_start: number;
    column_start: number;
    line_end: number;
    column_end: number;
    start: number;
    end: number;
  };
  ok: boolean;
};

export type CMMarker = {
  from: { line: number; ch: number };
  to: { line: number; ch: number };
  start: number;
  end: number;
  ok: boolean;
};

export const convertMarker = (marker: LibMarker) => {
  return {
    from: {
      line: marker.position.line_start,
      ch: marker.position.column_start,
    },
    to: { line: marker.position.line_end, ch: marker.position.column_end },
    start: marker.position.start,
    end: marker.position.end,
    ok: marker.ok,
  };
};

export type LibError = {
  message: string;
  position: { start: number; end: number; line_start: number };
};

export const convertError = (error: LibError) => {
  return {
    message: error.message,
    severity: "error",
    line_start: error.position.line_start,
    from: error.position.start,
    to: error.position.end,
  };
};
