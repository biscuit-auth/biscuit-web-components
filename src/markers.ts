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
