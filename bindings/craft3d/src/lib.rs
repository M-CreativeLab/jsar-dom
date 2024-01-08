#![allow(non_snake_case)]
#![deny(unsafe_code)]
#![forbid(unsafe_code)]

pub mod compute;
pub mod geometry;
pub mod prelude;
pub mod style;
pub mod style_helpers;
pub mod tree;
pub mod util;

use js_sys::Reflect;
use prelude::NodeId;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;

pub use crate::style::Style;
pub use crate::tree::traits::*;
pub use crate::tree::Craft3dTree;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignItems {
  Start,
  End,
  FlexStart,
  FlexEnd,
  Center,
  Baseline,
  Stretch,
}

impl Into<crate::style::AlignItems> for AlignItems {
  fn into(self) -> crate::style::AlignItems {
    match self {
      AlignItems::FlexStart => crate::style::AlignItems::FlexStart,
      AlignItems::FlexEnd => crate::style::AlignItems::FlexEnd,
      AlignItems::Start => crate::style::AlignItems::Start,
      AlignItems::End => crate::style::AlignItems::End,
      AlignItems::Center => crate::style::AlignItems::Center,
      AlignItems::Baseline => crate::style::AlignItems::Baseline,
      AlignItems::Stretch => crate::style::AlignItems::Stretch,
    }
  }
}

