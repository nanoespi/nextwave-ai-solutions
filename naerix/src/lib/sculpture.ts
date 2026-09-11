type Point = [number, number, number];
type Surface = { points: Point[]; color: string; depth: number };

/** Shared by static HTML and the browser so the first animated frame matches the artwork. */
export function createSculptureFaces(yaw = 0) {
  const surfaces: Surface[] = [];
  const project = ([x, y, z]: Point) =>
    `${(320 + (x - z) * 0.94).toFixed(2)},${(343 - y * 0.92 + (x + z) * 0.35).toFixed(2)}`;
  const addSurface = (points: Point[], color: string) => {
    surfaces.push({
      points,
      color,
      depth: points.reduce((sum, [x, y, z]) => sum + x + z + y * 3.8, 0) / points.length,
    });
  };

  for (let layer = 0; layer < 19; layer++) {
    const rotation = -0.16 + layer * 0.054 + yaw;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const height = -158 + layer * 17.5;
    const vertex = (x: number, z: number, y: number): Point => [
      x * cosine - z * sine,
      y,
      x * sine + z * cosine,
    ];
    const corners = [
      [-141, -141],
      [141, -141],
      [141, 141],
      [-141, 141],
    ];
    const inner = corners.map(([x, z]) => [x * 0.47, z * 0.47]);

    for (let side = 0; side < 4; side++) {
      const next = (side + 1) % 4;
      const [x, z] = corners[side],
        [nx, nz] = corners[next];
      const [ix, iz] = inner[side],
        [inx, inz] = inner[next];
      const brightness = Math.round(
        178 + 25 * Math.sin(rotation + (side * Math.PI) / 2) + layer * 1.7,
      );
      addSurface(
        [
          vertex(x, z, height + 7),
          vertex(nx, nz, height + 7),
          vertex(inx, inz, height + 7),
          vertex(ix, iz, height + 7),
        ],
        `rgb(${brightness},${brightness + 1},${brightness - 7})`,
      );
      const shade = Math.round(
        78 + 62 * Math.max(0, Math.cos(rotation + (side * Math.PI) / 2)) + layer * 1.5,
      );
      addSurface(
        [
          vertex(x, z, height),
          vertex(nx, nz, height),
          vertex(nx, nz, height + 7),
          vertex(x, z, height + 7),
        ],
        `rgb(${shade},${shade + 3},${shade - 2})`,
      );
      addSurface(
        [
          vertex(ix, iz, height),
          vertex(inx, inz, height),
          vertex(inx, inz, height + 7),
          vertex(ix, iz, height + 7),
        ],
        `rgb(${shade - 24},${shade - 21},${shade - 28})`,
      );
    }
  }

  // Recompute visibility and lighting as the actual object rotates, not its flat SVG plane.
  return surfaces
    .sort((a, b) => a.depth - b.depth)
    .map((surface) => ({
      points: surface.points.map(project).join(' '),
      color: surface.color,
    }));
}
