interface Props {
  className?: string;
  size?: number;
}

const SwissFlag = ({ className, size = 16 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    aria-label="Schweizer Flagge"
    role="img"
  >
    <rect width="32" height="32" fill="#FF0000" rx="2" ry="2" />
    <rect x="13" y="6" width="6" height="20" fill="#FFFFFF" />
    <rect x="6" y="13" width="20" height="6" fill="#FFFFFF" />
  </svg>
);

export default SwissFlag;