impl From<i32> for AlignItems {
  fn from(n: i32) -> Self {
    match n {
      0 => AlignItems::Start,
      1 => AlignItems::End,
      2 => AlignItems::FlexStart,
      3 => AlignItems::FlexEnd,
      4 => AlignItems::Center,
      5 => AlignItems::Baseline,
      6 => AlignItems::Stretch,
      _ => AlignItems::Start,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignSelf {
  FlexStart,
  FlexEnd,
  Start,
  End,
  Center,
  Baseline,
  Stretch,
}

impl Into<crate::style::AlignSelf> for AlignSelf {
  fn into(self) -> crate::style::AlignSelf {
    match self {
      AlignSelf::FlexStart => crate::style::AlignSelf::FlexStart,
      AlignSelf::FlexEnd => crate::style::AlignSelf::FlexEnd,
      AlignSelf::Start => crate::style::AlignSelf::Start,
      AlignSelf::End => crate::style::AlignSelf::End,
      AlignSelf::Center => crate::style::AlignSelf::Center,
      AlignSelf::Baseline => crate::style::AlignSelf::Baseline,
      AlignSelf::Stretch => crate::style::AlignSelf::Stretch,
    }
  }
}

impl From<i32> for AlignSelf {
  fn from(n: i32) -> Self {
    match n {
      0 => AlignSelf::Start,
      1 => AlignSelf::End,
      2 => AlignSelf::Center,
      _ => AlignSelf::Start,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignContent {
  Start,
  End,
  FlexStart,
  FlexEnd,
  Center,
  Stretch,
  SpaceBetween,
  SpaceEvenly,
  SpaceAround,
}

impl Into<crate::style::AlignContent> for AlignContent {
  fn into(self) -> crate::style::AlignContent {
    match self {
      AlignContent::Start => crate::style::AlignContent::Start,
      AlignContent::End => crate::style::AlignContent::End,
      AlignContent::FlexStart => crate::style::AlignContent::FlexStart,
      AlignContent::FlexEnd => crate::style::AlignContent::FlexEnd,
      AlignContent::Center => crate::style::AlignContent::Center,
      AlignContent::Stretch => crate::style::AlignContent::Stretch,
      AlignContent::SpaceBetween => crate::style::AlignContent::SpaceBetween,
      AlignContent::SpaceEvenly => crate::style::AlignContent::SpaceEvenly,
      AlignContent::SpaceAround => crate::style::AlignContent::SpaceAround,
    }
  }
}

impl From<i32> for AlignContent {
  fn from(n: i32) -> Self {
    match n {
      0 => AlignContent::Start,
      1 => AlignContent::End,
      2 => AlignContent::FlexStart,
      3 => AlignContent::FlexEnd,
      4 => AlignContent::Center,
      5 => AlignContent::Stretch,
      6 => AlignContent::SpaceBetween,
      7 => AlignContent::SpaceEvenly,
      8 => AlignContent::SpaceAround,
      _ => AlignContent::Start,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Display {
  Flex,
  None,
}

impl Into<crate::style::Display> for Display {
  fn into(self) -> crate::style::Display {
    match self {
      Display::Flex => crate::style::Display::Flex,
      Display::None => crate::style::Display::None,
    }
  }
}

impl From<i32> for Display {
  fn from(n: i32) -> Self {
    match n {
      0 => Display::Flex,
      1 => Display::None,
      _ => Display::Flex,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FlexDirection {
  Row,
  Column,
  RowReverse,
  ColumnReverse,
  Depth,
  DepthReverse,
}

impl Into<crate::style::FlexDirection> for FlexDirection {
  fn into(self) -> crate::style::FlexDirection {
    match self {
      FlexDirection::Row => crate::style::FlexDirection::Row,
      FlexDirection::Column => crate::style::FlexDirection::Column,
      FlexDirection::RowReverse => crate::style::FlexDirection::Row,
      FlexDirection::ColumnReverse => crate::style::FlexDirection::Column,
      FlexDirection::Depth => crate::style::FlexDirection::Row,
      FlexDirection::DepthReverse => crate::style::FlexDirection::Row,
    }
  }
}

impl From<i32> for FlexDirection {
  fn from(n: i32) -> Self {
    match n {
      0 => FlexDirection::Row,
      1 => FlexDirection::Column,
      2 => FlexDirection::RowReverse,
      3 => FlexDirection::ColumnReverse,
      4 => FlexDirection::Depth,
      5 => FlexDirection::DepthReverse,
      _ => FlexDirection::Row,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Position {
  Relative,
  Absolute,
}

impl Into<crate::style::Position> for Position {
  fn into(self) -> crate::style::Position {
    match self {
      Position::Relative => crate::style::Position::Relative,
      Position::Absolute => crate::style::Position::Absolute,
    }
  }
}

impl From<i32> for Position {
  fn from(n: i32) -> Self {
    match n {
      0 => Position::Relative,
      1 => Position::Absolute,
      _ => Position::Relative,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FlexWrap {
  NoWrap,
  Wrap,
  WrapReverse,
}

impl Into<crate::style::FlexWrap> for FlexWrap {
  fn into(self) -> crate::style::FlexWrap {
    match self {
      FlexWrap::NoWrap => crate::style::FlexWrap::NoWrap,
      FlexWrap::Wrap => crate::style::FlexWrap::Wrap,
      FlexWrap::WrapReverse => crate::style::FlexWrap::WrapReverse,
    }
  }
}

impl From<i32> for FlexWrap {
  fn from(n: i32) -> Self {
    match n {
      0 => FlexWrap::NoWrap,
      1 => FlexWrap::Wrap,
      2 => FlexWrap::WrapReverse,
      _ => FlexWrap::NoWrap,
    }
  }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Overflow {
  Visible,
  Hidden,
  Scroll,
  Clip,
}

impl Into<crate::style::Overflow> for Overflow {
  fn into(self) -> crate::style::Overflow {
    match self {
      Overflow::Visible => crate::style::Overflow::Visible,
      Overflow::Hidden => crate::style::Overflow::Hidden,
      Overflow::Scroll => crate::style::Overflow::Scroll,
      Overflow::Clip => crate::style::Overflow::Clip,
    }
  }
}

impl From<i32> for Overflow {
  fn from(n: i32) -> Self {
    match n {
      0 => Overflow::Visible,
      1 => Overflow::Hidden,
      2 => Overflow::Scroll,
      3 => Overflow::Clip,
      _ => Overflow::Visible,
    }
  }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Allocator {
  craft3d: Rc<RefCell<Craft3dTree>>,
}

#[wasm_bindgen]
impl Allocator {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    util::set_panic_hook();

    Self {
      craft3d: Rc::new(RefCell::new(Craft3dTree::new())),
    }
  }
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct VolumetricLayout {
  #[wasm_bindgen(readonly)]
  pub width: f32,

  #[wasm_bindgen(readonly)]
  pub height: f32,

  #[wasm_bindgen(readonly)]
  pub depth: f32,

  #[wasm_bindgen(readonly)]
  pub x: f32,

  #[wasm_bindgen(readonly)]
  pub y: f32,

  #[wasm_bindgen(readonly)]
  pub z: f32,
}

#[wasm_bindgen]
impl VolumetricLayout {
  fn new(allocator: &Allocator, node: NodeId) -> Self {
    Self {
      // TODO
      width: 0.0,
      height: 0.0,
      depth: 0.0,
      x: 0.0,
      y: 0.0,
      z: 0.0,
    }
  }
}

#[wasm_bindgen]
pub struct Node {
  allocator: Allocator,
  node: NodeId,
  style: JsValue,
  bindObject: JsValue,

  #[wasm_bindgen(readonly)]
  pub childCount: usize,
}

#[wasm_bindgen]
impl Node {
  #[wasm_bindgen(constructor)]
  pub fn new(allocator: &Allocator, bindObject: &JsValue, style: &JsValue) -> Self {
    Self {
      allocator: allocator.clone(),
      node: allocator
        .craft3d
        .borrow_mut()
        .new_leaf(parse_style(&style))
        .unwrap(),
      style: style.clone(),
      bindObject: bindObject.clone(),
      childCount: 0,
    }
  }

  #[wasm_bindgen(getter)]
  pub fn bindObject(&self) -> JsValue {
    self.bindObject.clone()
  }

  #[wasm_bindgen(js_name = addChild)]
  pub fn add_child(&mut self, child: &Node) {
    self
      .allocator
      .craft3d
      .borrow_mut()
      .add_child(self.node, child.node)
      .unwrap();
    self.childCount += 1;
  }

  #[wasm_bindgen(js_name = removeChild)]
  pub fn remove_child(&mut self, child: &Node) {
    self
      .allocator
      .craft3d
      .borrow_mut()
      .remove_child(self.node, child.node)
      .unwrap();
    self.childCount -= 1;
  }

  #[wasm_bindgen(js_name = getStyle)]
  pub fn get_style(&self) -> JsValue {
    self.style.clone()
  }

  #[wasm_bindgen(js_name = setStyle)]
  pub fn set_style(&mut self, style: &JsValue) {
    self
      .allocator
      .craft3d
      .borrow_mut()
      .set_style(self.node, parse_style(style))
      .unwrap();
    self.style = style.clone();
  }

  #[wasm_bindgen(js_name = markDirty)]
  pub fn mark_dirty(&mut self) {
    self
      .allocator
      .craft3d
      .borrow_mut()
      .mark_dirty(self.node)
      .unwrap()
  }

  #[wasm_bindgen(js_name = isDirty)]
  pub fn is_dirty(&self) -> bool {
    self.allocator.craft3d.borrow().dirty(self.node).unwrap()
  }

  #[wasm_bindgen(js_name = isChildless)]
  pub fn is_childless(&mut self) -> bool {
    self.allocator.craft3d.borrow_mut().child_count(self.node) == 0
  }

  #[wasm_bindgen(js_name = computeLayout)]
  pub fn compute_layout(&mut self, size: &JsValue) -> VolumetricLayout {
    self
      .allocator
      .craft3d
      .borrow_mut()
      .compute_layout(
        self.node,
        crate::geometry::Size {
          width: get_available_space(size, "width"),
          height: get_available_space(size, "height"),
        },
      )
      .unwrap();
    VolumetricLayout::new(&self.allocator, self.node)
  }

  #[wasm_bindgen(js_name = getLayout)]
  pub fn get_layout(&mut self) -> VolumetricLayout {
    VolumetricLayout::new(&self.allocator, self.node)
  }
}

fn get_size_dimension(obj: &JsValue, key: &str) -> crate::style::Dimension {
  let dimension = get_dimension(obj, key);
  match dimension {
    crate::style::Dimension::Auto => crate::style::Dimension::Auto,
    _ => dimension,
  }
}

fn get_dimension(obj: &JsValue, key: &str) -> crate::style::Dimension {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      if let Some(number) = val.as_f64() {
        return crate::style::Dimension::Length(number as f32);
      }
      if let Some(string) = val.as_string() {
        if string == "auto" {
          return crate::style::Dimension::Auto;
        }
        if let Ok(number) = string.parse::<f32>() {
          return crate::style::Dimension::Length(number);
        }
        if string.ends_with('%') {
          let len = string.len();
          if let Ok(number) = string[..len - 1].parse::<f32>() {
            return crate::style::Dimension::Percent(number / 100.0);
          }
        }
      }
    }
  }
  crate::style::Dimension::Auto
}

fn get_available_space(obj: &JsValue, key: &str) -> crate::style::AvailableSpace {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      if let Some(number) = val.as_f64() {
        return crate::style::AvailableSpace::Definite(number as f32);
      }
      if let Some(string) = val.as_string() {
        if string == "min" || string == "minContent" {
          return crate::style::AvailableSpace::MinContent;
        }
        if string == "max" || string == "maxContent" {
          return crate::style::AvailableSpace::MaxContent;
        }
        if let Ok(number) = string.parse::<f32>() {
          return crate::style::AvailableSpace::Definite(number);
        }
      }
    }
  }
  crate::style::AvailableSpace::Definite(0.0)
}

fn get_length_percentage_auto_dimension(
  obj: &JsValue,
  key: &str,
) -> crate::style::LengthPercentageAuto {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      if let Some(number) = val.as_f64() {
        return crate::style::LengthPercentageAuto::Length(number as f32);
      }
      if let Some(string) = val.as_string() {
        if string == "auto" {
          return crate::style::LengthPercentageAuto::Auto;
        }
        if let Ok(number) = string.parse::<f32>() {
          return crate::style::LengthPercentageAuto::Length(number);
        }
        if string.ends_with('%') {
          let len = string.len();
          if let Ok(number) = string[..len - 1].parse::<f32>() {
            return crate::style::LengthPercentageAuto::Percent(number / 100.0);
          }
        }
      }
    }
  }
  crate::style::LengthPercentageAuto::Length(0.0)
}

fn get_length_percentage_dimension(obj: &JsValue, key: &str) -> crate::style::LengthPercentage {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      if let Some(number) = val.as_f64() {
        return crate::style::LengthPercentage::Length(number as f32);
      }
      if let Some(string) = val.as_string() {
        if let Ok(number) = string.parse::<f32>() {
          return crate::style::LengthPercentage::Length(number);
        }
        if string.ends_with('%') {
          let len = string.len();
          if let Ok(number) = string[..len - 1].parse::<f32>() {
            return crate::style::LengthPercentage::Percent(number / 100.0);
          }
        }
      }
    }
  }
  crate::style::LengthPercentage::Length(0.0)
}

fn get_i32(obj: &JsValue, key: &str) -> Option<i32> {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      return val.as_f64().map(|v| v as i32);
    }
  }
  None
}

fn get_f32(obj: &JsValue, key: &str) -> Option<f32> {
  if has_key(obj, key) {
    if let Ok(val) = Reflect::get(obj, &key.into()) {
      return val.as_f64().map(|v| v as f32);
    }
  }
  None
}

fn has_key(obj: &JsValue, key: &str) -> bool {
  if let Ok(exists) = Reflect::has(obj, &key.into()) {
    exists
  } else {
    false
  }
}

fn parse_style(style: &JsValue) -> crate::style::Style {
  crate::style::Style {
    display: get_i32(style, "display")
      .map(|i| Display::from(i).into())
      .unwrap_or_default(),
    position: get_i32(style, "position")
      .map(|i| Position::from(i).into())
      .unwrap_or_default(),
    flex_direction: get_i32(style, "flexDirection")
      .map(|i| FlexDirection::from(i).into())
      .unwrap_or_default(),
    flex_wrap: get_i32(style, "flexWrap")
      .map(|i| FlexWrap::from(i).into())
      .unwrap_or_default(),
    align_items: get_i32(style, "alignItems")
      .map(|i| Some(AlignItems::from(i).into()))
      .unwrap_or_default(),
    align_self: get_i32(style, "alignSelf")
      .map(|i| Some(AlignSelf::from(i).into()))
      .unwrap_or_default(),
    inset: crate::geometry::Rect {
      left: get_length_percentage_auto_dimension(style, "insetLeft"),
      right: get_length_percentage_auto_dimension(style, "insetRight"),
      top: get_length_percentage_auto_dimension(style, "insetTop"),
      bottom: get_length_percentage_auto_dimension(style, "insetBottom"),
    },
    margin: crate::geometry::Rect {
      left: get_length_percentage_auto_dimension(style, "marginLeft"),
      right: get_length_percentage_auto_dimension(style, "marginRight"),
      top: get_length_percentage_auto_dimension(style, "marginTop"),
      bottom: get_length_percentage_auto_dimension(style, "marginBottom"),
    },
    padding: crate::geometry::Rect {
      left: get_length_percentage_dimension(style, "paddingLeft"),
      right: get_length_percentage_dimension(style, "paddingRight"),
      top: get_length_percentage_dimension(style, "paddingTop"),
      bottom: get_length_percentage_dimension(style, "paddingBottom"),
    },
    border: crate::geometry::Rect {
      left: get_length_percentage_dimension(style, "borderLeft"),
      right: get_length_percentage_dimension(style, "borderRight"),
      top: get_length_percentage_dimension(style, "borderTop"),
      bottom: get_length_percentage_dimension(style, "borderBottom"),
    },
    flex_grow: get_f32(style, "flexGrow").unwrap_or(0.0),
    flex_shrink: get_f32(style, "flexShrink").unwrap_or(1.0),
    flex_basis: get_dimension(style, "flexBasis"),
    gap: crate::geometry::Size {
      width: get_length_percentage_dimension(style, "gapWidth"),
      height: get_length_percentage_dimension(style, "gapHeight"),
    },
    size: crate::geometry::Size {
      width: get_size_dimension(style, "width"),
      height: get_size_dimension(style, "height"),
    },
    min_size: crate::geometry::Size {
      width: get_size_dimension(style, "minWidth"),
      height: get_size_dimension(style, "minHeight"),
    },
    max_size: crate::geometry::Size {
      width: get_size_dimension(style, "maxWidth"),
      height: get_size_dimension(style, "maxHeight"),
    },

    // TODO
    justify_items: get_i32(style, "justifyItems")
      .map(|i| Some(AlignItems::from(i).into()))
      .unwrap_or_default(),
    justify_content: get_i32(style, "justifyContent")
      .map(|i| Some(AlignContent::from(i).into()))
      .unwrap_or_default(),
    justify_self: get_i32(style, "justifySelf")
      .map(|i| Some(AlignSelf::from(i).into()))
      .unwrap_or_default(),
    align_content: get_i32(style, "alignContent")
      .map(|i| Some(AlignContent::from(i).into()))
      .unwrap_or_default(),

    aspect_ratio: get_f32(style, "aspectRatio"),
    overflow: crate::geometry::Point {
      x: get_i32(style, "overflowX")
        .map(|i| Overflow::from(i).into())
        .unwrap_or_default(),
      y: get_i32(style, "overflowY")
        .map(|i| Overflow::from(i).into())
        .unwrap_or_default(),
    },
    scrollbar_width: 1024.0,
  }
}
