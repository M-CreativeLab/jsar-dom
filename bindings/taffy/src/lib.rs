#![allow(non_snake_case)]

mod utils;

use std::cell::RefCell;
use std::rc::Rc;

use js_sys::Function;
use js_sys::Reflect;
use taffy::style_helpers::TaffyZero;
use taffy::tree::LayoutTree;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignItems {
    FlexStart,
    FlexEnd,
    Start,
    End,
    Center,
    Baseline,
    Stretch,
}

impl Into<taffy::style::AlignItems> for AlignItems {
    fn into(self) -> taffy::style::AlignItems {
        match self {
            AlignItems::FlexStart => taffy::style::AlignItems::FlexStart,
            AlignItems::FlexEnd => taffy::style::AlignItems::FlexEnd,
            AlignItems::Start => taffy::style::AlignItems::Start,
            AlignItems::End => taffy::style::AlignItems::End,
            AlignItems::Center => taffy::style::AlignItems::Center,
            AlignItems::Baseline => taffy::style::AlignItems::Baseline,
            AlignItems::Stretch => taffy::style::AlignItems::Stretch,
        }
    }
}

impl From<i32> for AlignItems {
    fn from(n: i32) -> Self {
        match n {
            0 => AlignItems::FlexStart,
            1 => AlignItems::FlexEnd,
            2 => AlignItems::Start,
            3 => AlignItems::End,
            4 => AlignItems::Center,
            5 => AlignItems::Baseline,
            6 => AlignItems::Stretch,
            _ => AlignItems::Stretch,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum JustifyItems {
    FlexStart,
    FlexEnd,
    Start,
    End,
    Center,
    Baseline,
    Stretch,
}

impl Into<taffy::style::JustifyItems> for JustifyItems {
    fn into(self) -> taffy::style::JustifyItems {
        match self {
            JustifyItems::FlexStart => taffy::style::JustifyItems::FlexStart,
            JustifyItems::FlexEnd => taffy::style::JustifyItems::FlexEnd,
            JustifyItems::Start => taffy::style::JustifyItems::Start,
            JustifyItems::End => taffy::style::JustifyItems::End,
            JustifyItems::Center => taffy::style::JustifyItems::Center,
            JustifyItems::Baseline => taffy::style::JustifyItems::Baseline,
            JustifyItems::Stretch => taffy::style::JustifyItems::Stretch,
        }
    }
}

impl From<i32> for JustifyItems {
    fn from(n: i32) -> Self {
        match n {
            0 => JustifyItems::FlexStart,
            1 => JustifyItems::FlexEnd,
            2 => JustifyItems::Start,
            3 => JustifyItems::End,
            4 => JustifyItems::Center,
            5 => JustifyItems::Baseline,
            6 => JustifyItems::Stretch,
            _ => JustifyItems::Stretch,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum JustifySelf {
    FlexStart,
    FlexEnd,
    Start,
    End,
    Center,
    Baseline,
    Stretch,
}

impl Into<taffy::style::JustifySelf> for JustifySelf {
    fn into(self) -> taffy::style::JustifySelf {
        match self {
            JustifySelf::FlexStart => taffy::style::JustifySelf::FlexStart,
            JustifySelf::FlexEnd => taffy::style::JustifySelf::FlexEnd,
            JustifySelf::Start => taffy::style::JustifySelf::Start,
            JustifySelf::End => taffy::style::JustifySelf::End,
            JustifySelf::Center => taffy::style::JustifySelf::Center,
            JustifySelf::Baseline => taffy::style::JustifySelf::Baseline,
            JustifySelf::Stretch => taffy::style::JustifySelf::Stretch,
        }
    }
}

impl From<i32> for JustifySelf {
    fn from(n: i32) -> Self {
        match n {
            0 => JustifySelf::FlexStart,
            1 => JustifySelf::FlexEnd,
            2 => JustifySelf::Start,
            3 => JustifySelf::End,
            4 => JustifySelf::Center,
            5 => JustifySelf::Baseline,
            6 => JustifySelf::Stretch,
            _ => JustifySelf::Stretch,
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

impl Into<taffy::style::AlignSelf> for AlignSelf {
    fn into(self) -> taffy::style::AlignSelf {
        match self {
            AlignSelf::FlexStart => taffy::style::AlignSelf::FlexStart,
            AlignSelf::FlexEnd => taffy::style::AlignSelf::FlexEnd,
            AlignSelf::Start => taffy::style::AlignSelf::Start,
            AlignSelf::End => taffy::style::AlignSelf::End,
            AlignSelf::Center => taffy::style::AlignSelf::Center,
            AlignSelf::Baseline => taffy::style::AlignSelf::Baseline,
            AlignSelf::Stretch => taffy::style::AlignSelf::Stretch,
        }
    }
}

impl From<i32> for AlignSelf {
    fn from(n: i32) -> Self {
        match n {
            0 => AlignSelf::FlexStart,
            1 => AlignSelf::FlexEnd,
            2 => AlignSelf::Start,
            3 => AlignSelf::End,
            4 => AlignSelf::Center,
            5 => AlignSelf::Baseline,
            6 => AlignSelf::Stretch,
            _ => AlignSelf::Start,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AlignContent {
    FlexStart,
    FlexEnd,
    Start,
    End,
    Center,
    Stretch,
    SpaceBetween,
    SpaceAround,
}

impl Into<taffy::style::AlignContent> for AlignContent {
    fn into(self) -> taffy::style::AlignContent {
        match self {
            AlignContent::FlexStart => taffy::style::AlignContent::FlexStart,
            AlignContent::FlexEnd => taffy::style::AlignContent::FlexEnd,
            AlignContent::Start => taffy::style::AlignContent::FlexStart,
            AlignContent::End => taffy::style::AlignContent::FlexEnd,
            AlignContent::Center => taffy::style::AlignContent::Center,
            AlignContent::Stretch => taffy::style::AlignContent::Stretch,
            AlignContent::SpaceBetween => taffy::style::AlignContent::SpaceBetween,
            AlignContent::SpaceAround => taffy::style::AlignContent::SpaceAround,
        }
    }
}

impl From<i32> for AlignContent {
    fn from(n: i32) -> Self {
        match n {
            0 => AlignContent::FlexStart,
            1 => AlignContent::FlexEnd,
            2 => AlignContent::Start,
            3 => AlignContent::End,
            4 => AlignContent::Center,
            5 => AlignContent::Stretch,
            6 => AlignContent::SpaceBetween,
            7 => AlignContent::SpaceAround,
            _ => AlignContent::Stretch,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Display {
    Flex,
    Grid,
    None,
}

impl Into<taffy::style::Display> for Display {
    fn into(self) -> taffy::style::Display {
        match self {
            Display::Flex => taffy::style::Display::Flex,
            Display::Grid => taffy::style::Display::Grid,
            Display::None => taffy::style::Display::None,
        }
    }
}

impl From<i32> for Display {
    fn from(n: i32) -> Self {
        match n {
            0 => Display::Flex,
            1 => Display::Grid,
            2 => Display::None,
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
}

impl Into<taffy::style::FlexDirection> for FlexDirection {
    fn into(self) -> taffy::style::FlexDirection {
        match self {
            FlexDirection::Row => taffy::style::FlexDirection::Row,
            FlexDirection::Column => taffy::style::FlexDirection::Column,
            FlexDirection::RowReverse => taffy::style::FlexDirection::RowReverse,
            FlexDirection::ColumnReverse => taffy::style::FlexDirection::ColumnReverse,
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
            _ => FlexDirection::Row,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GridAutoFlow {
    Row,
    Column,
    RowDense,
    ColumnDense,
}

impl Into<taffy::style::GridAutoFlow> for GridAutoFlow {
    fn into(self) -> taffy::style::GridAutoFlow {
        match self {
            GridAutoFlow::Row => taffy::style::GridAutoFlow::Row,
            GridAutoFlow::Column => taffy::style::GridAutoFlow::Column,
            GridAutoFlow::RowDense => taffy::style::GridAutoFlow::RowDense,
            GridAutoFlow::ColumnDense => taffy::style::GridAutoFlow::ColumnDense,
        }
    }
}

impl From<i32> for GridAutoFlow {
    fn from(n: i32) -> Self {
        match n {
            0 => GridAutoFlow::Row,
            1 => GridAutoFlow::Column,
            2 => GridAutoFlow::RowDense,
            3 => GridAutoFlow::ColumnDense,
            _ => GridAutoFlow::Row,
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum JustifyContent {
    FlexStart,
    FlexEnd,
    Start,
    End,
    Center,
    SpaceBetween,
    SpaceAround,
    SpaceEvenly,
}

impl Into<taffy::style::JustifyContent> for JustifyContent {
    fn into(self) -> taffy::style::JustifyContent {
        match self {
            JustifyContent::FlexStart => taffy::style::JustifyContent::FlexStart,
            JustifyContent::FlexEnd => taffy::style::JustifyContent::FlexEnd,
            JustifyContent::Start => taffy::style::JustifyContent::Start,
            JustifyContent::End => taffy::style::JustifyContent::End,
            JustifyContent::Center => taffy::style::JustifyContent::Center,
            JustifyContent::SpaceBetween => taffy::style::JustifyContent::SpaceBetween,
            JustifyContent::SpaceAround => taffy::style::JustifyContent::SpaceAround,
            JustifyContent::SpaceEvenly => taffy::style::JustifyContent::SpaceEvenly,
        }
    }
}

impl From<i32> for JustifyContent {
    fn from(n: i32) -> Self {
        match n {
            0 => JustifyContent::FlexStart,
            1 => JustifyContent::FlexEnd,
            2 => JustifyContent::Start,
            3 => JustifyContent::End,
            4 => JustifyContent::Center,
            5 => JustifyContent::SpaceBetween,
            6 => JustifyContent::SpaceAround,
            7 => JustifyContent::SpaceEvenly,
            _ => JustifyContent::FlexStart,
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

impl Into<taffy::style::Position> for Position {
    fn into(self) -> taffy::style::Position {
        match self {
            Position::Relative => taffy::style::Position::Relative,
            Position::Absolute => taffy::style::Position::Absolute,
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

impl Into<taffy::style::FlexWrap> for FlexWrap {
    fn into(self) -> taffy::style::FlexWrap {
        match self {
            FlexWrap::NoWrap => taffy::style::FlexWrap::NoWrap,
            FlexWrap::Wrap => taffy::style::FlexWrap::Wrap,
            FlexWrap::WrapReverse => taffy::style::FlexWrap::WrapReverse,
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
#[derive(Clone, Debug)]
pub struct Layout {
    #[wasm_bindgen(readonly)]
    pub width: f32,

    #[wasm_bindgen(readonly)]
    pub height: f32,

    #[wasm_bindgen(readonly)]
    pub x: f32,

    #[wasm_bindgen(readonly)]
    pub y: f32,

    #[wasm_bindgen(readonly)]
    pub childCount: usize,

    children: Vec<Layout>,
}

#[wasm_bindgen]
impl Layout {
    fn new(allocator: &Allocator, node: taffy::node::Node) -> Layout {
        let taffy = allocator.taffy.borrow();
        let layout = taffy.layout(node).unwrap();
        let children = taffy.children(node).unwrap();

        Layout {
            width: layout.size.width,
            height: layout.size.height,
            x: layout.location.x,
            y: layout.location.y,
            childCount: children.len(),
            children: children
                .into_iter()
                .map(|child| Layout::new(allocator, child))
                .collect(),
        }
    }

    #[wasm_bindgen]
    pub fn child(&self, at: usize) -> Layout {
        self.children[at].clone()
    }
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct LayoutSimple {
    #[wasm_bindgen(readonly)]
    pub width: f32,

    #[wasm_bindgen(readonly)]
    pub height: f32,

    #[wasm_bindgen(readonly)]
    pub x: f32,

    #[wasm_bindgen(readonly)]
    pub y: f32,
}

#[wasm_bindgen]
impl LayoutSimple {
    fn new(allocator: &Allocator, node: taffy::node::Node) -> LayoutSimple {
        let taffy = allocator.taffy.borrow();
        let layout = taffy.layout(node).unwrap();

        LayoutSimple {
            width: layout.size.width,
            height: layout.size.height,
            x: layout.location.x,
            y: layout.location.y,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Allocator {
    taffy: Rc<RefCell<taffy::Taffy>>,
}

#[wasm_bindgen]
impl Allocator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            taffy: Rc::new(RefCell::new(taffy::Taffy::new())),
        }
    }
}

#[wasm_bindgen]
pub struct Node {
    allocator: Allocator,
    node: taffy::node::Node,
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
                .taffy
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

    #[wasm_bindgen(js_name = setMeasure)]
    pub fn set_measure(&mut self, measure: &JsValue) {
        let _measure = Function::from(measure.clone());

        self.allocator
            .taffy
            .borrow_mut()
            .set_measure(
                self.node,
                // Some(taffy::node::MeasureFunc::Boxed(Box::new(
                //     move |constraints| {
                //         use taffy::number::OrElse;

                //         let widthConstraint =
                //             if let taffy::number::Number::Defined(val) = constraints.width {
                //                 val.into()
                //             } else {
                //                 JsValue::UNDEFINED
                //             };

                //         let heightConstaint =
                //             if let taffy::number::Number::Defined(val) = constraints.height {
                //                 val.into()
                //             } else {
                //                 JsValue::UNDEFINED
                //             };

                //         if let Ok(result) =
                //             measure.call2(&JsValue::UNDEFINED, &widthConstraint, &heightConstaint)
                //         {
                //             let width = get_f32(&result, "width");
                //             let height = get_f32(&result, "height");

                //             if width.is_some() && height.is_some() {
                //                 return taffy::geometry::Size {
                //                     width: width.unwrap(),
                //                     height: height.unwrap(),
                //                 };
                //             }
                //         }

                //         constraints.map(|v| v.or_else(0.0))
                //     },
                // ))),
                None,
            )
            .unwrap();
    }

    #[wasm_bindgen(js_name = addChild)]
    pub fn add_child(&mut self, child: &Node) {
        self.allocator
            .taffy
            .borrow_mut()
            .add_child(self.node, child.node)
            .unwrap();
        self.childCount += 1;
    }

    #[wasm_bindgen(js_name = removeChild)]
    pub fn remove_child(&mut self, child: &Node) {
        self.allocator
            .taffy
            .borrow_mut()
            .remove_child(self.node, child.node)
            .unwrap();
        self.childCount -= 1;
    }

    #[wasm_bindgen(js_name = replaceChildAtIndex)]
    pub fn replace_child_at_index(&mut self, index: usize, child: &Node) {
        self.allocator
            .taffy
            .borrow_mut()
            .replace_child_at_index(self.node, index, child.node)
            .unwrap();
    }

    #[wasm_bindgen(js_name = removeChildAtIndex)]
    pub fn remove_child_at_index(&mut self, index: usize) {
        self.allocator
            .taffy
            .borrow_mut()
            .remove_child_at_index(self.node, index)
            .unwrap();
        self.childCount -= 1;
    }

    #[wasm_bindgen(js_name = getStyle)]
    pub fn get_style(&self) -> JsValue {
        self.style.clone()
    }

    #[wasm_bindgen(js_name = setStyle)]
    pub fn set_style(&mut self, style: &JsValue) {
        self.allocator
            .taffy
            .borrow_mut()
            .set_style(self.node, parse_style(style))
            .unwrap();
        self.style = style.clone();
    }

    #[wasm_bindgen(js_name = markDirty)]
    pub fn mark_dirty(&mut self) {
        self.allocator
            .taffy
            .borrow_mut()
            .mark_dirty(self.node)
            .unwrap()
    }

    #[wasm_bindgen(js_name = isDirty)]
    pub fn is_dirty(&self) -> bool {
        self.allocator.taffy.borrow().dirty(self.node).unwrap()
    }

    #[wasm_bindgen(js_name = isChildless)]
    pub fn is_childless(&mut self) -> bool {
        self.allocator.taffy.borrow_mut().is_childless(self.node)
    }

    #[wasm_bindgen(js_name = computeLayout)]
    pub fn compute_layout(&mut self, size: &JsValue) -> bool {
        self.allocator
            .taffy
            .borrow_mut()
            .compute_layout(
                self.node,
                taffy::geometry::Size {
                    width: get_available_space(size, "width"),
                    height: get_available_space(size, "height"),
                },
            )
            .unwrap();
        // Layout::new(&self.allocator, self.node)
        true
    }

    #[wasm_bindgen(js_name = getLayout)]
    pub fn get_layout(&mut self) -> LayoutSimple {
        LayoutSimple::new(&self.allocator, self.node)
    }
}

fn parse_style(style: &JsValue) -> taffy::style::Style {
    taffy::style::Style {
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
        align_content: get_i32(style, "alignContent")
            .map(|i| Some(AlignContent::from(i).into()))
            .unwrap_or_default(),
        justify_content: get_i32(style, "justifyContent")
            .map(|i| Some(JustifyContent::from(i).into()))
            .unwrap_or_default(),
        justify_self: get_i32(style, "justifySelf")
            .map(|i| Some(JustifySelf::from(i).into()))
            .unwrap_or_default(),
        justify_items: get_i32(style, "justifyItems")
            .map(|i| Some(JustifyItems::from(i).into()))
            .unwrap_or_default(),
        grid_template_rows: Default::default(),
        grid_template_columns: Default::default(),
        grid_auto_rows: Default::default(),
        grid_auto_columns: Default::default(),
        grid_auto_flow: get_i32(style, "gridAutoFlow")
            .map(|i| GridAutoFlow::from(i).into())
            .unwrap_or_default(),
        grid_row: Default::default(),
        grid_column: Default::default(),
        inset: taffy::geometry::Rect {
            left: get_length_percentage_auto_dimension(style, "insetLeft"),
            right: get_length_percentage_auto_dimension(style, "insetRight"),
            top: get_length_percentage_auto_dimension(style, "insetTop"),
            bottom: get_length_percentage_auto_dimension(style, "insetBottom"),
        },
        margin: taffy::geometry::Rect {
            left: get_length_percentage_auto_dimension(style, "marginLeft"),
            right: get_length_percentage_auto_dimension(style, "marginRight"),
            top: get_length_percentage_auto_dimension(style, "marginTop"),
            bottom: get_length_percentage_auto_dimension(style, "marginBottom"),
        },

        padding: taffy::geometry::Rect {
            left: get_length_percentage_dimension(style, "paddingLeft"),
            right: get_length_percentage_dimension(style, "paddingRight"),
            top: get_length_percentage_dimension(style, "paddingTop"),
            bottom: get_length_percentage_dimension(style, "paddingBottom"),
        },

        border: taffy::geometry::Rect {
            left: get_length_percentage_dimension(style, "borderLeft"),
            right: get_length_percentage_dimension(style, "borderRight"),
            top: get_length_percentage_dimension(style, "borderTop"),
            bottom: get_length_percentage_dimension(style, "borderBottom"),
        },

        flex_grow: get_f32(style, "flexGrow").unwrap_or(0.0),
        flex_shrink: get_f32(style, "flexShrink").unwrap_or(1.0),
        flex_basis: get_dimension(style, "flexBasis"),

        gap: taffy::geometry::Size {
            width: get_length_percentage_dimension(style, "gapWidth"),
            height: get_length_percentage_dimension(style, "gapHeight"),
        },

        size: taffy::geometry::Size {
            width: get_size_dimension(style, "width"),
            height: get_size_dimension(style, "height"),
        },

        min_size: taffy::geometry::Size {
            width: get_size_dimension(style, "minWidth"),
            height: get_size_dimension(style, "minHeight"),
        },

        max_size: taffy::geometry::Size {
            width: get_size_dimension(style, "maxWidth"),
            height: get_size_dimension(style, "maxHeight"),
        },

        aspect_ratio: get_f32(style, "aspectRatio"),
    }
}

fn get_size_dimension(obj: &JsValue, key: &str) -> taffy::style::Dimension {
    let dimension = get_dimension(obj, key);
    match dimension {
        taffy::style::Dimension::Auto => taffy::style::Dimension::Auto,
        _ => dimension,
    }
}

fn get_dimension(obj: &JsValue, key: &str) -> taffy::style::Dimension {
    if has_key(obj, key) {
        if let Ok(val) = Reflect::get(obj, &key.into()) {
            if let Some(number) = val.as_f64() {
                return taffy::style::Dimension::Points(number as f32);
            }
            if let Some(string) = val.as_string() {
                if string == "auto" {
                    return taffy::style::Dimension::Auto;
                }
                if let Ok(number) = string.parse::<f32>() {
                    return taffy::style::Dimension::Points(number);
                }
                if string.ends_with('%') {
                    let len = string.len();
                    if let Ok(number) = string[..len - 1].parse::<f32>() {
                        return taffy::style::Dimension::Percent(number / 100.0);
                    }
                }
            }
        }
    }
    taffy::style::Dimension::Auto
}

fn get_available_space(obj: &JsValue, key: &str) -> taffy::style::AvailableSpace {
    if has_key(obj, key) {
        if let Ok(val) = Reflect::get(obj, &key.into()) {
            if let Some(number) = val.as_f64() {
                return taffy::style::AvailableSpace::Definite(number as f32);
            }
            if let Some(string) = val.as_string() {
                if string == "min" || string == "minContent" {
                    return taffy::style::AvailableSpace::MinContent;
                }
                if string == "max" || string == "maxContent" {
                    return taffy::style::AvailableSpace::MaxContent;
                }
                if let Ok(number) = string.parse::<f32>() {
                    return taffy::style::AvailableSpace::Definite(number);
                }
            }
        }
    }
    taffy::style::AvailableSpace::ZERO
}

fn get_length_percentage_auto_dimension(
    obj: &JsValue,
    key: &str,
) -> taffy::style::LengthPercentageAuto {
    if has_key(obj, key) {
        if let Ok(val) = Reflect::get(obj, &key.into()) {
            if let Some(number) = val.as_f64() {
                return taffy::style::LengthPercentageAuto::Points(number as f32);
            }
            if let Some(string) = val.as_string() {
                if string == "auto" {
                    return taffy::style::LengthPercentageAuto::Auto;
                }
                if let Ok(number) = string.parse::<f32>() {
                    return taffy::style::LengthPercentageAuto::Points(number);
                }
                if string.ends_with('%') {
                    let len = string.len();
                    if let Ok(number) = string[..len - 1].parse::<f32>() {
                        return taffy::style::LengthPercentageAuto::Percent(number / 100.0);
                    }
                }
            }
        }
    }
    taffy::style::LengthPercentageAuto::ZERO
}

fn get_length_percentage_dimension(obj: &JsValue, key: &str) -> taffy::style::LengthPercentage {
    if has_key(obj, key) {
        if let Ok(val) = Reflect::get(obj, &key.into()) {
            if let Some(number) = val.as_f64() {
                return taffy::style::LengthPercentage::Points(number as f32);
            }
            if let Some(string) = val.as_string() {
                if let Ok(number) = string.parse::<f32>() {
                    return taffy::style::LengthPercentage::Points(number);
                }
                if string.ends_with('%') {
                    let len = string.len();
                    if let Ok(number) = string[..len - 1].parse::<f32>() {
                        return taffy::style::LengthPercentage::Percent(number / 100.0);
                    }
                }
            }
        }
    }
    taffy::style::LengthPercentage::ZERO
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