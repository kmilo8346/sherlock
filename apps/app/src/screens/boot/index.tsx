import { useEffect } from 'react';
import { authenticator } from '../../lib';

export interface BootScreenProps {
  onBooted: () => void;
}

export const BootScreen = (props: BootScreenProps) => {
  const handleBoot = async () => {
    await Promise.all([
      authenticator.boot(),
      // other
    ]);
    props.onBooted();
  };

  useEffect(() => {
    handleBoot();
  }, []);

  return null;
};

export default BootScreen;
