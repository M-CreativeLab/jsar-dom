#![allow(non_snake_case)]

use noise::*;
use js_sys::Function;
use js_sys::Reflect;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct OpenSimplex {
    handle: noise::OpenSimplex,
}

#[wasm_bindgen]
impl OpenSimplex {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u32) -> Self {
        Self {
            handle: noise::OpenSimplex::new(seed),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn seed(&self) -> u32 {
        self.handle.seed()
    }

    #[wasm_bindgen(setter)]
    pub fn set_seed(&self, v: u32) {
        self.handle.set_seed(v);
    }

    #[wasm_bindgen]
    pub fn get(&mut self, input: Vec<f64>) -> Result<f64, JsError> {
        match input.len() {
            2 => Ok(self.handle.get([ input[0], input[1] ])),
            3 => Ok(self.handle.get([ input[0], input[1], input[2] ])),
            4 => Ok(self.handle.get([ input[0], input[1], input[2], input[3] ])),
            _ => Err(JsError::new("Only accepts 2, 3 or 4 numbers")),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Perlin {
    handle: noise::Perlin,
}

#[wasm_bindgen]
impl Perlin {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u32) -> Self {
        let perlin = noise::Perlin::new(seed);
        Self {
            handle: perlin,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn seed(&self) -> u32 {
        self.handle.seed()
    }

    #[wasm_bindgen(setter)]
    pub fn set_seed(&self, v: u32) {
        self.handle.set_seed(v);
    }

    #[wasm_bindgen]
    pub fn get(&mut self, input: Vec<f64>) -> Result<f64, JsError> {
        match input.len() {
            2 => Ok(self.handle.get([ input[0], input[1] ])),
            3 => Ok(self.handle.get([ input[0], input[1], input[2] ])),
            4 => Ok(self.handle.get([ input[0], input[1], input[2], input[3] ])),
            _ => Err(JsError::new("Only accepts 2, 3 or 4 numbers")),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Simplex {
    handle: noise::Simplex,
}

#[wasm_bindgen]
impl Simplex {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u32) -> Self {
        let simplex = noise::Simplex::new(seed);
        Self {
            handle: simplex,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn seed(&self) -> u32 {
        self.handle.seed()
    }

    #[wasm_bindgen(setter)]
    pub fn set_seed(&self, v: u32) {
        self.handle.set_seed(v);
    }

    #[wasm_bindgen]
    pub fn get(&mut self, input: Vec<f64>) -> Result<f64, JsError> {
        match input.len() {
            2 => Ok(self.handle.get([ input[0], input[1] ])),
            3 => Ok(self.handle.get([ input[0], input[1], input[2] ])),
            4 => Ok(self.handle.get([ input[0], input[1], input[2], input[3] ])),
            _ => Err(JsError::new("Only accepts 2, 3 or 4 numbers")),
        }
    }
}
