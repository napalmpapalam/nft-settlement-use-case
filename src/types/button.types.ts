import { MouseEventHandler } from "react";

export type ButtonProps = {
  /**
   * Button contents
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  isActive?: boolean;

  isDisabled?: boolean;

  className?: string;

  styles?: object;
};
