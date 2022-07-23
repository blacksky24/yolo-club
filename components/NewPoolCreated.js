import React from "react";
import { Modal } from "@nextui-org/react";

export default function NewPoolCreated(props) {
  const [visible, setVisible] = React.useState(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  return (
    <div>
      <Modal
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <div className="box cursor-text">
          <h3>New Pool is created </h3>

          <p>{props.details}</p>

          <h4>{props.contractAddress}</h4>
        </div>
      </Modal>
    </div>
  );
}
