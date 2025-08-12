import MomentumLogo from './MomentumLogo';

const MainLoader = ({ onAnimationEnd }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-bg-color z-50">
      <MomentumLogo
        className="text-accent"
        size={150}
        isAnimated={true}
        onAnimationEnd={onAnimationEnd}
      />
    </div>
  );
};

export default MainLoader;
