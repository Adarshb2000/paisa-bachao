import './index.scss'

const ClickableCard = ({
  children,
  onClick = () => {},
  className = '',
}: Props) => (
  <button
    onClick={onClick}
    className={`clickable-card rounded-lg font-semibold text-black ${className}`}
  >
    {children}
  </button>
)

export default ClickableCard
interface Props {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}
