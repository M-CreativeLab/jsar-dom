//! Helpful misc. utilities such as a function to debug print a tree
mod math;
mod resolve;
pub(crate) mod sys;

pub(crate) use math::MaybeMath;
pub(crate) use resolve::{MaybeResolve, ResolveOrZero};

#[doc(hidden)]
#[macro_use]
pub(crate) mod debug;
