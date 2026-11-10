import { describe, expect, it } from "vitest";

import { slugify } from "./utils";

describe("slugify", () => {
  it("strips accents, symbols, and repeated spaces", () => {
    expect(slugify("  Kestrel 400  Edición Ñ ")).toBe("kestrel-400-edicion-n");
  });

  it("does not leave leading or trailing hyphens", () => {
    expect(slugify("--Ridge 1500!!--")).toBe("ridge-1500");
  });
});
