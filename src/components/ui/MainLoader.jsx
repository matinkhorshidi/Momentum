import MomentumLogo from './MomentumLogo';

const MainLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-bg-color z-50">
      <MomentumLogo className="text-accent" size={80} />
    </div>
  );
};

export default MainLoader;
