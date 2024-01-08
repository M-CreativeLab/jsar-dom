//! Helpful misc. utilities such as a function to debug print a tree
mod math;
mod resolve;
mod panic_hook;
pub(crate) mod sys;

pub(crate) use math::MaybeMath;
pub(crate) use resolve::{MaybeResolve, ResolveOrZero};
pub(crate) use panic_hook::set_panic_hook;

#[doc(hidden)]
#[macro_use]
pub(crate) mod debug;
