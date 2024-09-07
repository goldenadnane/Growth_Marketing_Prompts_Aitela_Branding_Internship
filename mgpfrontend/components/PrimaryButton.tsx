import { PropsWithChildren, useEffect, useRef, ReactNode, MouseEvent } from 'react';

interface ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const PrimaryButton = ({ children, onClick }: PropsWithChildren<ButtonProps>) => {
  const primarybutton = useRef<HTMLButtonElement>(null);

  return (
    <button onClick={onClick} ref={primarybutton} className="btn btn-primary w-full">
      {children}
    </button>
  );
};

export default PrimaryButton;