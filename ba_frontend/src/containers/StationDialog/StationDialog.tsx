import React from "react";
import { Dialog } from "../../components/Dialog/Dialog";
import { Plug, StationInfo } from "../../models/estation";

export interface IStationDialog {
  station: StationInfo;
  onCancelHandler: () => void;
}

export const StationDialog = (props: IStationDialog) => {
  const { onCancelHandler, station } = props;
  const { name, street, zipcode, plugs } = station;

  const formatZipCode = (zipCode: string): string => {
    const zipNumber = zipCode.split(" ", 1);
    const zipName = zipCode.substr(zipCode.indexOf(" ") + 1);
    const zipCodeFormatted = zipName + " " + zipNumber;
    return zipCodeFormatted;
  };

  const generatePlugTypes = (plugs: Plug[]) => {
    return plugs.map((p) => {
      return <li>{`${p.plugType} ${p.power} kW h - ${p.status}`}</li>;
    });
  };
  return (
    <Dialog
      className="StationDialog"
      title={name}
      onCancelHandler={onCancelHandler}
      onSaveHandler={() => {}}
      hideButtons={true}
    >
      <div className="StationDialog__body">
        <dl className="StationDialog__infos">
          <div>
            <dt>Adresse</dt>
            <dd>{`${street}, ${formatZipCode(zipcode)}`}</dd>
          </div>
          <div>
            <dt>Stecker</dt>
            <dd>
              <ul>{generatePlugTypes(plugs)}</ul>
            </dd>
          </div>
        </dl>
        <div className="StationDialog__action"></div>
      </div>
    </Dialog>
  );
};
