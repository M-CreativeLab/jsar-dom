// When neither alloc or std is enabled, use a heapless fallback
#[cfg(all(not(feature = "alloc"), not(feature = "std")))]
pub(crate) use self::core::*;

/// For when neither `alloc` nor `std` is enabled
#[cfg(all(not(feature = "alloc"), not(feature = "std")))]
mod core {
  use core::cmp::Ordering;

  /// The maximum number of nodes in the tree
  pub const MAX_NODE_COUNT: usize = 256;
  /// The maximum number of children of any given node
  pub const MAX_CHILD_COUNT: usize = 16;

  /// An allocation-backend agnostic vector type
  pub(crate) type Vec<A> = arrayvec::ArrayVec<A, MAX_NODE_COUNT>;
  /// A vector of child nodes, whose length cannot exceed [`MAX_CHILD_COUNT`]
  pub(crate) type ChildrenVec<A> = arrayvec::ArrayVec<A, MAX_CHILD_COUNT>;

  /// Creates a new map with the capacity for the specified number of items before it must be resized
  ///
  /// This vector cannot be resized.
  #[must_use]
  pub(crate) fn new_vec_with_capacity<A, const CAP: usize>(
    _capacity: usize,
  ) -> arrayvec::ArrayVec<A, CAP> {
    arrayvec::ArrayVec::new()
  }

  /// Rounds to the nearest whole number
  #[inline]
  #[must_use]
  #[inline(always)]
  pub(crate) fn round(value: f32) -> f32 {
    num_traits::float::FloatCore::round(value)
  }

  /// Computes the absolute value
  #[inline]
  #[must_use]
  #[inline(always)]
  pub(crate) fn abs(value: f32) -> f32 {
    num_traits::float::FloatCore::abs(value)
  }

  /// Returns the largest of two f32 values
  #[inline(always)]
  pub(crate) fn f32_max(a: f32, b: f32) -> f32 {
    a.max(b)
  }

  /// Returns the smallest of two f32 values
  #[inline(always)]
  pub(crate) fn f32_min(a: f32, b: f32) -> f32 {
    a.min(b)
  }
}
