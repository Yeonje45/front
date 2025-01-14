import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;

	className?: string;
}

const Tooltip = ({ children, text, className="" }: TooltipProps) => {
	const [isVisible, setIsVisible] = React.useState(false);
	let CLASS_NAME = "absolute p-2 text-sm text-white whitespace-pre bg-gray-800 rounded shadow-md bottom-full w-max max-w-[450px] -left-56"

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
			<div className={`${CLASS_NAME} ${isVisible ? 'block' : 'hidden'} ${className}`}>
				{text}
			</div>
    </div>
  );
};

export default Tooltip
