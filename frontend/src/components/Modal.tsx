type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode; //anything between the modal component, render that children
};

const Modal = ({ open, onClose, children }: Props) => {
  return (
    open && (
      // Black overlay behind the white content box/modal that covers the whole screen
      <div
        className="w-full h-full fixed 
        top-0 left-0 bg-black/40"
        onClick={onClose}
      >
        {/* make the white content box/modal come to the middle of the black overlay */}
        <div className="w-full flex justify-center mt-10">
          {/* info content box */}
          {/* Also contains stopPropagation to stop onClicks on its parents from running
              (stop propagating the onClick) */}
          <div
            className="bg-white/100 rounded-lg p-6 max-h-[600px] 
            w-[300px] md:w-[500px] relative"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="flex justify-end">
              {/* close button */}
              <button
                className="py-1 px-2 border self-end
              border-neutral-200 rounded-md text-gray-400 bg-white
              hover:bg-gray-50 hover:text-gray-600"
                onClick={onClose}
              >
                X
              </button>
            </div>
            {/* black line with margin on top to give space 
                between button and the black line */}
            <div className="w-full mt-2 bg-black h-[1px]"></div>
            <div
              className="bg-white/100 rounded-lg 
          w-full max-h-[500px] overflow-y-auto"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
