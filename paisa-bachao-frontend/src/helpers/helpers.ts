export const navLinkClass = ({
  isActive,
  isPending,
  isTransitioning,
}: {
  isActive: boolean
  isPending: boolean
  isTransitioning: boolean
}) => {
  switch (true) {
    case isActive:
      return 'active'
    case isPending:
      return 'pending'
    case isTransitioning:
      return 'transitioning'
  }
}
