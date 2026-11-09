import { describe, expect, it } from "vitest";

import { slugify } from "./utils";

describe("slugify", () => {
  it("quita acentos, símbolos y espacios repetidos", () => {
    expect(slugify("  Kestrel 400  Edición Ñ ")).toBe("kestrel-400-edicion-n");
  });

  it("no deja guiones al inicio ni al final", () => {
    expect(slugify("--Ridge 1500!!--")).toBe("ridge-1500");
  });
});
