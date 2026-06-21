import { expect, test, describe } from "bun:test";
import { Sigil } from "../src/index.js";

describe("Validator Engine", () => {
  test("primitives", () => {
    const isString = Sigil`string`;
    expect(isString.check("hello")).toBe(true);
    expect(isString.check(42)).toBe(false);

    const isNumber = Sigil`number`;
    expect(isNumber.check(42)).toBe(true);
    expect(isNumber.check("42")).toBe(false);
  });

  test("literals", () => {
    const isFoo = Sigil`"foo"`;
    expect(isFoo.check("foo")).toBe(true);
    expect(isFoo.check("bar")).toBe(false);
  });

  test("unions", () => {
    const isStringOrNumber = Sigil`string | number`;
    expect(isStringOrNumber.check("hello")).toBe(true);
    expect(isStringOrNumber.check(42)).toBe(true);
    expect(isStringOrNumber.check(true)).toBe(false);
  });

  test("arrays", () => {
    const isNumberArray = Sigil`number[]`;
    expect(isNumberArray.check([1, 2, 3])).toBe(true);
    expect(isNumberArray.check([1, "2", 3])).toBe(false);
    expect(isNumberArray.check("not array")).toBe(false);
  });

  test("optional", () => {
    const isOptString = Sigil`string?`;
    expect(isOptString.check("yes")).toBe(true);
    expect(isOptString.check(undefined)).toBe(true);
    expect(isOptString.check(null)).toBe(false);
  });

  test("objects", () => {
    const userSchema = Sigil`{ name: string, age?: number }`;
    expect(userSchema.check({ name: "Dan" })).toBe(true);
    expect(userSchema.check({ name: "Dan", age: 30 })).toBe(true);
    expect(userSchema.check({ name: "Dan", age: "30" })).toBe(false);
    expect(userSchema.check({ age: 30 })).toBe(false);
    expect(userSchema.check("not object")).toBe(false);
  });

  test("complex nested", () => {
    const postSchema = Sigil`{ 
      title: string, 
      tags: string[], 
      author?: { name: string } 
    }`;
    expect(postSchema.check({
      title: "Hello",
      tags: ["news", "update"],
    })).toBe(true);
    
    expect(postSchema.check({
      title: "Hello",
      tags: ["news"],
      author: { name: "Alice" }
    })).toBe(true);

    expect(postSchema.check({
      title: "Hello",
      tags: [1, 2]
    })).toBe(false);
  });

  test("memoization", () => {
    const schema1 = Sigil`string | number`;
    const schema2 = Sigil`string | number`;
    expect(schema1).toBe(schema2); // Same object reference from cache
  });
});
