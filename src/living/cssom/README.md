# CSSOM

This directory is an implementation of the [CSS Object Model][] with supports for Spatial CSS.

> Thanks to the projects:
> - [rrweb-io/CSSOM][]
> - [jsdom/cssstyle][]
>
> The CSSOM in JSAR-DOM is a [TypeScript][] reimplementation based on the above projects.

## Changes on CSSOM

In this section, we will introduce the changes on CSSOM in JSAR-DOM.

### `CSSSpatialStyleDeclaration`

The `CSSSpatialStyleDeclaration` is a class just like `CSSStyleDeclaration` in [jsdom/cssstyle][], but for Spatial CSS. For example, it supports:

- `@texture` at-rule with the following texture related properties:
  - `type: none | image | video | canvas` represents the type of the texture.
  - `src: <url>` represents the source of the texture.
  - `repeat: no-repeat | repeat | repeat-x | repeat-y` represents the repeat mode of the texture.
  - `offset: <number> <number>` represents the offset of the texture.
- `@material` at-rule with the following material related properties:
  - `type: none | phong | lambert | standard | physical | toon | matcap | points` represents the type of the material
  - `diffuse-color: <color>` represents the diffuse color for phong, lambert and standard material
  - `specular-color: <color>` represents the specular color for phong, lambert and standard material
  - `emissive-color: <color>` represents the emissive color for phong, lambert and standard material
  - `shininess: <number>` represents the shininess for phong, lambert and standard material
  - `roughness: <number>` represents the roughness for physical material
  - ... any other properties for the material?
- some spatial properties in CSS rule:
  - `position: x, y, z` represents the position of the element
  - `rotation: x, y, z` represents the rotation of the element
  - `rotation: x, y, z, w` represents the quaternion rotation of the element
  - `scale: x, y, z` represents the scale of the element
  - `pivot: x, y, z` represents the pivot of the element
  - `anchor: x, y, z` represents the anchor of the element
  - `material: <string>` represents the material of the element

### `CSSSpatialStyleRule`

The `CSSSpatialStyleRule` is a subclass of `CSSRule` which owns a `CSSSpatialStyleDeclaration` member, it's used to represent a spatial CSS rule in the CSSOM, just like `CSSStyleRule` for normal CSS rule.

### `CSSMaterialRule`

The `CSSMaterialRule` is a subclass of `CSSRule` which describes a material definition by a `@material` at-rule, and the material defined by the rule can be referenced by the `material` property in `CSSSpatialStyleDeclaration`.

```css
@material my-material {
  type: standard;
  diffuse-color: #ff0000;
  specular-color: #ffffff;
  emissive-color: #000000;
}
.my-element {
  material: "my-material";
}
```

[CSS Object Model]: https://drafts.csswg.org/cssom/
[TypeScript]: https://www.typescriptlang.org/
[rrweb-io/CSSOM]: https://github.com/rrweb-io/CSSOM
[jsdom/cssstyle]: https://github.com/jsdom/cssstyle
