import MomentumLogo from './MomentumLogo';

const MainLoader = ({ onAnimationEnd }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-bg-color z-50">
      <MomentumLogo
        className="text-accent"
        size={100}
        isAnimated={true}
        onAnimationComplete={onAnimationEnd}
      />
    </div>
  );
};

export default MainLoader;
