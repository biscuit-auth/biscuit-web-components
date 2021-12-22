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
