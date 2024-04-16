interface IProps {
  size: number;
  left: number;
  delay: number;
  duration: number;
}

const AnimationBlock = ({ size, left, delay, duration }: IProps) => {
  return (
    <li
      style={{
        left: left + '%',
        width: size + 'px',
        height: size + 'px',
        animationDelay: delay + 's',
        animationDuration: duration + 's',
      }}
    ></li>
  );
};

export default AnimationBlock;
