import { useState } from "react";
import { useContext } from "react";
import Modal from "./Modal";
import { ThemeContext } from "../contexts/ThemeContext";

const InfoModal = () => {
  const { themeColor } = useContext(ThemeContext);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex justify-center">
      <div
        className="flex justify-end w-full 
      mr-5 md:mr-0 md:w-5/6 lg:w-2/3"
      >
        <button
          className={
            `h-5 pl-2 md:pl-0 md:w-20 
          md:h-10 mt-16 border-l-[1px] transition-colors duration-30 ` +
            (themeColor == "light"
              ? "hover:bg-slate-950/5 border-black"
              : "hover:bg-amber-200/5 border-yellow-300")
          }
          onClick={() => setOpen(true)}
        >
          <p
            className={
              `text-sm font-semibold ` +
              (themeColor == "light" ? "text-black" : "text-yellow-300")
            }
          >
            INFO
          </p>
        </button>
        <Modal open={open} onClose={() => setOpen(false)}>
          {/* children */}
          <div>
            <h1 className="font-bold mt-2 mb-2">Om AI-Klassifisering</h1>
            <p className="mb-5 tracking-[0.5px]">
              AI-Klassifisering er et bachelorprosjekt laget av AI-studenter
              Yousra, Yosef, Sharjeel og frontend-studenter Jennifer og Miles
              fra Høyskolen Kristiania i samarbeid med IT-divisjonen i
              Tolletaten. Prosjektets formål er å hjelpe norske importører og
              eksportører ved å identifisere riktige varenummer for deklarasjon
              av varer.
            </p>
            <h1 className="font-bold mb-2">
              Om BKU (Bindende klassifiseringsuttalelse)
            </h1>
            <p className="mb-5 tracking-[0.5px]">
              BKU-søk inneholder alle gyldige bindende forhåndsuttalelser om
              klassifisering fattet iht. vareførselsforskriften § 7-6.
            </p>
            <h1 className="font-bold mb-2">Om søk etter BKU</h1>
            <p className="mb-5 tracking-[0.5px]">
              Du kan benytte fritekst og tall i ditt søk (se også eksempler på
              søk nedenfor).
            </p>
            {/* Etter det første søket vises en resultatliste, og
              du kan legge til mer informasjon for å forbedre søket. */}
            <h1 className="font-bold mb-2">Eksempler på søk</h1>
            <p className="mb-5 tracking-[0.5px]">
              Steg 1: Søk etter «Asiatisk ribbe til jul».
              <br />
              Resultatliste vises.
              {/* <br />
              Steg 2: Søk på nytt basert på første resultat og legg til
              ytterligere detaljer som land, vekt og ingredienser for å forbedre
              søket.
              <br />
              Eksempler på søk «Kina», «2kg», «glutenfri, limeblad og
              sitrongress». */}
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default InfoModal;
