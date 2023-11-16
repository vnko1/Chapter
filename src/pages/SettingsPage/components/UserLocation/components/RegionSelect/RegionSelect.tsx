import { FC, useState, useEffect, useRef } from "react";

import { useOutsideClick } from "@/src/hooks";
import { StateSelectProps } from "./RegionSelect.type";
import styles from "../../UserLocation.module.scss";

import Field from "../Field/Field";
import SelectMenu from "../SelectMenu/SelectMenu";
import { Animation } from "@/src/components";

const StateSelect: FC<StateSelectProps> = ({
  regionList,
  countryId,
  regionId,
  selectedRegion,
  transitionTimeOut,
  setSelectedRegion,
  setSelectedCity,
  setIsLoading,
  setCitiesList,
  setRegionId,
  setCityId,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const stateRef = useRef(null);
  useOutsideClick(stateRef, setMenuIsOpen);

  useEffect(() => {
    const state = regionList.find((state) => state.id === regionId);
    state && setSelectedRegion(state.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId, regionList]);

  const isShowing =
    !!(countryId && regionList.length) || !!(regionList.length && regionId);

  const transitionClassNames = {
    enter: styles["select-menu-enter"],
    enterActive: styles["select-menu-enter-active"],
    exit: styles["select-menu-exit"],
    exitActive: styles["select-menu-exit-active"],
  };

  return (
    <Animation
      isMount={isShowing}
      nodeRef={stateRef}
      timeout={transitionTimeOut}
      mountOnEnter
      unmountOnExit
      classNames={transitionClassNames}
    >
      <label ref={stateRef} className={styles["location-form__label"]}>
        <Field
          selectMenuIsOpen={menuIsOpen}
          selectedValue={selectedRegion}
          setSelectedValue={setSelectedRegion}
          setSelectMenuIsOpen={setMenuIsOpen}
          setId={setRegionId}
          setCitiesData={setCitiesList}
          setCitySelectedValue={setSelectedCity}
          setCityId={setCityId}
        />
        <SelectMenu
          type="state"
          menuIsOpen={menuIsOpen}
          data={regionList}
          selectedValue={selectedRegion}
          setSelectedValue={setSelectedRegion}
          setId={setRegionId}
          setSelectMenuIsOpen={setMenuIsOpen}
          setIsLoading={setIsLoading}
          countryId={countryId}
          setCitiesData={setCitiesList}
        />
      </label>
    </Animation>
  );
};

export default StateSelect;
