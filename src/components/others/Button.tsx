// import React from 'react';
// import './Button.css';

// const STYLES = ['btn--primary', 'btn--outline'];

// const SIZES = ['btn--medium', 'btn--large', 'btn--mobile', 'btn--wide'];

// const COLOR = ['primary', 'blue', 'red', 'green'];

// export const Button = ({
//   children,
//   type,
//   onClick,
//   buttonStyle,
//   buttonSize,
//   buttonColor
// }) => {
//   const checkButtonStyle = STYLES.includes(buttonStyle)
//     ? buttonStyle
//     : STYLES[0];

//   const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

//   const checkButtonColor = COLOR.includes(buttonColor) ? buttonColor : null;

//   return (
//     <button
//       className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonColor}`}
//       onClick={onClick}
//       type={type}
//     >
//       {children}
//     </button>
//   );
// };
import React, { ReactNode, MouseEvent } from 'react';
import './Button.css';

const STYLES: string[] = ['btn--primary', 'btn--outline'];

const SIZES: string[] = ['btn--medium', 'btn--large', 'btn--mobile', 'btn--wide'];

const COLOR: string[] = ['primary', 'blue', 'red', 'green'];

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  buttonStyle?: string;
  buttonSize?: string;
  buttonColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  buttonStyle = STYLES[0],
  buttonSize = SIZES[0],
  buttonColor,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
  const checkButtonColor = COLOR.includes(buttonColor || '') ? buttonColor : null;

  return (
    <button
      className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonColor}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
