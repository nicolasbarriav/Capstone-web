import { DebtorStats } from "@/utils/api/debtors/getDebtorsStats";
import { Ticket } from "@/utils/api/tickets/domain/ticket";
import React, { Dispatch, SetStateAction } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

interface PopupProps {
  // close: MouseEventHandler<HTMLButtonElement> | undefined;
  details: Ticket[];
  debtor: DebtorStats;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const CustomPopup: React.FC<PopupProps> = ({ details, debtor, isOpen, setIsOpen }) => {
  
  const handleOpen = () => {
    setIsOpen(true);
  }
  
  const handleClose = () => {
    setIsOpen(false);
  }
  
  // BORRAR ESTO CUANDO TENGAMOS EL RISK EN EL ENDPOINT
  function getRandomInt(maximo: number) {
    return Math.floor(Math.random() * maximo + 1);
  }
  const risk = getRandomInt(100);
  // HASTA ACÁ, y DESCOMENTAR LA SIGUIENTE
  // const risk = debtor.risk;

  return (
    <Popup
      trigger={<button>...</button>}
      modal
      contentStyle={{ borderRadius: "10px" }}
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <div className="m-2">
        <div className="flex flex-row basis-1/6 text-violet-950 p-3">
          <h2 className="grow text-xl font-semibold">Detalle del cliente</h2>
          <button className="" onClick={handleClose}>
            x
          </button>
        </div>
        <div className="flex flex-row p-3">
          <div className="basis-1/2">
            <div className="">
              <div className="px-1 text-xs text-gray-400"> Nombre</div>
              {/* tick - PONER NOMBRE CLIENTE */}
              <div className="px-1 pb-3">{debtor.name} </div>

              {/* <div className="px-1 text-xs  text-gray-400"> Mail</div>
              PONER MAIL CLIENTE
              <div className="px-1 pb-3"> cgoldsack@uc.cl</div>
              <div className="px-1 text-xs text-gray-400"> Teléfono</div>
              PONER NÚMERO CLIENTE 
              <div className="px-1 pb-3"> +56 9 884788943</div> */}

              <div className="px-1 text-xs text-gray-400">
                {" "}
                Tickets emitidos
              </div>
              {/* tick - PONER TICKETS EMITIDOS AL CLIENTE */}
              <div className="px-1 pb-3"> {details.length} </div>
              <div className="px-1 text-xs text-gray-400"> Riesgo</div>
              <div className="flex flex-row ...">
                {/* tick - PONER RIESGO CLIENTE */}
                
                <div className="rounded-full py-1 px-1 pb-3 text-center">{risk}%</div>
                <div className="py-1 px-1 "></div>
              </div>
              {/* MOSTRAR TODOS LOS TICKETS */}
              <div className="px-1 text-xs text-gray-400"> Todos los tickets emitidos</div>
              {details ? details.slice(0,3)?.map((ticket) => {
                return <div className="p-1">{ticket.title}: ${Math.round(ticket.amount)}</div>;
              })
              : ""}
            </div>
          </div>
          <div className="basis-1/2 bg-violet-50 rounded-lg"> </div>
        </div>
      </div>
    </Popup>
  );
};

export default CustomPopup;
