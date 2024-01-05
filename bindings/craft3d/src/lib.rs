#![allow(non_snake_case)]
#![deny(unsafe_code)]
#![forbid(unsafe_code)]

use std::cell::RefCell;
use std::rc::Rc;

use js_sys::Function;
use js_sys::Reflect;
use wasm_bindgen::prelude::*;
use slotmap::SecondaryMap;
use slotmap::{DefaultKey, SlotMap};

pub(crate) struct Craft3dConfig {
    /// Whether to round layout values
    pub(crate) use_rounding: bool,
    pub(crate) capacity: usize,
}

impl Default for Craft3dConfig {
    fn default() -> Self {
        Self {
            use_rounding: true,
            capacity: 16,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignItems {
    Start,
    End,
    Center,
}

impl From<i32> for AlignItems {
    fn from(n: i32) -> Self {
        match n {
            0 => AlignItems::Start,
            1 => AlignItems::End,
            2 => AlignItems::Center,
            _ => AlignItems::Start,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignSelf {
    Start,
    End,
    Center,
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
pub enum Display {
    Flex,
    None,
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
    Depth,
}

impl From<i32> for FlexDirection {
    fn from(n: i32) -> Self {
        match n {
            0 => FlexDirection::Row,
            1 => FlexDirection::Column,
            2 => FlexDirection::Depth,
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
}

impl From<i32> for FlexWrap {
    fn from(n: i32) -> Self {
        match n {
            0 => FlexWrap::NoWrap,
            1 => FlexWrap::Wrap,
            _ => FlexWrap::NoWrap,
        }
    }
}

/// A typed representation of the CSS style information for a single node.
///
/// The most important idea in flexbox is the notion of a "main" and "cross" axis, which are always perpendicular to each other.
/// The orientation of these axes are controlled via the [`FlexDirection`] field of this struct.
///
/// This struct follows the [CSS equivalent](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) directly;
/// information about the behavior on the web should transfer directly.
///
/// Detailed information about the exact behavior of each of these fields
/// can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS) by searching for the field name.
/// The distinction between margin, padding and border is explained well in
/// this [introduction to the box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model).
///
/// If the behavior does not match the flexbox layout algorithm on the web, please file a bug!
#[derive(Clone, PartialEq, Debug)]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "serde", serde(default))]
pub struct Style {
    pub display: Display,
    pub position: Position,
    pub flex_direction: FlexDirection,
    pub flex_wrap: FlexWrap,
}

/// Layout information for a given [`Node`](crate::node::Node)
///
/// Stored in a [`Craft3dTree`].
struct NodeData {
    pub(crate) style: Style,
    // pub(crate) unrounded_layout: Layout,
    // pub(crate) final_layout: Layout,
    pub(crate) has_context: bool,
    // pub(crate) cache: Cache,
}

/// An entire tree of spatial nodes. The entry point to Craft3d's high-level API.
///
/// Allows you to build a tree of spatial nodes, run Craft3d's layout algorithms over that tree, and then access the resultant layout.
pub struct Craft3dTree<NodeContext = ()> {
    nodes: SlotMap<DefaultKey, NodeData>,
    node_context_data: SecondaryMap<DefaultKey, NodeContext>,
    config: Craft3dConfig,
}

impl Craft3dTree {
    /// Creates a new [`Craft3dTree`] with the default configuration.
    pub fn new() -> Craft3dTree<()> {
        Craft3dTree::with_config(Craft3dConfig::default())
    }

    /// Creates a new [`Craft3dTree`] with the given configuration.
    fn with_config(config: Craft3dConfig) -> Craft3dTree<()> {
        Craft3dTree {
            nodes: SlotMap::with_capacity(config.capacity),
            node_context_data: SecondaryMap::with_capacity(config.capacity),
            config,
        }
    }

    /// Enable rounding of layout values. Rounding is enabled by default.
    pub fn enable_rounding(&mut self) {
        self.config.use_rounding = true;
    }

    /// Disable rounding of layout values. Rounding is enabled by default.
    pub fn disable_rounding(&mut self) {
        self.config.use_rounding = false;
    }
}

impl Default for Craft3dTree {
    fn default() -> Craft3dTree<()> {
        Craft3dTree::new()
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
    fn new(allocator: &Allocator, node: &Node) -> Self {
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
        // self.allocator
        //     .taffy
        //     .borrow_mut()
        //     .add_child(self.node, child.node)
        //     .unwrap();
        self.childCount += 1;
    }

    #[wasm_bindgen(js_name = removeChild)]
    pub fn remove_child(&mut self, child: &Node) {
        // self.allocator
        //     .taffy
        //     .borrow_mut()
        //     .remove_child(self.node, child.node)
        //     .unwrap();
        self.childCount -= 1;
    }

    #[wasm_bindgen(js_name = getStyle)]
    pub fn get_style(&self) -> JsValue {
        self.style.clone()
    }

    #[wasm_bindgen(js_name = setStyle)]
    pub fn set_style(&mut self, style: &JsValue) {
        // self.allocator
        //     .taffy
        //     .borrow_mut()
        //     .set_style(self.node, parse_style(style))
        //     .unwrap();
        self.style = style.clone();
    }

    #[wasm_bindgen(js_name = markDirty)]
    pub fn mark_dirty(&mut self) {
        // self.allocator
        //     .taffy
        //     .borrow_mut()
        //     .mark_dirty(self.node)
        //     .unwrap()
    }

    #[wasm_bindgen(js_name = isDirty)]
    pub fn is_dirty(&self) -> bool {
        // self.allocator.taffy.borrow().dirty(self.node).unwrap()
        true
    }

    #[wasm_bindgen(js_name = isChildless)]
    pub fn is_childless(&mut self) -> bool {
        // self.allocator.taffy.borrow_mut().is_childless(self.node)
        false
    }

    #[wasm_bindgen(js_name = computeLayout)]
    pub fn compute_layout(&mut self, size: &JsValue) -> bool {
        // self.allocator
        //     .taffy
        //     .borrow_mut()
        //     .compute_layout(
        //         self.node,
        //         taffy::geometry::Size {
        //             width: get_available_space(size, "width"),
        //             height: get_available_space(size, "height"),
        //         },
        //     )
        //     .unwrap();
        // Layout::new(&self.allocator, self.node)
        true
    }

    #[wasm_bindgen(js_name = getLayout)]
    pub fn get_layout(&mut self) -> VolumetricLayout {
        VolumetricLayout::new(&self.allocator, self)
    }
}

// fn parse_style(style: &JsValue) -> taffy::style::Style {
//     taffy::style::Style {
//         display: get_i32(style, "display")
//             .map(|i| Display::from(i).into())
//             .unwrap_or_default(),
//         position: get_i32(style, "position")
//             .map(|i| Position::from(i).into())
//             .unwrap_or_default(),
//         flex_direction: get_i32(style, "flexDirection")
//             .map(|i| FlexDirection::from(i).into())
//             .unwrap_or_default(),
//         flex_wrap: get_i32(style, "flexWrap")
//             .map(|i| FlexWrap::from(i).into())
//             .unwrap_or_default(),
//         align_items: get_i32(style, "alignItems")
//             .map(|i| Some(AlignItems::from(i).into()))
//             .unwrap_or_default(),
//         align_self: get_i32(style, "alignSelf")
//             .map(|i| Some(AlignSelf::from(i).into()))
//             .unwrap_or_default(),
//         align_content: get_i32(style, "alignContent")
//             .map(|i| Some(AlignContent::from(i).into()))
//             .unwrap_or_default(),
//         justify_content: get_i32(style, "justifyContent")
//             .map(|i| Some(JustifyContent::from(i).into()))
//             .unwrap_or_default(),
//         justify_self: get_i32(style, "justifySelf")
//             .map(|i| Some(JustifySelf::from(i).into()))
//             .unwrap_or_default(),
//         justify_items: get_i32(style, "justifyItems")
//             .map(|i| Some(JustifyItems::from(i).into()))
//             .unwrap_or_default(),
//         grid_template_rows: Default::default(),
//         grid_template_columns: Default::default(),
//         grid_auto_rows: Default::default(),
//         grid_auto_columns: Default::default(),
//         grid_auto_flow: get_i32(style, "gridAutoFlow")
//             .map(|i| GridAutoFlow::from(i).into())
//             .unwrap_or_default(),
//         grid_row: Default::default(),
//         grid_column: Default::default(),
//         inset: taffy::geometry::Rect {
//             left: get_length_percentage_auto_dimension(style, "insetLeft"),
//             right: get_length_percentage_auto_dimension(style, "insetRight"),
//             top: get_length_percentage_auto_dimension(style, "insetTop"),
//             bottom: get_length_percentage_auto_dimension(style, "insetBottom"),
//         },
//         margin: taffy::geometry::Rect {
//             left: get_length_percentage_auto_dimension(style, "marginLeft"),
//             right: get_length_percentage_auto_dimension(style, "marginRight"),
//             top: get_length_percentage_auto_dimension(style, "marginTop"),
//             bottom: get_length_percentage_auto_dimension(style, "marginBottom"),
//         },

//         padding: taffy::geometry::Rect {
//             left: get_length_percentage_dimension(style, "paddingLeft"),
//             right: get_length_percentage_dimension(style, "paddingRight"),
//             top: get_length_percentage_dimension(style, "paddingTop"),
//             bottom: get_length_percentage_dimension(style, "paddingBottom"),
//         },

//         border: taffy::geometry::Rect {
//             left: get_length_percentage_dimension(style, "borderLeft"),
//             right: get_length_percentage_dimension(style, "borderRight"),
//             top: get_length_percentage_dimension(style, "borderTop"),
//             bottom: get_length_percentage_dimension(style, "borderBottom"),
//         },

//         flex_grow: get_f32(style, "flexGrow").unwrap_or(0.0),
//         flex_shrink: get_f32(style, "flexShrink").unwrap_or(1.0),
//         flex_basis: get_dimension(style, "flexBasis"),

//         gap: taffy::geometry::Size {
//             width: get_length_percentage_dimension(style, "gapWidth"),
//             height: get_length_percentage_dimension(style, "gapHeight"),
//         },

//         size: taffy::geometry::Size {
//             width: get_size_dimension(style, "width"),
//             height: get_size_dimension(style, "height"),
//         },

//         min_size: taffy::geometry::Size {
//             width: get_size_dimension(style, "minWidth"),
//             height: get_size_dimension(style, "minHeight"),
//         },

//         max_size: taffy::geometry::Size {
//             width: get_size_dimension(style, "maxWidth"),
//             height: get_size_dimension(style, "maxHeight"),
//         },

//         aspect_ratio: get_f32(style, "aspectRatio"),
//     }
// }
